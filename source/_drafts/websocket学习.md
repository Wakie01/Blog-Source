---
title: websocket学习
comment: true
date: 2021-06-25 10:47:54
tags:
categories:
addrlink:
---

# WebSocket介绍

一般的前后端应用都是：前端请求、后端响应，即HTTP协议

可是有时候，我们需要后端主动给前端推送一些消息，而这就需要另一种协议了：**WebSocket协议**

- WebSocket 是独立的、创建在 TCP 上的全双工通信协议

- Websocket 通过HTTP/1.1 协议的101状态码进行握手
- 在进行全双工通信前，需要创建WebSocket连接，由浏览器发出请求，服务器进行回应，这个过程通常称为“握手”（handshaking）



# Spring Boot整合WebSocket

导入maven依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

编写WebSocket配置类

```java

```



