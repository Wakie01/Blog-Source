---
title: rabbitmq学习
comment: true
date: 2021-06-22 11:25:25
tags:
categories:
addrlink:
---



# RabbitMQ安装

## Docker安装

1. 进入docker hub镜像仓库地址：https://hub.docker.com/

2. `docker pull`拉取镜像，选择带有“mangement”的版本（包含web管理页面）

3. 启动容器

   ```shell
   docker run -d --name rabbitmq_learn -p 5672:5672 -p 15672:15672 -v /home/wakie/docker_data/mq/data:/var/lib/rabbitmq --hostname myRabbit -e RABBITMQ_DEFAULT_VHOST=my_vhost  -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin 镜像ID
   ```

   >- `-d`：后台运行容器
   >- `–name`：指定容器名
   >- `-p` ：指定服务运行的端口（5672：应用访问端口；15672：控制台Web端口号）
   >- `-v` ：映射目录或文件
   >- `–hostname` ：主机名（RabbitMQ的一个重要注意事项是它根据所谓的 “节点名称” 存储数据，默认为主机名）
   >- `-e`：指定环境变量
   >  - RABBITMQ_DEFAULT_VHOST：默认虚拟机名
   >  - RABBITMQ_DEFAULT_USER：默认的用户名
   >  - RABBITMQ_DEFAULT_PASS：默认用户名的密码

4. 使用浏览器打开web管理端：http://Server-IP:15672

5. 安装配置完成





# RabbitMQ工作模式

RabbitMQ有六种工作模式：

1. 简单模式
2. 工作模式
3. 发布订阅模式
4. 路由模式
5. 主题模式
6. RPC模式



使用RabbitMQ需要引入如下依赖：

```xml
<dependencies>
    <dependency>
        <groupId>com.rabbitmq</groupId>
        <artifactId>amqp-client</artifactId>
        <version>5.4.3</version>
    </dependency>
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-api</artifactId>
        <version>1.8.0-alpha2</version>
    </dependency>
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-log4j12</artifactId>
        <version>1.8.0-alpha2</version>
    </dependency>
</dependencies>
```







## 简单模式

一个消息队列，可以有多个生产者和多个消费者

消息队列中的消息取完就没

当有多个消费者时，默认轮询地往消息队列中取消息



**例子1：**

生产者：

```java
package com.my.simple;

import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.io.IOException;
import java.util.Scanner;
import java.util.concurrent.TimeoutException;

public class Producer {

    public static void main(String[] args) {
        //创建连接工厂,并设置连接信息
        ConnectionFactory factory=new ConnectionFactory();
        factory.setHost("192.168.220.147");
        factory.setPort(5672);
        factory.setUsername("admin");
        factory.setPassword("admin");
        factory.setVirtualHost("my_vhost");
        Connection connection;
        try {

            /*
             * 与rabbitmq服务器建立连接,
             * rabbitmq服务器端使用的是nio,会复用tcp连接,
             * 并开辟多个信道与客户端通信
             * 以减轻服务器端建立连接的开销
             */
            connection = factory.newConnection();

            //建立信道
            Channel channel = connection.createChannel();

            /*
             * 声明队列,会在rabbitmq中创建一个队列
             * 如果已经创建过该队列，就不能再使用其他参数来创建
             *
             * 参数含义:
             *   -queue: 队列名称
             *   -durable: 队列持久化,true表示RabbitMQ重启后队列仍存在
             *   -exclusive: 排他,true表示限制仅当前连接可用
             *   -autoDelete: 当最后一个消费者断开后,是否删除队列
             *   -arguments: 其他参数
             */
            channel.queueDeclare("msgQueue",false,false,false,null );
            Scanner scanner=new Scanner(System.in);
            while(true){
                System.out.print("请输入要发送的消息（退出Exit）：");
                String sendText=scanner.nextLine();
                if(sendText.equals("Exit")) break;

                /*
                 * 发布消息
                 * 这里把消息向默认交换机发送.
                 * 默认交换机隐含与所有队列绑定,routing key即为队列名称
                 *
                 * 参数含义:
                 * 	-exchange: 交换机名称,空串表示默认交换机"(AMQP default)",不能用 null
                 * 	-routingKey: 对于默认交换机,路由键就是目标队列名称
                 * 	-props: 其他参数,例如头信息
                 * 	-body: 消息内容byte[]数组
                 */
                channel.basicPublish("","msgQueue",null,sendText.getBytes());

                System.out.println("消息已发送");
            }

            connection.close();

        } catch (IOException e) {
            e.printStackTrace();
        } catch (TimeoutException e) {
            e.printStackTrace();
        }
    }
}
```

消费者：

```java
package com.my.simple;

import com.rabbitmq.client.*;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class Consumer {

    public static void main(String[] args) {
        //创建连接工厂，并配置连接信息
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("192.168.220.147");
        factory.setPort(5672);
        factory.setUsername("admin");
        factory.setPassword("admin");
        factory.setVirtualHost("my_vhost");
        try {

            /*
             * 与rabbitmq服务器建立连接,
             * rabbitmq服务器端使用的是nio,会复用tcp连接,
             * 并开辟多个信道与客户端通信
             * 以减轻服务器端建立连接的开销
             */
            Connection connection = factory.newConnection();

            //建立信道
            Channel channel = connection.createChannel();


            /*
             * 声明队列,会在rabbitmq中创建一个队列
             * 如果已经创建过该队列，就不能再使用其他参数来创建
             *
             * 参数含义:
             *   -queue: 队列名称
             *   -durable: 队列持久化,true表示RabbitMQ重启后队列仍存在
             *   -exclusive: 排他,true表示限制仅当前连接可用
             *   -autoDelete: 当最后一个消费者断开后,是否删除队列
             *   -arguments: 其他参数
             */
            channel.queueDeclare("msgQueue", false, false, false, null);
            System.out.println("等待接受数据");
            
            //收到消息后用来处理消息的回调对象
            DeliverCallback deliverCallback = new DeliverCallback() {
                public void handle(String consumerTag, Delivery message) throws IOException {
                    String msg=new String(message.getBody(),"UTF-8");
                    System.out.println("收到："+msg);
                }
            };

            //消费者取消时的回调对象
            CancelCallback cancelCallback = new CancelCallback() {
                public void handle(String consumerTag) throws IOException {

                }
            };

            channel.basicConsume("msgQueue",true,deliverCallback,cancelCallback);

        } catch (IOException e) {
            e.printStackTrace();
        } catch (TimeoutException e) {
            e.printStackTrace();
        }
    }
}
```

结果：

<img src="D:\blog\source\_drafts\rabbitmq学习\1.png" alt="image-20210623153211378" style="zoom:67%;" />

<img src="D:\blog\source\_drafts\rabbitmq学习\2.png" alt="image-20210623153253993" style="zoom:80%;" />

<img src="D:\blog\source\_drafts\rabbitmq学习\3.png" alt="image-20210623153331241" style="zoom:80%;" />

<img src="D:\blog\source\_drafts\rabbitmq学习\4.png" alt="image-20210623153349511" style="zoom:80%;" />

<img src="D:\blog\source\_drafts\rabbitmq学习\5.png" alt="image-20210623153405038" style="zoom:80%;" />







# Spring Boot整合RabbitMQ

导入maven依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

在application.yml中配置RabbitMQ服务器

```java
spring:
	#配置rabbitMq 服务器
  	rabbitmq:
    host: 192.168.220.147
    port: 5672
    username: admin
    password: admin
    #虚拟host 可以不设置,使用server默认host
    virtual-host: my_vhost
```

编写RabbitMQ配置类

```java

```







参考：

[docker 安装rabbitMQ（最详细）以梦为马，不负韶华-CSDN博客](https://blog.csdn.net/qq_21077715/article/details/103386522)

[RabbitMQ_wanght笔记-CSDN博客](https://blog.csdn.net/weixin_38305440/article/details/102810522?utm_source=app&app_version=4.7.0&code=app_1562916241&uLinkId=usr1mkqgl919blen)