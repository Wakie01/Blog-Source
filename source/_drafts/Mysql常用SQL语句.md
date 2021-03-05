---
title: Mysql常用SQL语句
comment: true
date: 2021-01-11 21:16:33
tags:
categories:
addrlink:
---

这篇文章主要是想重温一下关于Mysql***增删改查***的SQL语句

在这里首先假设几个表：

```sql
Menu(
	id,int(11) unsigned,primary key,auto increment;
    name,varchar(20),not null;
    quantity,int(10) unsigned,not null;
    price,double(10,2) unsigned,not null;
    description,varchar(100);
    image,varchar(50);
    typeId,int(10) unsigned,not null
)

Bill(
	id,int(11) unsigned,primary key,auto increment;
	deskId,int(11) unsigned,not null;
	orderTime,datetime;
	finish,bit(1),not null;
	userId,int(10) unsigned;
)

MenuBill(
	billId,int(11) unsigned,not null;
    menuId,int(11) unsigned,not null;
    quantity,int(11) unsigned,not null;
    finish,bit(1) not null;
    menuTime,datetime;
    userId,int(11)
)
```



# 增

## INSERT语句

INSERT语句有几种常用的用法：

1. 简写

   ```sql
   insert into Bill values(1,1,NOW(),0,1);
   ```

   这样写要按顺序，一一对应

2. 完整一点

   ```sql
   insert into Bill(deskId,orderTime,finish) values(1,NOW(),0);
   ```

   直接表明插入到哪里

3. 插入多个

   ```sql
   insert into Bill(deskId,orderTime,finish) values(1,NOW(),0),(2,NOW(),0),(3,NOW(),1);
   ```

## REPLACE语句

- 作用：当我们在插入一条数据时，如果该数据已存在，则会替换掉旧的数据，没有的话就直接插入

  ```sql
  replace into Bill(id,deskId,finish) values(1,1,0);
  ```

  注意：是通过主键来判断数据是否存在的

  REPLACE语句也是可以插入多个的，与INSERT语句的一样

## INSERT IGNORE语句

- 作用：与REPLACE语句相反，当我们在插入一条数据时，如果该数据已存在，则会跳过不插入，没有的话就直接插入

  ```sql
  insert ignore into Bill(id,deskId,finish) values(1,1,0),(2,3,0);
  ```

  也是通过主键来判断数据是否存在的

  也是可以插入多个的，与INSERT语句的一样

## INSERT SELECT语句

- 作用：将从A表查询到的数据插入到B表中，这样可以实现较快速的多个插入

  ```sql
  insert into B(name,age,class) select(name,age,class) from A;
  ```

  字段的类型对应上就行

# 删

## DELETE语句

```sql
delete from bill;       //删除bill表中的所有数据
delete from bill where id=1;        //删除对应的数据
delete from bill order by orderTime limit 2;       //删除以orderTime从小到大排序的前2条数据
```



# 改

## UPDATE语句

```sql
update menubill set finish=1,menuTime=NOW(),userId=1 where billId=1 and menuId=1;
```

用法：

- 当更新多个列时，用逗号隔开
- 若没有where子句，则表示更新表中的所有行

## UPDATE JOIN语句



# 查

## 普通查询

```sql
select * from bill wehre orderTime>20210101010101;     //查询全部字段
select id,deskId,orderTime from bill wehre orderTime>20210101010101;       //查询对应字段
```

在平常的开发中，都建议第二种写法

- **相似点：** 在查询的列数相同的情况下，二者的速度是差不多的

- **区别：** 当查询的列数不一样时，速度是不一样的，尤其是当查询的列存在索引时。而且，第二种是明显方便他人读懂程序，方便合作对接。还有，当表结构修改时，第二种写法也会对代码的影响小很多



## 四则运算查询

四则运算指：加减乘除

```sql
select id,name,quantity,price,quantity * price as benefit from menu;
```



## 条件查询

就是使用`where`关键字


where后面的条件可以用>、<、>=、<=、!=等多种比较运算符，多个条件之间可以用or、and等逻辑运算符



## 排序和限制

```sql
//对price升序排列，查询50条数据
select id,name,quantity,price from menu order by price limit 50; 
```

`order by`默认升序排列，也可以手动设置，asc：升序；desc：降序；



## 去重查询

这里用到了`distinct`关键字



# 条件字段

## JOIN

join关键字是用来连接两张表的，比如内连接、外连接、左连接、外连接、自然连接

![img](D:\blog\source\_drafts\Mysql常用SQL语句\1.jpg)

### LEFT JOIN 左连接





<br/>

<br/>

参考：

1.[使用SQL语句插入当前系统时间](https://blog.csdn.net/qq_40087415/article/details/87397402)

2.[MySQL中添加或插入语句(Insert)的几种使用方式](https://blog.csdn.net/qq_40194399/article/details/94554191)

3.[MySQL的JOIN（一）：用法](https://www.cnblogs.com/fudashi/p/7491039.html)

4.[Mysql—— 内连接、左连接、右连接以及全连接查询](https://blog.csdn.net/zjt980452483/article/details/82945663)