---
title: java与javaw命令
comment: true
date: 2020-07-20 14:27:31
tags: 
- Java
categories: 
- Java
addrlink: 1428
---


## 前言

之前运行jar包，都是使用下面命令 

``` bash
 java -jar xxx.jar
```

今天接触到另一种：`javaw` ，记录一下

## 笔记

`javaw`运行jar包也是类似：

``` bash
 javaw -jar xxx.jar
```

- 两者对比

  1. `java`   在cmd命令窗口运行，并占据这个命令窗口，属于阻塞程序，可用Ctrl+C结束

  2. `javaw`  在cmd命令窗口运行，但并不占据这个命令窗口，在运行这条命令后可继续运行其它命令，相当于在后台运行，属于非阻塞程序，不可用Ctrl+C结束，但可在任务窗口结束进程


## 总结

都差不多，效果是一样的，不过据说`javaw`好像比`java`的反应速度慢一点

