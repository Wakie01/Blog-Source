---
title: Maven学习
comment: true
date: 2021-04-26 16:37:43
tags:
categories:
addrlink:
---



# 父工程

使用maven创建父工程，有利于

- 统一管理依赖以及版本号
- 子工程使用依赖时无需指定版本号

例子：

父工程的pom.xml文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.my</groupId>
    <artifactId>shiroLearn</artifactId>
    <version>1.0-SNAPSHOT</version>

    <!-- 集中定义依赖版本号   -->
    <properties>
        <junit.version>4.12</junit.version>
        <commons.logging.version>1.1.3</commons.logging.version>
        <shiro.core.version>1.4.1</shiro.core.version>
    </properties>

    <!-- 管理jar包，不会引入 ，如果子工程需要哪些jar包，则具体地在子工程中引入，不过不需要写版本号-->
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>junit</groupId>
                <artifactId>junit</artifactId>
                <version>${junit.version}</version>
                <scope>test</scope>
            </dependency>

            <dependency>
                <groupId>commons-logging</groupId>
                <artifactId>commons-logging</artifactId>
                <version>${commons.logging.version}</version>
            </dependency>

            <dependency>
                <groupId>org.apache.shiro</groupId>
                <artifactId>shiro-core</artifactId>
                <version>${shiro.core.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>
</project>
```

子工程的pom.xml文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <!-- 表明父工程 -->
    <parent>
        <artifactId>shiroLearn</artifactId>
        <groupId>com.my</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.my</groupId>
    <artifactId>authenticationLearn</artifactId>

    <!-- 在子工程中引入父工程的依赖可以不用写版本号 -->
    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>commons-logging</groupId>
            <artifactId>commons-logging</artifactId>
        </dependency>

        <dependency>
            <groupId>org.apache.shiro</groupId>
            <artifactId>shiro-core</artifactId>
        </dependency>
    </dependencies>
</project>
```



# 常见报错

- **问题：** expected START_TAG or END_TAG not TEXT（position:...)

  就是maven的`setting.xml`文件某位置存在格式错误，比如多个Tab、多个换行，然后它识别不出来，删掉就好

- **问题：** idea旁边的maven小窗口中的dependencies下的依赖总报红，可是那些依赖是已经导入成功的

  在pom.xml文件中将报红的依赖注释掉，然后sync一下，然后再将报红的依赖去掉注释，然后再sync一下

- **问题：** can't access仓库地址

  maven配置仓库地址有问题，阿里云仓库配置：[阿里云仓库服务](https://maven.aliyun.com/mvn/guide)























