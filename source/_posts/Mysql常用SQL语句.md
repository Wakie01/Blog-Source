---
title: Mysql常用SQL语句
comment: true
date: 2021-01-11 21:16:33
tags: Mysql
categories: DB
addrlink: 1657
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
delete from bill;       -- 删除bill表中的所有数据
delete from bill where id=1;        -- 删除对应的数据
delete from bill order by orderTime limit 2;       -- 删除以orderTime从小到大排序的前2条数据
```



## TRUNCATE语句

```sql
truncate table bill；    -- 清空bill表数据
```

二者对比：

- 相同点：都可删除数据，都不会影响表结构 

- 区别：delete不会影响自增，而truncate会

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

select语法：

```sql
select [all | distinct]
{* | table.* | [table.field1 [as alias1] [,table.field2 [as alias2]] [,...]]}
from table_name [as table_alias]
	[left | right | inner join table_name2]  -- 联合查询
	[where ...]  -- 指定结果需满足的条件
	[group by ...]  -- 指定结果按照哪几个字段来分组
	[having ...]  -- 过滤分组的记录必须满足的次要条件
    [order by ...]  -- 指定查询记录按一个或多个条件排序
    [limit {[offset,] row_count | row_countOFFSET offset }]  -- 指定查询的记录从哪条至哪条
	;
```

符号意思：

```sql
[]   -- 可选
{}   -- 必选
|   -- 或
```





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

`order by` ：默认升序排列，也可以手动设置，asc：升序；desc：降序；

`limit 50` ：从0开始查询，限制（查询）50条数据

`limit 40 50` ：从40开始查询，限制（查询）50条数据

例子1：

```sql
/*
查询参加 数据库结构-1 考试的学生信息： 学号，学生姓名，科目名，分数
涉及到的表：学生表、成绩表、科目表
交叉点：studentNo、subjectNo
条件：subjectName
排序：studentResult，降序
*/
select s.studentNo,s.studentName,subjectName,studentResult
from student s
inner join result r on s.studentNo=r.studentNo
inner join subject sub on r.subjectNo=sub.subjectNo
where subjectName='数据库结构-1'
order by studentResult desc;   
```

例子2：

```sql
/*
查询“Java第一学年”课程成绩排名前十，并且分数要大于80的学生信息：学号，学生姓名，科目名，分数
涉及到的表：学生表、成绩表、科目表
交叉点：studentNo、subjectNo
条件：subjectName，subjectresult
排序：studentResult，降序
限制：10
*/
select s.studentNo,s.studentName,subjectName,studentResult
from student s
inner join result r on s.studentNo=r.studentNo
inner join subject sub on r.subjectNo=sub.subjectNo
where subjectName='Java第一学年' and studentResult>80
order by studentResult desc
limit 10;
```



## 去重查询

这里用到了`distinct`关键字

```sql
-- 对查询结果进行去重
select distinct billId,finish from `menubill`;
```

当`distinct`应用到多个字段的时候，其应用的范围是其后面的所有字段，而不只是紧挨着它的一个字段，而且`distinct`只能放到所有字段的前面

与`distinct`对反的就是`all`关键字，当然默认是`all`



## 系统变量查询

```sql
select @@auto_increment_increment   -- 查询自增步长
```

常见系统变量：

```sql
@@auto_increment_increment      -- 自增步长

```



## 子查询

 对于子查询，它的查询顺序是由里及外，先执行里面的，再执行外面的

例子一：

```sql
select studentNo,subjectNo,studentResult 
from result
where subjectNo=(
	select subjectNo from subject 
    where subjectName='数据库结构-1'
)
order by studentResult desc;
```

例子二：

```sql
-- 子查询
select distinct s.studentNo,studentName,studentResult
from student s
inner join result r on r.studentNo=s.studentNo
where studentResult>=80 and subjectNo=(
	select subjectNo from subject
    where subjectName='高等数学-2'
);

-- 子查询
select studentNo,studentName 
from student
where studentNo in (
	select studentNo from result
    where studentResult>=80 and subjectNo=(
    	select subjectNo from subject 
        where subjectName='高等数学-2'
    )
);

-- 连表查询
select distinct s.studentNo,studentName,studentResult
from student s
inner join result r on s.studentNo=r.studentNo
inner join subject sub on sub.subjectNo=result.subjectNo
where subjectName='高等数学-2' and studentResult>=80;
```

一般来说，JOIN连表查询比子查询快。



## 函数查询

具体函数可到[mysql官网](https://dev.mysql.com/doc/refman/8.0/en/sql-function-reference.html)上看

```sql
select version();    -- 查询mysql版本号
```

### 常见函数

```sql
-- 系统
select version();    -- 查询mysql版本号
select user()   -- 获取当前用户

-- 数学函数
select celling(9.4)  -- 向上取整
select floor(9.4)   -- 向下取整
select rand()    -- 返回一个0~1之间的随机数
select sign(10)   -- 判断一个数的符号，0返回0，负数返回-1，正数返回1

-- 字符串函数
select char_length('hello world')   -- 字符串长度
select concat('hello','world','!!!')   -- 拼接字符串
select lower('Hello World')  -- 转小写
select upper('hello world')   -- 转大写

-- 时间日期函数
select current_date()    -- 获取当前日期
select now()     -- 获取当前时间
select localtime()    -- 获取本地时间
select year(now())  -- 获取当前时间的年
select month(now())   -- 获取当前时间的月
select day(now())  -- 获取当前时间的日
select hour(now())  -- 获取当前时间的时
select minute(now())  -- 获取当前时间的分
select second(now())  -- 获取当前时间的秒

-- 加密函数
MD5('123456')  -- 将123456加密成MD5

```



### 聚合函数

**count()函数**

```sql
-- 获取表中数据的个数
select count(bornDate) from student;
select count(*) from student;
select count(1) from student;
```

区别：

- count(字段) ，会忽略所有的null值

- count(*) ，count(1)，都不会忽略null值，都差不多，其本质都在计算行数



**sum()函数**

总和函数

```sql
select sum(studentResult) as '总和' from student;
```

**avg()函数**

平均值函数

```sql
select avg(studentResult) as '平均分' from student;
```

**max()函数**

最大值函数

```sql
select max(studentResult) as '最高分' from student;
```

**min()函数**

最小值函数

```sql
select min(studentResult) as '最低分' from student;
```



## 分组和过滤

分组：group by…… 

过滤：having ……

注意：`where`不能放在`group by` 后，对于分组的过滤只能用`having`

例子：

```sql
/*
查询各个科目的最低分，最高分，平均分，并且平均分要大于80
涉及到表：result,subject
关联点：subjectNo
分组点：subjectNo
过滤点：studentResult
*/
select subjectName,min(studentResult) as '最低分',avg(studentResult) as '最高分',avg(studentResult) as '平均分'
from result r
inner join subject sub on r.subjectNo=sub.subjectNo
group by subjectNo
having '平均分'>80;
```





# 条件字段

## WHERE

常用条件有：

- =、>、>=、<、<=、!=（不等于）、<>（不等于）、between A and B（[A，B]）

  between 例子：

  ```sql
  select name,quantity,price,description from menu WHERE price BETWEEN 0 and 20;
  ```

  

- is null、is not null、like、in、 

  **like：** %，代表通配0到多个字符            _，代表通配一个字符

  like例子：

  ```sql
  -- 查询name字段的第一个字为大的数据
  select name,quantity,price,description from menu WHERE name like '大%';
  
  -- 查询name字段中有奶的数据
  select name,quantity,price,description from menu WHERE name like '%奶%';
  
  -- 查询name字段中的头两个字为瘦肉，并且数据长度为3的数据
  select name,quantity,price,description from menu WHERE name like '瘦肉_';
  
  select name,quantity,price,description from menu WHERE name like '_奶%';
  ```

  in例子：

  ```sql
  -- 查询typeId为1or2or3的数据 
  select name,quantity,price,description from menu WHERE typeId in(1,2,3);
  ```

- and、&&、or、



## JOIN

join关键字是用来连接两张表的，比如内连接、外连接、左连接、外连接、自然连接

![img](.\Mysql常用SQL语句\1.jpg)



### 左、右、内连接

| 操作       | 描述                                       |
| ---------- | ------------------------------------------ |
| inner join | 如果表中至少有一个匹配，就返回行           |
| left join  | 会从左表中返回所有的值，即使右表中没有匹配 |
| right join | 会从右表中返回所有的值，即使左表中没有匹配 |

例子1：

```sql
/*
student、result、subject表连接查询，
交叉点：studentNo，subjectNo
*/
select s.studentNo,studentName,subjectName,studentResult
from student s
right join result r on r.studentNo=s.studentNo   
inner join subject sub on r.subjectNo=sub.subjectNo
;
```

例子2：

```sql
/*
查询参加 数据库结构-1 考试的学生信息： 学号，学生姓名，科目名，分数
涉及到的表：学生表、成绩表、科目表
交叉点：studentNo、subjectNo
条件：subjectName
*/
select s.studentNo,s.studentName,subjectName,studentResult
from student s
inner join result r on s.studentNo=r.studentNo
inner join subject sub on r.subjectNo=sub.subjectNo
where subjectName='数据库结构-1';
```



对于多张表的查询，慢慢来，先查询两张表，然后再慢慢增加



### 自连接

自连接就是自己的表和自己的表连接，核心：一张表拆为两张一样的表

**例子：**

有一个这样的表：

```sql
CREATE TABLE category (
	`categoryid` INT ( 3 ) NOT NULL COMMENT 'id',
	`pid` INT ( 3 ) NOT NULL COMMENT '父id 没有父则为1',
	`categoryname` VARCHAR ( 10 ) NOT NULL COMMENT '种类名字',
	PRIMARY KEY ( `categoryid` ) 
) ENGINE = INNODB CHARSET = utf8 COLLATE = utf8_general_ci;

INSERT INTO `school`.`category` ( `categoryid`, `pid`, `categoryname` )
VALUES
	( '2', '1', '信息技术' ),
	( '3', '1', '软件开发' ),
	( '5', '1', '美术设计' ),
	( '4', '3', '数据库' ),
	( '8', '2', '办公信息' ),
	( '6', '3', 'web开发' ),
	( '7', '5', 'ps技术' );
```

父类：

| 类型ID（categoryid） | 类型名（categoryName） |
| -------------------- | ---------------------- |
| 2                    | 信息技术               |
| 3                    | 软件开发               |
| 5                    | 美术设计               |

子类：

| 父ID（pid） | 类型ID（categoryid） | 类型名（categoryName） |
| ----------- | -------------------- | ---------------------- |
| 3           | 4                    | 数据库                 |
| 2           | 8                    | 办公信息               |
| 3           | 6                    | web开发                |
| 5           | 7                    | ps技术                 |

操作：查询父类对应的子类关系，即：

| 父类     | 子类     |
| -------- | -------- |
| 信息技术 | 办公信息 |
| 软件开发 | 数据库   |
| 软件开发 | web开发  |
| 美术设计 | ps技术   |

```sql
select a.categoryName as '父栏目',b.categoryName as '子栏目'
from category as a,category as b
where a.categoryid=b.pid;
```





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



跟事务相关的SQL：

```sql
-- mysql是默认开启事务自动提交的
set autocommit=0   -- 关闭事务自动提交
set autocommit=1   -- 开启事务自动提交（default）

-- 手动处理事务
set autocommit=0;

-- 事务开启
start transaction   -- 标记一个事务的开始，从此之后的sql都在同一个事务内

insert……
update……

-- 提交：持久化（成功）
commit

-- 回滚：回到原来的样子（失败）
rollback

-- 事务结束，重启事务自动提交
set autocommit=1;

-- 了解
savepoint 保存点名   -- 设置一个事务的保存点
rollback to savepoint 保存点名   -- 回滚到保存点
release savepoint 保存点名   -- 撤销保存点
```



例子：转账

```sql
-- 创建表
create database shop character set utf8 collate utf8_general_ci;

use shop;

create table account(
	id int(3) not null auto_increment,
    name varchar(30) not null,
    money decimal(9,2) not null,
    primary key(id)
)engine=innodb default charset=utf8;

insert into account(name,money) values
('A',2000.00),('B',10000,00);

-- 模拟转帐，转账是一个事务
set autocommit=0;  -- 关闭自动提交
start transaction;  -- 开启一个事务

update account set=money=money-500 where name='A';  -- A减500
update account set=money=money+500 where name='B';  -- B加500

commit;  -- 提交事务

set autocommit=1;  -- 事务结束，重启事务自动提交
```



# 索引(Index)

 索引(Index)是帮助Mysql高效获取数据的数据结构，（即索引是数据结构）

常见的索引有：

- 主键索引（Primary Key）：唯一的标识，主键不可重复，只能有一个列作为主键
- 唯一索引（Unique Key）：避免重复的列出现，唯一索引可以有多个，可以让多个列都标识为唯一索引
- 常规索引（Key/Index）：
- 全文索引（FullText Index）：用来快速定位数据，不过要在特定的数据库引擎下才有，不过现在InnoDB引擎也支持了



关于索引的SQL：

```sql
-- 显示所有的索引信息
show index from student;   -- 显示student表的索引信息

-- 增加全文索引
alter table menu add fulltext index 'menuName'(name) using btree;  -- 在menu表中以name列增加一个全文索引，全文索引名字为menuName

-- explain 分析sql执行的状况
explain select * from student;  -- 非全文索引
explain select * from student where match(studentName) against('刘');   -- 全文索引
```



例子一：测试索引

```sql
-- 创建表
CREATE TABLE `app_user` (
`id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
`name` VARCHAR(50) DEFAULT'' COMMENT'用户昵称',
`email` VARCHAR(50) NOT NULL COMMENT'用户邮箱',
`phone` VARCHAR(20) DEFAULT'' COMMENT'手机号',
`gender` TINYINT(4) UNSIGNED DEFAULT '0'COMMENT '性别（0：男;1:女）',
`password` VARCHAR(100) NOT NULL COMMENT '密码',
`age` TINYINT(4) DEFAULT'0'  COMMENT '年龄',
`create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8 COMMENT = 'app用户表';

-- 插入100万条数据
delimiter $$  -- 写函数之前必须要写，作为函数开头的标志
create function mock_data()  -- 创建一个函数，函数名为mock_data()
returns int   -- 函数返回类型为int
begin  -- 函数的开始
	-- 函数体
	declare num int default 1000000;   -- 声明变量，声明num=1000000
	declare i int default 0;   -- 声明i=0
	while i<num do   -- while循环
		insert into app_user(name,email,phone,gender,password,age) values
             (concat('用户',i),
             '947067507@qq.com',
             concat('18',floor(rand()*999999999)+100000000),
             floor(rand()*2),
             uuid(),
             floor(rand()*100));
        set i=i+1;
	end while;   -- 结束while循环
	return i; 
end;  -- 函数结束

select mock_data();   -- 执行mock_data()函数 
```

```sql
-- 有了数据后进行查询
explain select * from app_user WHERE name='用户999';  -- 没索引，结果显示查询了992465条数据

EXPLAIN select * from app_user WHERE id='999';   -- 主键索引，结果显示查询了1条数据

-- 创建索引
-- 常见的索引命名习惯：id_表名_字段名
create index id_app_user_name on app_user(name);   -- 对app_user表的name创建索引，索引名为id_app_user_name

EXPLAIN select * from app_user WHERE name='用户999';  -- name有了索引，结果显示查询了1条数据
```



索引原则：

- 索引不是越多越好
- 不要对经常变动的数据加索引
- 小数据量的表不需要加索引
- 索引一般加在常用来查询的字段上



索引的数据结构：

- Hash

- Btree



# 范式

 目前关系数据库有六种反射：第一范式（1NF）、第二范式（2NF）、第三范式（3NF）、第四范式（4NF）、第五范式（5NF）、第六范式（6NF），其中常用的就是前三种范式，即三大范式



**第一范式（1NF）**

要求数据库表的每一列都是不可分割的原子数据项



**第二范式（2NF）**

在1NF的基础上，非码属性必须完全依赖于候选码（在1NF基础上消除非主属性对主码的部分函数依赖）

通俗一点：2NF需要确保数据库表中的每一列都和主键相关，而不能只与主键的某一部分相关

目的：每张表只描述一件事情



**第三范式（3NF）**

在2NF的基础上，任何非主属性不依赖于其他非主属性（在2NF基础上消除传递依赖）

即：3NF需要确保数据表中的每一列数据都和主键直接相关，而不能间接相关





<br/>

<br/>

参考：

1.[使用SQL语句插入当前系统时间](https://blog.csdn.net/qq_40087415/article/details/87397402)

2.[MySQL中添加或插入语句(Insert)的几种使用方式](https://blog.csdn.net/qq_40194399/article/details/94554191)

3.[MySQL的JOIN（一）：用法](https://www.cnblogs.com/fudashi/p/7491039.html)

4.[Mysql—— 内连接、左连接、右连接以及全连接查询](https://blog.csdn.net/zjt980452483/article/details/82945663)

[MySQL索引背后的数据结构及算法原理](http://blog.codinglabs.org/articles/theory-of-mysql-index.html)