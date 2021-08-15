---
title: Redis学习
comment: true
date: 2021-08-08 10:14:23
tags:
categories:
addrlink:
---

# 安装

## 离线安装

Ubuntu离线安装Redis的话，系统需要先配置gcc环境

检查gcc环境：

```bash
gcc --version
g++ --verison
```

配好就可以开始安装了

下载Redis安装包：redis-6.2.5.tar.gz

在这里我选择安装到`/usr/local/redis`目录下

所以，将压缩包解压到安装目录下：

```bash
mv ./redis-6.2.5.tar.gz /usr/local/redis
tar -zxvf redis-4.0.2.tar.gz
```

然后进入解压后的redis目录，编译源代码：

```bash
cd redis-6.2.5
make MALLOC=libc
make install
```

修改配置文件`redis.conf`

当源代码编译完成后，会在该目录下生成一个`redis.conf`文件

```bash
## 修改以下内容
daemonize yes   ## 是否以后台daemon方式运行，默认不是后台运行
bind 0.0.0.0    ## 绑定主机IP，默认值为127.0.0.1，我这需要从主机连接虚拟机，所以需要更改
logfile "./logs/redis.log"    ## 定义log文件位置，模式log信息定向到stdout，输出到/dev/null（可选），在这里需要创建logs目录
requirepass 123456   ## 设置redis连接密码
```

启动redis

```bash
# 启动redis服务端
redis-server ./redis.conf

# 启动redis客户端
redis-cli [-h 127.0.0.1] [-p 6379]

# 关闭redis服务端
redis-cli shutdow
```



## 在线安装









# 概述

Redis是一个主流的非关系型数据库（NoSQL）

它是由C语言编写的高性能键值对数据库，其支持的键值数据类型有：

- 字符串类型
- 列表类型
- 有序集合类型
- 散列类型
- 集合类型



> NoSQL数据库可分为四大类：
>
> - 键值存储，典型：Redis
>   - 优点：快速查询
>   - 短板：存储数据缺少结构化
>   - 应用：内存缓存，主要用于处理大量数据的高访问负载
> - 列存储，典型：hbase
>   - 优点：快速查询
>   - 短板：功能局限
>   - 应用：分布式的文件系统
> - 文档数据库，典型：MongoDB
>   - 优点：数据结构要求不严格
>   - 短板：查询性能并非特别高，缺少统一查询的语法
>   - 应用：Web应用，与Key-Value类似，只不过该Value是结构化的
> - 图形数据库，典型：Infogate
>   - 优点：利用图结构的相关算法
>   - 短板：需要对整个图做算法分析，不利于分布式的集群方案
>   - 应用：社交网络，推荐系统等，专注与构建关系图谱



# 数据类型

首先对于Key，值得注意的是：

- 不要过长，最好不要超过1024个字节，过长的话，不仅消耗内存，也影响查找效率
- 最好统一命名规范



## 字符串String





# 集成Spring boot

Redis提供了16个数据库，每个数据库之间是隔离互不共享的，然后客户端默认连接使用的是0号数据库。



1. 引入依赖，`pom.xml`

   ```xml
   <!--redis-->
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-data-redis</artifactId>
   </dependency>
   ```

2. 配置，`application.yml`

   ```yaml
   spring:
     redis:
       host: 192.168.247.70   ## redis服务端地址
       port: 6379   
       password: 123456    ## 连接密码
       database: 0   ## 连接哪个数据库
   ```

3. 编写Redis工具类来增删改查Redis数据库

   在这里我选择使用`StringRedisTemplate`类