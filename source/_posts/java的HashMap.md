---
title: java的HashMap
comment: true
date: 2020-11-13 10:05:53
tags: java
categories: BackEnd
addrlink: 1017
---

java HashMap的查询时间复杂度为O(1)，why？

首先得说一下HashMap的put()方法

<div style="margin:0 auto;width:55%">

![img1](./java的HashMap/1.png)

</div>

然后说一下HashMap的containsKey(key)方法

<div style="margin:0 auto;width:55%">

![img2](./java的HashMap/2.png)

</div>



接下来的get(key)方法也是类似的。