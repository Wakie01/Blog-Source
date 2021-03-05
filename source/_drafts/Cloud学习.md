---
title: Spring Cloud学习
comment: true
date: 2021-02-03 11:18:16
tags:
categories:
addrlink:
---

# 微服务

## 是什么

因为各种原因，服务器对整个程序支持不下去了

所以就出现了一种想法：将整个程序拆分成多个服务模块，将各个服务模块分配到多个服务器上，这就是微服务

比如：

原来的一个程序是这样，多个业务集中到一起

<img src="D:\blog\source\_drafts\Cloud学习\1.png" alt="image-20210203113230847" style="zoom:80%;" />

现在随着业务的发展越来越大，一个服务器已经支持不了，这时就变成：

![image-20210203113904417](D:\blog\source\_drafts\Cloud学习\2.png)

将不同的服务分配到多个服务器上，用户业务与支付业务的没那么大，就分配到同一个服务器上，其他比较大的就各分配到一个服务器上

## 优缺点

### 优点

- 单一职责原则
- 每个服务足够内聚，足够小，聚焦一个指定的业务功能或业务需求
- 开发简单，开发效率提供
- 微服务可被小团队单独开发
- 微服务是松耦合的，无论是在开发阶段还是部署阶段都是独立的
- 不同的微服务间可用不同的语言开发
- 易于与第三方集成
- 因为小，所以更容易维护
- 有利于融合最新的技术
- 微服务只是业务逻辑的代码，不会和HTML、CSS或其他界面混合
- 每个微服务都有自己的存储能力，也可有自己的数据库



### 缺点

- 要处理分布式系统的复杂性
- 运维难度增大
- 系统部署依赖
- 服务间通信成本
- 数据一致性
- 系统集成测试
- 性能监控
- ……



> 关于微服务，可看看这两篇文章：[Microservices——a definition of this new architectural term](https://martinfowler.com/articles/microservices.html) 和 [汉化版的微服务（Microservices）——Martin Flower](https://www.cnblogs.com/liuning8023/p/4493156.html)]



这时候，会有4个核心问题：

1. 服务很多时，客户端该怎么访问？
2. 服务之间如何通信？

3. 这么多服务，如何治理？

4. 服务挂了怎么办？

   > 其实从上面这个图中可以发觉，要是其中一个服务崩掉了，或者一个通信崩掉了，那整个服务链都会崩掉，这时为了解决这个问题，就需要熔断机制了



为了解决这些问题而形成的一套框架，就叫`微服务框架`





# 微服务框架

## 是什么

通常而言，微服务架构是一种架构模式， 或者说是一种架构风格，**它提倡将单一的应用程序划分成一组小的服务**，每个服务运行在其**独立**的自己的进程内，服务之间互相协调，互相配置，为用户提供最终价值。服务之间采用轻量级的通信机制互相沟通，每个服务都围绕着具体的业务进行构建,并且能够被**独立**的部署到生产环境中，另外，应尽量避免统一的， 集中式的服务管理机制，**对具体的一一个服务而言，应根据业务上下文选择合适的语言、工具对其进行构建**，可以有一一个非常轻量级的集中式管理来协调这些服务，可以使用不同的语言来编写服务，也**可以使用不同的数据存储**



## 技术栈

常用的微服务框架有：

1. **Spring Cloud Netflix**

   一站式解决方案，上面的4个核心问题都能解决，不过已经停更了

   > 关于服务的访问，它有api网关、zuzl组件
   >
   > 关于服务间的通信，它有Feign
   >
   > 关于服务的治理，它有Eureka，服务注册发现
   >
   > 关于服务挂了，它有Hystrix熔断机制
   >
   > 等等

2. Apache Dubbo Zookeeper

   半自动，需要整合别人

   > 关于服务的访问，它没有api网关，需要找第三方组件，或者自己实现
   >
   > 关于服务间的通信，它有Dubbo，基于java的高性能服务通信框架
   >
   > 关于服务的治理，它有Zookeeper，服务注册发现
   >
   > 关于服务挂了，它没有熔断机制，也是需要找第三方组件，或者自己实现

3. Spring Cloud Alibaba

   最新的一站式解决方案

总的来说，常见的微服务技术栈有：

| 落地技术                                 | 微服务条目                                                   |
| ---------------------------------------- | ------------------------------------------------------------ |
| 服务开发                                 | Spring Boot，Spring，Spring MVC                              |
| 服务配置与管理                           | Netflix的Archaius，阿里的Diamond                             |
| 服务注册与发现                           | Eureka，Consul，Zookeeper                                    |
| 服务调用                                 | Rest、RPC、gRPC                                              |
| 服务熔断器                               | Hystrix、Envoy                                               |
| 负载均衡                                 | Ribbon、Nginx                                                |
| 服务接口调用（客户端调用服务的简化工具） | Feign                                                        |
| 消息队列                                 | Kafka、RabbitMQ、ActiveMQ                                    |
| 服务配置中心管理                         | Spring Cloud Config、Chef                                    |
| 服务路由（API网关）                      | Zuul                                                         |
| 服务监控                                 | Zabbix、Nagios、Metrics、Specatator                          |
| 全链路追踪                               | Zipkin、Brave、Dapper                                        |
| 服务部署                                 | Docker、OpenStack、Kubernetes                                |
| 数据流操作开发包                         | Spring Cloud Stream（封装与Redis、Rabbit、Kafka等发送接收消息） |
| 事件消息总线                             | Spring Cloud Bus                                             |



# Spring Cloud

## 概述

Spring Cloud，基于Spring Boot提供了一套微服务解决方案，包括服务注册与发现，配置中心，全链路监控，服务网关，负载均衡，熔断器等组件，除了基于NetFlix得开源组件做高度抽象封装外，还有一些选型中立得开源组件。

Spring Cloud利用Spring Boot的开发便利性，巧妙地简化了分布式系统基础设施的开发，Spring Cloud为开发人员提供了快速构建分布式系统的一些工具，**如配置管理，服务发现，断路器，路由，微代理，事件总线，全局锁，决策竞选，分布式会话等等**

Spring Cloud是分布式微服务架构下的一站式解决方案，是各个微服务架构落地技术的集合体，俗称微服务全家桶



## Spring Cloud和Spring Boot关系

- Spring Boot专注于快速开发单个个体微服务
- Spring Cloud是关注全局的微服务协调整理治理框架，它将Spring Boot开发的一个个单体微服务整合并管理起来，为各个微服务之间提供：配置管理，服务发现，断路器，路由，微代理，事件总线，全局锁，决策竞选，分布式会话等等集成服务
- Spring Boot可以离开Spring Cloud独立使用、开发项目，但Spring Cloud不能离开Spring Boot，属于依赖关系

总的来说，**Spring Boot专注于快速开发单个个体微服务；Spring Cloud关注全局的服务治理框架**



## Dubbo和Spring Cloud技术选型

### 分布式+服务治理Dubbo

目前成熟的互联网架构：应用服务化拆分+消息中间件

<img src="D:\blog\source\_drafts\Cloud学习\3.png" alt="image-20210206225918319"  />



### Dubbo和Spring Cloud对比

首先，社区活跃度，Spring Cloud比Dubbo高很多

然后，功能：

|              | Dubbo         | Spring                       |
| ------------ | ------------- | ---------------------------- |
| 服务注册中心 | Zookeeper     | Spring Cloud Netflix Eureka  |
| 服务调用方式 | RPC           | REST API                     |
| 服务监控     | Dubbo-monitor | Spring Boot Admin            |
| 断路器       | 不完善        | Spring Cloud Netflix Hystrix |
| 服务网关     | 无            | Spring Cloud Netflix Zuul    |
| 分布式配置   | 无            | Spring Cloud Config          |
| 服务跟踪     | 无            | Spring Cloud Sleuth          |
| 消息总线     | 无            | Spring Cloud Bus             |
| 数据流       | 无            | Spring Cloud Stream          |
| 批量任务     | 无            | Spring Cloud Task            |

最大区别：Spring Cloud抛弃了Dubbo的RPC通信，采用基于HTTP的REST方式

这两种方式各有优劣，从一定程度上说，REST方式牺牲了服务调用的性能，但避免了原生RPC带来的问题，而且REST比RPC更为灵活

总的来说，这两个就是组装机与品牌机的区别































