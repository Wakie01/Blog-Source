---
title: JDBC的Statement与PrepareStatement
comment: true
date: 2020-08-04 22:42:00
tags:
- jdbc
- mysql
categories: 
- jdbc
addrlink: 2243
---

## 二者区别

`Statement` 执行每一条SQL语句时，都是编译+执行，相当于静态SQL

`PrepareStatement` 执行的SQL语句，会进行预编译，SQL中可以包含动态参数，在执行时可以设置动态参数，当下次执行相同类型的SQL语句时，可以解析并直接执行编译好的SQL语句，从而减少编译次数提高数据库的性能，相当于动态SQL


## 选择

若只执行一次，或执行极少次的sql语句，一般会使用 `Statement` ，开销小

若批量执行同类型sql语句，则会使用 `PrepareStatement` 


## Statement

***使用*** 

```java
    Connection connection;
    try {
        Class.forName("com.mysql.cj.jdbc.Driver");
        String url="jdbc:mysql://localhost:3306/job_spider?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai";
        connection=DriverManager.getConnection(url,"root","wakie");
        Statement statement=connection.createStatement();

        for(int i=0;i<1000;i++){
            String sql="update job_info set salary_min="+(10000+(new Random().nextInt(10000)))+" where id="+(12026+i);
            statement.execute(sql);
        }
        return true;

    }catch (SQLException | ClassNotFoundException e) {
        e.printStackTrace();
        return false;
    }

```

更新1w条数据用时5166ms


## PrepareStatement

***优点***

1. 预编译，执行多个同类型sql语句时快

2. 安全，在一定程度上可以防止恶义SQL语法

    SQL语句每次都是 *重新编译* 执行的，这就导致你传进去的参数和SQL语句是有联系，可以改变原先SQL的 *功能结构* 


***使用***

批处理在url添加 `rewriteBatchedStatement=true` 使用效果更佳

配置 `rewriteBatchedStatement=true` 的

```java
    Connection connection;
    try {
        Class.forName("com.mysql.cj.jdbc.Driver");
        String url="jdbc:mysql://localhost:3306/job_spider?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai&rewriteBatchedStatements=true";
        connection=DriverManager.getConnection(url,"root","wakie");
        connection.setAutoCommit(false);    //关闭自动提交
        String sql="update job_info set salary_min=? where id=?";
        PreparedStatement preparedStatement=connection.prepareStatement(sql);

        for(int i=0;i<10000;i++){
            preparedStatement.setInt(1,10000+(new Random().nextInt(10000)));
            preparedStatement.setInt(2,(12020+i));
            preparedStatement.addBatch();
        }

        int [] result=preparedStatement.executeBatch();

        for(int i=0;i < result.length;i++){
            if(result[i]==0){
                return false;
            }
        }
        return true;
    }catch (SQLException | ClassNotFoundException e) {
        e.printStackTrace();
        return false;
    }

```

更新1w条数据用时2587ms


没有配置 `rewriteBatchedStatement=true` 的话，更新1w条数据用时3093ms






<br>

参考：
1.[~sky博文](https://blog.csdn.net/qq_38605328/article/details/102676402)
2.[sinat_30397435博文](https://blog.csdn.net/sinat_30397435/article/details/82320769)
