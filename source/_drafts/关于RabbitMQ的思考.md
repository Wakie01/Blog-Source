---
title: 关于RabbitMQ的思考
comment: true
date: 2021-11-16 19:00:04
tags:
categories:
addrlink:
---



RabbitMQ属于消息队列的一种，有**解耦、异步、削峰**的优点。

但又有以下缺点：

1. 系统可用性降低

   系统引入的外部依赖越多，越容易挂掉。本来你就是 A 系统调用 BCD 三个系统的接口就好了，ABCD 四个系统还好好的，没啥问题，你偏加个 MQ 进来，万一 MQ 挂了咋整？MQ 一挂，整套系统崩溃，你不就完了？

2. 系统复杂度提高

   硬生生加个 MQ 进来，你怎么保证消息没有重复消费？怎么处理消息丢失的情况？怎么保证消息传递的顺序性？

3. 一致性问题

   A 系统处理完了直接返回成功了，人都以为你这个请求就成功了；但是问题是，要是 BCD 三个系统那里，BD 两个系统写库成功了，结果 C 系统写库失败了，咋整？你这数据就不一致了。



