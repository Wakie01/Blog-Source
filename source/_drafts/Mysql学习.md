---
title: Mysql学习
comment: true
date: 2021-03-10 16:19:55
tags:
categories:
addrlink:
---



Mysql是典型的关系型数据库

数据库语言：

- **DDL：** 数据库定义语言
- **DML：** 数据库操作语言
- **DQL：** 数据库查询语言
- **DCL：** 数据库控制语言

注意：mysql关键字不区分大小写

# Mysql

## 基本操作

**连接数据库：**

```sql
mysql -u用户名 -p密码
--如：mysql -uroot -p123456
```

**查看所有数据库：**

```sql
show databases;
```

**切换数据库：**

```sql
use 数据库名 ;
--如：use mealSys;
```

**创建数据库：**

```sql
create database [if not exists] mealSys;    
-- 创建mealSys数据库
-- []代表可选
```

**删除数据库：**

```sql
drop database [if exists] mealSys;
```

**查看创建数据库的语句：**

```sql
show create database mealSys;
```

**查看创建表的语句：**

```sql
show create table student;
```

**查看数据库中的表：**

```sql
show tables;   --查看数据库中的所有表
describe student;     --查看stduent表结构
```

**修改表名：**

```sql
alter table student rename as student1;
```

**增加表字段：**

```mysql
alter table student add age int(11) unsigned not null;  --对student表增加age字段
```

**修改表字段约束：**

```mysql
alter table student modify age varchar(11);     -- 修改age字段属性
```

**修改表字段名：**

```mysql
alter table student change age age1;   -- 重命名age为age1
```

**删除表字段：**

```mysql
alter table student drop age1;    -- 删除age1字段
```

**删除表：**

```mysql
drop table [if exists] student;   
```



**退出连接：**

```sql
exit;
```

**查询版本号：**

```mysql
select version();
```



**sql语言注释：**

```sql
-- 单行注释

/*
多行注释
多行注释
*/
```



## 列类型

**数值：**

- tinyint：十分小的数据，1字节
- smallint：较小的数据，2字节
- mediumint：中等大小的数据，3字节
- int：标准的整数，4字节
- bigint：较大的整数，8字节
- float：浮点数，4字节
- double：浮点数，8字节
- decimal：字符串形式的浮点数（有助于处理精度的问题）



**字符串：**

- char：字符串固定大小
- varchar：可变字符串
- tinytext：微型文本
- text：文本串



**时间日期：**

- date：YYYY-MM-DD，日期格式
- time：HH:mm:ss，时间格式
- datetime：YYYY-MM-DD HH:mm:ss
- timestamp：时间戳，1970.1.1到现在的毫秒数
- year：年份



**null：**

- 没有值
- 注意，不要使用NULL进行运算，结果为NULL



## 字段属性

**Unsigned：**

- 无符号整数
- 表示该列不能为负数



**Zerofill：**

- 0填充，即不足的位数使用0来填充
- 如，字段A长度为10，然后给字段A存10，则这个数据会变成：0000000010，前8位填10



**自增：**

- 自动在上一条记录的基础上+1（default）
- 可自定义设计自增的起始值和步长



## 数据库引擎

常见的数据库引擎有`InnoDB`和`MyISAM`

|              | MyISAM | InnoDB                |
| ------------ | ------ | --------------------- |
| 事务处理     | 不支持 | 支持                  |
| 数据行锁定   | 不支持 | 支持                  |
| 外键         | 不支持 | 支持                  |
| 全文索引     | 支持   | 不支持                |
| 表空间的大小 | 较小   | 较大，约为MySIAM的2倍 |

MyISAM，节约空间，速度较快

InnoDB，安全性高，支持事务处理，多表多用户操作



**Q：在物理空间存在的位置？**

所有的数据库文件都存在mysql安装目录下的data目录中，其本质还是文件的存储

> 比如我默认安装的，data目录在`C:\ProgramData\MySQL\MySQL Server 8.0\Data`中





# 数据管理



# 事务(Transaction)

**事务**：将一组SQL放在一个批次中去执行，这一组SQL要么都执行成功，要么都执行失败

**事务原则：**ACID

- A，atomicity，原子性，事务中的所有操作作为一个整体像原子一样不可分割，要么全部成功,要么全部失败
- C，consistency，一致性，事务的执行结果必须使数据库从一个一致性状态到另一个一致性状态
- I，isolation，隔离性，并发执行的事务不会相互影响
- D，durability，持久性，事务一旦提交,其对数据库的更新就是持久的



**脏读：** 指一个事务读取了另一个事务未提交的数据

**幻读（虚读）：** 指在一个事务内读取到了别的事务插入的数据，导致前后读取不一致

**不可重复读：** 指在一个事务内读取表中的某一行数据，多次读取结果不同



