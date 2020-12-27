---
title: Java网络编程
comment: true
date: 2020-11-17 11:22:58
tags:
categories:
addrlink:
---

# 工具类

先介绍一下Java网络编程中常用到的一些工具类

## InetAddress类

**介绍：**

是互联网协议（IP）地址对象，封装了与该IP地址相关的所有信息，并提供获取信息的常用方法

**方法：**

```java
public static InetAddress getLocalHost()    //获取本地主机地址对象
public static InetAddress getByName(String host)    //根据主机名称获取地址对象
public static InetAddress[] getAllByName(String host)      //获取所有相关的地址对象
public String getHostAddress()        //获取IP地址字符串
public String getHostName()        //获取IP地址主机名
```

**使用：**

```java
public class Exercise1 {
	//输出百度的ip地址
    public void test(){
        try {
            InetAddress inetAddress=InetAddress.getByName("www.baidu.com");
            System.out.println(inetAddress.getHostAddress());
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
    }
    
    //输出百度的全部ip地址
    public void test2(){
        try {
            InetAddress[] inetAddresses=InetAddress.getAllByName("www.baidu.com");
            for(InetAddress inetAddress:inetAddresses){
                System.out.println(inetAddress.getHostAddress());
            }
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
    }

}
```



## Socket类

**介绍：** 

Socket，套接字，是网络中的一个通信节点，也是操作系统提供的一个网络通信的功能

其实Java的Socket类也是通过操作OS的Socket功能来实现的

然后，这个套接字在Java分为两大类：

- Socket：基于客户端的Socket
- ServerSocket：基于服务器端的Socket



## ServerSocket类

**作用：**

绑定套接字端口，在这个端口中等待网络中的请求，当请求进来时，进行处理并响应

**方法：**

```java
/* 常用构建方法 */
ServerSocket()      //创建一个没绑定端口的服务器套接字
ServerSocket(int port)      //创建一个绑定了端口的服务器套接字

/* 常用方法 */
public Socket accept()      //监听请求，并响应请求
public void bind(SocketAddress endpoint)      //给服务器套接字绑定ip地址
public void close();       //关闭ServerSocket，释放资源

```



# 实践

## 简单通信























