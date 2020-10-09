---
title: Mybatis Generator使用
comment: true
date: 2020-09-10 16:18:48
tags: Mybatis
categories:
- Mybatis
- BackEnd
addrlink: 1619
---

Mybatis Generator有多种使用方式，如Java运行、命令行、Maven插件，最常用的就是最后一个了

## Maven配置

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.mybatis.generator</groupId>
      <artifactId>mybatis-generator-maven-plugin</artifactId>
      <version>1.4.0</version>
    </plugin>
  </plugins>
</build>
