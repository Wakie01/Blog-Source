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
      <version>1.3.7</version>
      <configuration>
          <configurationFile>src/main/resources/generatorConfig.xml</configurationFile>
          <overwrite>true</overwrite>
      </configuration>
      <dependencies>
      <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.17</version>
      </dependency>
    </dependencies>
    </plugin>
  </plugins>
</build>

```

## Config配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">

<generatorConfiguration>
    <classPathEntry location="C:\Users\哈啰\.m2\repository\mysql\mysql-connector-java\8.0.22\mysql-connector-java-8.0.22.jar" />
    <context id="mysql" targetRuntime="MyBatis3Simple">
        <commentGenerator>
            <property name="suppressDate" value="true"/>
            <property name="suppressAllComments" value="true"/>
            <property name="addRemarkComments" value="true"/>
        </commentGenerator>

        <jdbcConnection driverClass="com.mysql.cj.jdbc.Driver"
                        connectionURL="jdbc:mysql://localhost:3306/mealsys?serverTimezone=Asia/Shanghai"
                        userId="root"
                        password="wakie"></jdbcConnection>

        <javaModelGenerator targetPackage="com.my.mealsys.entity"
                           targetProject="src/main/java">
            <property name="trimStrings" value="true"/>
        </javaModelGenerator>

        <sqlMapGenerator targetPackage="mapper" targetProject="src/main/resources"></sqlMapGenerator>

        <javaClientGenerator type="XMLMAPPER"
                             targetPackage="com.my.mealsys.mapper"
                             targetProject="src/main/java"></javaClientGenerator>

        <table tableName="bill" domainObjectName="Bill" delimitIdentifiers="true"
               enableCountByExample="false" enableDeleteByExample="false" enableSelectByExample="false"
               enableUpdateByExample="false" selectByExampleQueryId="false">
            <property name="useActualColumnNames" value="true" />
        </table>

        <table tableName="menu" domainObjectName="Menu" delimitIdentifiers="true"
               enableCountByExample="false" enableDeleteByExample="false" enableSelectByExample="false"
               enableUpdateByExample="false" selectByExampleQueryId="false">
            <property name="useActualColumnNames" value="true" />
        </table>

        <table tableName="menubill" domainObjectName="MenuBill" delimitIdentifiers="true"
               enableCountByExample="false" enableDeleteByExample="false" enableSelectByExample="false"
               enableUpdateByExample="false" selectByExampleQueryId="false">
            <property name="useActualColumnNames" value="true" />
        </table>

        <table tableName="menutype" domainObjectName="MenuType" delimitIdentifiers="true"
               enableCountByExample="false" enableDeleteByExample="false" enableSelectByExample="false"
               enableUpdateByExample="false" selectByExampleQueryId="false">
            <property name="useActualColumnNames" value="true" />
        </table>

        <table tableName="user" domainObjectName="User" delimitIdentifiers="true"
               enableCountByExample="false" enableDeleteByExample="false" enableSelectByExample="false"
               enableUpdateByExample="false" selectByExampleQueryId="false">
            <property name="useActualColumnNames" value="true" />
        </table>

    </context>
</generatorConfiguration>
```