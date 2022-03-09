---
title: mysql索引学习
comment: true
date: 2022-02-05 15:45:17
tags:
categories:
addrlink:
---

# 索引是？

索引是对数据库表中一列或多列的值进行排序的一种结构。MySQL索引的建立对于MySQL的高效运行是很重要的，索引可以大大提高MySQL的检索速度。索引只是提高效率的一个因素，如果你的MySQL有大数据量的表，就需要花时间研究建立最优秀的索引，或优化查询语句。

简单类比一下，数据库如同书籍，索引如同书籍目录，假如我们需要从书籍查找与 xx 相关的内容，我们可以直接从目录中查找，定位到 xx 内容所在页面，如果目录中没有 xx 相关字符或者没有设置目录（索引），那只能逐字逐页阅读文本查找，效率可想而知。



# 索引的优缺点

## 优点

- **索引大大减小了服务器需要扫描的数据量，从而大大加快数据的检索速度，这也是创建索引的最主要的原因。**
- **索引可以帮助服务器避免排序和创建临时表**
- **索引可以将随机IO变成顺序IO**
- 索引对于InnoDB（对索引支持行级锁）非常重要，因为它可以让查询锁更少的元组，提高了表访问并发性
- 关于InnoDB、索引和锁：InnoDB在二级索引上使用共享锁（读锁），但访问主键索引需要排他锁（写锁）
- 通过创建唯一性索引，可以保证数据库表中每一行数据的唯一性。
- 可以加速表和表之间的连接，特别是在实现数据的参考完整性方面特别有意义。
- 在使用分组和排序子句进行数据检索时，同样可以显著减少查询中分组和排序的时间。
- 通过使用索引，可以在查询的过程中，使用优化隐藏器，提高系统的性能。



索引可以大大提高MySQL的检索速度，为什么不对表中的每一个列创建一个索引呢？

## 缺点

- 创建索引和维护索引要***耗费时间***，这种时间随着数据量的增加而增加
- 索引需要占***物理空间***，除了数据表占用数据空间之外，每一个索引还要占用一定的物理空间，如果需要建立聚簇索引，那么需要占用的空间会更大
- 对表中的数据进行增、删、改的时候，索引也要动态的维护，这就降低了整体的***维护速度***
- 如果某个数据列包含许多重复的内容，为它建立索引就没有太大的实际效果。
- 对于非常小的表，大部分情况下简单的全表扫描更高效；



# 创建索引的准则

索引是建立在数据库表中的某些列的上面。因此，在创建索引的时候，应该仔细考虑在哪些列上可以创建索引，在哪些列上不能创建索引。



## 应该创建索引的列

- 在***经常需要搜索的列***上，可以加快搜索的速度
- 在作为***主键的列***上，强制该列的唯一性和组织表中数据的排列结构
- 在***经常用在连接（JOIN）的列***上，这些列主要是一外键，可以加快连接的速度
- 在***经常需要根据范围（<，<=，=，>，>=，BETWEEN，IN）进行搜索的列***上创建索引，因为索引已经排序，其指定的范围是连续的
- 在***经常需要排序（order by）的列***上创建索引，因为索引已经排序，这样查询可以利用索引的排序，加快排序查询时间；
- 在***经常使用在WHERE子句中的列***上面创建索引，加快条件的判断速度。



## 不该创建索引的列

- 对于那些在查询中***很少使用或者参考的列***不应该创建索引。
  若列很少使用到，因此有索引或者无索引，并不能提高查询速度。相反，由于增加了索引，反而降低了系统的维护速度和增大了空间需求。
- 对于那些只有***很少数据值或者重复值多的列***也不应该增加索引。
  这些列的取值很少，例如人事表的性别列，在查询的结果中，结果集的数据行占了表中数据行的很大比例，即需要在表中搜索的数据行的比例很大。增加索引，并不能明显加快检索速度。
- 对于那些定义为***text, image和bit数据类型的列***不应该增加索引。
  这些列的数据量要么相当大，要么取值很少。
- 当该列***修改性能要求远远高于检索性能***时，不应该创建索引。（修改性能和检索性能是互相矛盾的）



# 索引结构

MySQL中常用的索引结构（索引底层的数据结构）有：B-TREE ，B+TREE ，HASH 等。这部分强烈建议看[《MySQL体系构架、存储引擎和索引结构》](https://blog.csdn.net/wangfeijiu/article/details/112454405) 



## B-树

B-树就是B树，多路搜索树，树高一层意味着多一次的磁盘I/O，下图是3阶B树

![在这里插入图片描述](D:\blog\source\_drafts\mysql索引学习\1.png)



B树的特征：

- **关键字集合分布在整颗树中；**
- 任何一个关键字出现且只出现在一个结点中；
- **搜索有可能在非叶子结点结束；**
- 其搜索性能等价于在关键字全集内做一次二分查找；
- 自动层次控制；



## B+树

B+树是B-树的变体，也是一种多路搜索树

![在这里插入图片描述](D:\blog\source\_drafts\mysql索引学习\2.png)



B+树的特征：

- **所有关键字都出现在叶子结点的链表中（稠密索引），且链表中的关键字恰好是有序的；**
- **不可能在非叶子结点命中；**
- **非叶子结点相当于是叶子结点的索引（稀疏索引），叶子结点相当于是存储（关键字）数据的数据层；**
- 每一个叶子节点都包含指向下一个叶子节点的指针，从而方便叶子节点的范围遍历。
- 更适合文件索引系统；



## Hash

哈希索引就是采用一定的哈希算法，把键值换算成新的哈希值，检索时不需要类似B+树那样从根节点到叶子节点逐级查找，只需一次哈希算法即可立刻定位到相应的位置，速度非常快。

![img](D:\blog\source\_drafts\mysql索引学习\3.png)



虽然Hash索引效率高，但是Hash索引本身由于其特殊性也带来了很多限制和弊端，主要有以下这些：

1. 哈希索引只支持等值比较查询，包括**＝、 IN 、<=>** (注意<>和＜＝＞是不同的操作）。 不支持任何范围查询，例如WHERE price > 100。

2. Hash索引无法利用索引的数据来避免任何排序运算。

   由于Hash索引中存放的是经过Hash计算之后的Hash值，**而且Hash值的大小关系并不一定和Hash运算前的键值完全一样**，所以数据库无法利用索引的数据来避免任何排序运算;

3. Hash索引不能利用部分索引键查询

   对于组合索引，**Hash索引在计算Hash值的时候是组合索引键合并后再一起计算Hash值，而不是单独计算Hash值**，所以通过组合索引的前面一个或几个索引键进行查询的时候，Hash索引也无法被利用。

4. **Hash索引遇到大量Hash值相等的情况后性能并不一定就会比BTree索引高**。

5. Hash索引在任何时候都不能避免表扫描。　　
   前面已经知道，**Hash索引是将索引键通过Hash运算之后，将 Hash运算结果的Hash值和所对应的行指针信息存放于一个Hash表中**，由于不同索引键存在相同Hash值，所以即使取满足某个Hash键值的数据的记录条数，也无法从Hash索引中直接完成查询，还是要通过访问表中的实际数据进行相应的比较，并得到相应的结果。



## 补充：索引存储在文件系统中

**索引是占据物理空间的，在不同的存储引擎中，索引存在的文件也不同。**存储引擎是基于表的，以下分别使用MyISAM和InnoDB存储引擎建立两张表。

![存储引擎是基于表的，以下建立两张别使用MyISAM和InnoDB引擎的表，看看其在文件系统中对应的文件存储格式。](D:\blog\source\_drafts\mysql索引学习\4.png)



**存储引擎为MyISAM：**

- *.frm：与表相关的元数据信息都存放在frm文件，包括表结构的定义信息等

- *.MYD：MyISAM DATA，用于存储MyISAM表的数据

- *.MYI：MyISAM INDEX，用于存储MyISAM表的索引相关信息

  

**存储引擎为InnoDB：**

- *.frm：与表相关的元数据信息都存放在frm文件，包括表结构的定义信息等
- *.ibd：InnoDB DATA，表数据和索引的文件。该表的索引(B+树)的每个非叶子节点存储索引，叶子节点存储索引和索引对应的数据



# 索引分类

MySQL 的索引有两种分类方式：逻辑分类和物理分类。



## 逻辑分类

有多种逻辑划分的方式，比如按功能划分，按组成索引的列数划分等



### 按功能划分

- 主键索引：一张表只能有一个主键索引，不允许重复、不允许为 NULL；

  ```mysql
   ALTER TABLE TableName ADD PRIMARY KEY(column_list); 
  ```

- 唯一索引：数据列不允许重复，允许为 NULL 值，一张表可有多个唯一索引，索引列的值必须唯一，但允许有空值。如果是组合索引，则列值的组合必须唯一。

  ```mysql
  CREATE UNIQUE INDEX IndexName ON `TableName`(`字段名`(length));
  # 或者
  ALTER TABLE TableName ADD UNIQUE (column_list); 
  ```

- 普通索引：一张表可以创建多个普通索引，一个普通索引可以包含多个字段，允许数据重复，允许 NULL 值插入；

  ```mysql
  CREATE INDEX IndexName ON `TableName`(`字段名`(length));
  # 或者
  ALTER TABLE TableName ADD INDEX IndexName(`字段名`(length));
  ```

- 全文索引：它查找的是文本中的关键词，主要用于全文检索。（篇幅较长，下文有独立主题说明）



### 按列数划分

- 单例索引：一个索引只包含一个列，一个表可以有多个单例索引。
- 组合索引：一个组合索引包含两个或两个以上的列。查询的时候遵循 mysql 组合索引的*** “最左前缀”原则，即使用 where 时条件要按照建立索引的时候字段的排列方式放置索引才会生效***。



## 物理分类

分为***聚簇索引***和***非聚簇索引***（有时也称辅助索引或二级索引）

> 聚簇是，为了提高某个属性(或属性组)的查询速度，把这个或这些属性(称为聚簇码)上具有相同值的元组集中存放在连续的物理块。



### 聚簇索引

**聚簇索引（clustered index）不是单独的一种索引类型，而是一种数据存储方式。** 这种存储方式是依靠B+树来实现的，**根据表的主键构造一棵B+树且B+树叶子节点存放的都是表的行记录数据**时，方可称该主键索引为聚簇索引。**聚簇索引也可理解为将数据存储与索引放到了一块，找到索引也就找到了数据。**



聚簇索引的优点：

1. 数据访问更快，因为聚簇索引将索引和数据保存在同一个B+树中，因此从聚簇索引中获取数据比非聚簇索引更快
2. 聚簇索引对于主键的排序查找和范围查找速度非常快

缺点：

1. **插入速度严重依赖于插入顺序**，按照主键的顺序插入是最快的方式，否则将会出现页分裂，严重影响性能。因此，对于InnoDB表，我们一般都会定义一个自增的ID列为主键（*主键列不要选没有意义的自增列，选经常查询的条件列才好，不然无法体现其主键索引性能*）
2. **更新主键的代价很高**，因为将会导致被更新的行移动。因此，对于InnoDB表，我们一般定义主键为不可更新。
3. **二级索引访问需要两次索引查找**，第一次找到主键值，第二次根据主键值找到行数据。





### 非聚簇索引

**非聚簇索引：数据和索引是分开的，B+树叶子节点存放的不是数据表的行记录。**



虽然InnoDB和MyISAM存储引擎都默认使用B+树结构存储索引，但是**只有InnoDB的主键索引才是聚簇索引**，InnoDB中的辅助索引以及MyISAM使用的都是非聚簇索引。**每张表最多只能拥有一个聚簇索引。**



# 索引的实现

## InnoDB索引实现

InnoDB使用B+树存储数据，除了主键索引为聚簇索引，其它索引均为非聚簇索引。

一个表中只能存在一个聚簇索引（主键索引），但可以存在多个非聚簇索引。

所以，聚簇索引又称主键索引，非聚簇索引又称辅助索引或二级索引。



InnoDB表的索引和数据是存储在一起的，`.idb`表数据和索引的文件

![在这里插入图片描述](D:\blog\source\_drafts\mysql索引学习\5.png)



### 聚簇索引（主键索引）

B+树中的叶子节点包含数据表中行记录就是聚簇索引（索引和数据是存放在一块的）

下图为InnoDB主键索引的示意图：

![img](D:\blog\source\_drafts\mysql索引学习\6.png)



可以看到叶子节点包含了完整的数据记录，这就是聚簇索引。因为InnoDB的数据文件（.idb）按主键聚集，所以**InnoDB必须有主键（MyISAM可以没有），如果没有显示指定主键，则选取首个为唯一且非空的列作为主键索引，如果还没具备，则MySQL自动为InnoDB表生成一个隐含字段作为主键，这个字段长度为6个字节，类型为长整形。**



主键索引结构分析：

- B+树单个叶子节点内的行数据按主键顺序排列，物理空间是连续的（聚簇索引的数据的物理存放顺序与索引顺序是一致的）；
- 叶子节点之间是通过指针连接，相邻叶子节点的数据在逻辑上也是连续的（根据主键值排序），实际存储时的数据页（叶子节点）可能相距甚远。



### 非聚簇索引（辅助索引或二级索引）

在聚簇索引之外创建的索引（不是根据主键创建的）称之为辅助索引，**辅助索引访问数据总是需要二次查找**。辅助索引叶子节点存储的不再是行数据记录，而是主键值。首先通过辅助索引找到主键值，然后到主键索引树中通过主键值找到数据行。

下图为InnoDB辅助索引的示意图：

![在这里插入图片描述](D:\blog\source\_drafts\mysql索引学习\7.png)



### InnoDB索引优化

- **InnoDB中主键不宜定义太大**，因为辅助索引也会包含主键列，如果主键定义的比较大，其他索引也将很大。如果想在表上定义 、很多索引，则争取尽量把主键定义得小一些。InnoDB 不会压缩索引。
- **InnoDB中尽量不使用非单调字段作主键（不使用多列）**，因为InnoDB数据文件本身是一颗B+Tree，非单调的主键会造成在插入新记录时数据文件为了维持B+Tree的特性而频繁的分裂调整，十分低效，而使用自增字段作为主键则是一个很好的选择。



## MyISAM索引实现

MyISAM也使用B+Tree作为索引结构，但具体实现方式却与InnoDB截然不同。**MyISAM使用的都是非聚簇索引。**

MyISAM表的索引和数据是分开存储的，`.MYD`表数据文件 `.MYI`表索引文件

![在这里插入图片描述](D:\blog\source\_drafts\mysql索引学习\8.png)





### MyISAM主键索引

下图为MyISAM主键索引的原理图：

![在这里插入图片描述](D:\blog\source\_drafts\mysql索引学习\9.png)

可以看到**叶子节点的存放的是数据记录的地址**。也就是说索引和行数据记录是没有保存在一起的，所以MyISAM的主键索引是非聚簇索引。



### MyISAM辅助索引

在MyISAM中，主索引和辅助索引（Secondary key）在结构上没有任何区别，只是**主索引要求key是唯一的，而辅助索引的key可以重复**。 MyISAM辅助索引也是非聚簇索引。



## 索引检索过程

对于InnoDB和MyISAM而言，主键索引是根据主关键字来构建的B+树存储结构，辅助索引则是根据辅助键来构造的B+树存储结构，彼此的**索引树都是相互独立的**。



**InnoDB辅助索引的访问需要两次索引查找，第一次从辅助索引树找到主键值，第二次根据主键值到主键索引树中找到对应的行数据。**

**MyISM使用的是非聚簇索引，表数据存储在独立的地方，这两棵（主键和辅助键）B+树的叶子节点都使用一个地址指向真正的表数据。由于索引树是独立的，通过辅助键检索无需访问主键的索引树。**



假想一个表如下图存储了4行数据。其中Id作为主索引，Name作为辅助索引。下图清晰的显示了聚簇索引和非聚簇索引的差异。

<img src="https://img-blog.csdnimg.cn/20210201172450840.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dhbmdmZWlqaXU=,size_16,color_FFFFFF,t_70" alt="在这里插入图片描述" style="zoom:90%;" />



总的来说：

- 聚簇索引的叶子节点存放的是数据行（主键值也是行内数据），支持***覆盖索引***；而二级索引的叶子节点存放的是主键值或指向数据行的指针。
- 由于叶子节点(数据页)只能按照一棵B+树排序，故一张表只能有一个聚簇索引。辅助索引的存在不影响聚簇索引中数据的组织，所以一张表可以有多个辅助索引。



# 操作索引

## 创建索引

索引名称 index_name 是可以省略的，省略后，索引的名称和索引列名相同。

```mysql
-- 创建普通索引 
CREATE INDEX index_name ON table_name(col_name(length));

-- 创建唯一索引
CREATE UNIQUE INDEX index_name ON table_name(col_name(length));

-- 创建普通组合索引
CREATE INDEX index_name ON table_name(col_name_1(length),col_name_2(length));

-- 创建唯一组合索引
CREATE UNIQUE INDEX index_name ON table_name(col_name_1(length),col_name_2(length));
```

修改表结构创建索引：

```mysql
ALTER TABLE table_name ADD INDEX index_name(col_name(length));
```

创建表时直接指定索引：

```mysql
CREATE TABLE table_name (
    ID INT NOT NULL,
    col_name VARCHAR (16) NOT NULL,
    INDEX index_name (col_name(length))
);
```



## 删除索引

```mysql
-- 直接删除索引
DROP INDEX index_name ON table_name;

-- 修改表结构删除索引
ALTER TABLE table_name DROP INDEX index_name;
```



## 其它相关命令

```mysql
-- 查看表结构
desc table_name;

-- 查看生成表的SQL
show create table table_name;

-- 查看索引信息（包括索引结构等）
show index from  table_name;

-- 查看SQL执行时间（精确到小数点后8位）
set profiling = 1;
SQL...
show profiles;
```





# 索引实战

索引实战学习的基础，首先应该学会分析SQL的执行，使用`EXPLAIN关键字`可以模拟优化器执行SQL查询语句



## EXPLAIN

使用EXPLAIN关键字可以模拟优化器执行SQL查询语句，从而知道MySQL是如何处理SQL语句。

使用格式：`explain sql...;`

看一下EXPLAIN 查询结果包含的字段（v5.7）

```bash
mysql> explain select * from student;
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------+
| id | select_type | table   | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra |
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------+
|  1 | SIMPLE      | student | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    2 |   100.00 | NULL  |
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------+
```

- id：选择标识符
- select_type：表示查询的类型。
- table：输出结果集的表
- partitions：匹配的分区
- type：表示表的连接类型，常见的值有：
  - const：通过索引一次就查询到
  - ref：非唯一索引等值扫描
  - range：范围索引扫描
  - index：索引扫描
  - all：全表扫描
- possible_keys：表示查询时，可能使用的索引
- key：表示实际使用的索引
- key_len：索引字段的长度
- ref：列与索引的比较
- rows：扫描出的行数（***估算***的行数）
- filtered：按表条件过滤的行百分比
- Extra：执行情况的描述和说明，常见的值有：
  - Using index：select 操作使用了覆盖索引
  - Using index condition，Using where，其中Using index 表示使用了覆盖索引



下面举一个例子来说明一下上述字段。

建表：

```mysql
create table student(
 id int auto_increment primary key,   # 主键索引
 name varchar(255) not null,
 c_id int,
 phone char(11),
 guardian varchar(50) not null,
 qq varchar(20) not null,   
 index stu_class_phone (name,c_id,phone),  # 组合索引
 index qq (qq)   # 索引
)engine=innodb charset=utf8;
```

<img src="D:\blog\source\_drafts\mysql索引学习\12.png" alt="在这里插入图片描述"  />

```bash
mysql> explain select * from student where name='Joe';
+----+-------------+---------+------------+------+-----------------+-----------------+---------+-------+------+----------+-------+
| id | select_type | table   | partitions | type | possible_keys   | key             | key_len | ref   | rows | filtered | Extra |
+----+-------------+---------+------------+------+-----------------+-----------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | student | NULL       | ref  | stu_class_phone | stu_class_phone | 767     | const |    1 |   100.00 | NULL  |
+----+-------------+---------+------------+------+-----------------+-----------------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)

mysql> explain select * from student where name='Joe' and c_id=2;
+----+-------------+---------+------------+------+-----------------+-----------------+---------+-------------+------+----------+-------+
| id | select_type | table   | partitions | type | possible_keys   | key             | key_len | ref         | rows | filtered | Extra |
+----+-------------+---------+------------+------+-----------------+-----------------+---------+-------------+------+----------+-------+
|  1 | SIMPLE      | student | NULL       | ref  | stu_class_phone | stu_class_phone | 772     | const,const |    1 |   100.00 | NULL  |
+----+-------------+---------+------------+------+-----------------+-----------------+---------+-------------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)

mysql> explain select * from student where name='Joe' and c_id=2 and phone='13500000000';
+----+-------------+---------+------------+------+-----------------+-----------------+---------+-------------------+------+----------+-------+
| id | select_type | table   | partitions | type | possible_keys   | key             | key_len | ref               | rows | filtered | Extra |
+----+-------------+---------+------------+------+-----------------+-----------------+---------+-------------------+------+----------+-------+
|  1 | SIMPLE      | student | NULL       | ref  | stu_class_phone | stu_class_phone | 806     | const,const,const |    1 |   100.00 | NULL  |
+----+-------------+---------+------------+------+-----------------+-----------------+---------+-------------------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)
```



- **如果表结构未限制某列为非空，那么MySQL将会使用一个字节来标识该列对应的值是否为NULL；**限定非空，不止not null，还有primary key等隐含非空约束。
- 字符串类型括号内的数字并不是字节数，而是字符长度，一个字符占几个字节与建表选用的字符集有关，如果表使用的是utf8字符集，那么一个字符占3个字节；注意，**对于可变长字符串类（varchar）型的实际占用字节数，除了需要考虑设置了非空与否的那个字节，还要使用2个字节来记录字符串的长度。**定长字符串类型（char）则不用额外字节记录长度
- **整数类型括号内的数字无论是什么，都不影响它实际的字节数，int就是4个字节。**int(xx)，xx只是填充占位符，一般配合zerofill使用，只是一种标识，没有多大用处。



观察三次Explain 的查询结果，留意key_len与where搜索键的微妙关系，**如果type列的值是ref时，ref列的值标识索引参考列的形参。**

首先，我们看到key列为`stu_class_phone` ，说明该查询使用了stu_class_phone索引，这是一个组合索引`（name,c_id,phone）`。看下这三个字段的结构声明与实际字节计算：

- `name varchar(255) not null`，（占767字节）
  1. 255字长（utf8字符集，一个字长3字节 ）255*3=765 √
  2. 是否非空 已限定非空（`not null`） 那就不额外占1字节
  3. 字符串长度 str_len占2字节 √
- `c_id int`，（占5字节）
  1. 是否非空 未限定非空 那将额外占1字节 √
  2. int 占4字节 √
- `phone char(11)`，（占34字节）
  1. 11字长（utf8字符集，一个字长3字节 ）11*3=33 √
  2. 是否非空 未限定非空 那将额外占1字节 √

组合索引满足最左前缀原则就会生效，我们看到三次Explain的查询中 stu_class_phone 索引都生效了，第一次采用 name 构建索引树，第二次采用 name+c_id 构建索引树，第三次采用 name+c_id+phone 构建索引树。第一次：key_len就是 name 的存储字节数，767；第二次：key_len就是 name+c_id 的存储字节数，767+5=772；第三次：key_len就是 name+c_id+phone 的存储字节数，255 * 3 + 2 + 5 + 11 * 3 + 1 = 806



再看一条执行计划：

```bash
mysql> explain select * from student where name='Joe' and phone ='13500000000';
+----+-------------+---------+------------+------+-----------------+-----------------+---------+-------+------+----------+-----------------------+
| id | select_type | table   | partitions | type | possible_keys   | key             | key_len | ref   | rows | filtered | Extra                 |
+----+-------------+---------+------------+------+-----------------+-----------------+---------+-------+------+----------+-----------------------+
|  1 | SIMPLE      | student | NULL       | ref  | stu_class_phone | stu_class_phone | 767     | const |    1 |    50.00 | Using index condition |
+----+-------------+---------+------------+------+-----------------+-----------------+---------+-------+------+----------+-----------------------+
```

为什么 key_len 不是255 * 3 + 11 * 3 + 1 +2=801；却是767？我们看下ref为const，说明只有一个索引键生效，明显就是name，因为不符合最左前缀原则，phone列被忽视了；也可能是mysql做了优化，发现通过name和phone构建的索引树对查询列 （*表示全部列）并没有加快了查询速率，自行优化，减少键长。



拓展：优秀的索引是什么样的？

1. ***键长 短***
2. ***精度 高***

比如，在保证查询精度的情况下，两个索引的key_len分别为10字节和100字节，数据行的量也一样（大数据量效果更佳），100字节索引检索的时间会比10字节的要多；再者，一个磁盘页能存储的10字节的索引记录的量是100字节的10倍。



## 最左前缀原则

在MySQL建立联合索引时会遵守最左前缀匹配原则，即最左优先（查询条件精确匹配索引的左边连续一列或几列，则构建对应列的组合索引树），在检索数据时也从联合索引的最左边开始匹配。

看例子来领会最左前缀原则：

先建表 t，该表没有主键索引，只建立关于a、b、c的联合索引abc

```mysql
mysql> create table t(
    -> a int not null,
    -> b char(10) not null,
    -> c int not null,
    -> d varchar(20) not null,
    -> index abc(a,b,c)    # 联合索引
    -> )engine=innodb charset=utf8;
    
mysql> insert into t values(1,'hello',1,'world');
mysql> insert into t values(2,'hello',2,'mysql');
```

以下均为筛选条件不包含主键索引情况下：（主键索引优先级最高）

1. 只要筛选条件中含有组合索引最左边的列但不含有主键搜索键的时候，至少会构建包含组合索引最左列的索引树。（如：index(a)）

   ```mysql
   mysql> explain select * from t where a=1;
   +----+-------------+-------+------------+------+---------------+------+---------+-------+------+----------+-------+
   | id | select_type | table | partitions | type | possible_keys | key  | key_len | ref   | rows | filtered | Extra |
   +----+-------------+-------+------------+------+---------------+------+---------+-------+------+----------+-------+
   |  1 | SIMPLE      | t     | NULL       | ref  | abc           | abc  | 4       | const |    1 |   100.00 | NULL  |
   +----+-------------+-------+------------+------+---------------+------+---------+-------+------+----------+-------+
   1 row in set, 1 warning (0.00 sec)
   
   mysql> explain select * from t where a=1 and d='world';
   +----+-------------+-------+------------+------+---------------+------+---------+-------+------+----------+-------------+
   | id | select_type | table | partitions | type | possible_keys | key  | key_len | ref   | rows | filtered | Extra       |
   +----+-------------+-------+------------+------+---------------+------+---------+-------+------+----------+-------------+
   |  1 | SIMPLE      | t     | NULL       | ref  | abc           | abc  | 4       | const |    1 |    50.00 | Using where |
   +----+-------------+-------+------------+------+---------------+------+---------+-------+------+----------+-------------+
   1 row in set, 1 warning (0.00 sec)
   ```

2. 查询列都是组合索引列且筛选条件全是组合索引列时，会构建满列组合索引树（index(a,b,c) ）【覆盖索引】

   ```mysql
   mysql> explain select a from t where c=1;
   +----+-------------+-------+------------+-------+---------------+------+---------+------+------+----------+--------------------------+
   | id | select_type | table | partitions | type  | possible_keys | key  | key_len | ref  | rows | filtered | Extra                    |
   +----+-------------+-------+------------+-------+---------------+------+---------+------+------+----------+--------------------------+
   |  1 | SIMPLE      | t     | NULL       | index | abc           | abc  | 38      | NULL |    2 |    50.00 | Using where; Using index |
   +----+-------------+-------+------------+-------+---------------+------+---------+------+------+----------+--------------------------+
   1 row in set, 1 warning (0.00 sec)
   ```

   看 key_len 为38，a和b：4，b：3*10

3. 筛选条件包含普通搜索键但**没包含组合索引列最左键**，不会构建组合索引树

   ```mysql
   mysql> explain select * from t where c=1;
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   | id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   |  1 | SIMPLE      | t     | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    2 |    50.00 | Using where |
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   1 row in set, 1 warning (0.00 sec)
   
   mysql> explain select * from t where c=1 and d='world';
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   | id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   |  1 | SIMPLE      | t     | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    2 |    50.00 | Using where |
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   1 row in set, 1 warning (0.00 sec)
   ```

4. 如果筛选条件全是组合索引最左连续列作为搜索键，将构建连续列组合索引树。***（比如：index(a,b)，但不能index(a,c)）*** 

   ```mysql
   mysql> explain select * from t where a=1 and c=1;
   +----+-------------+-------+------------+------+---------------+------+---------+-------+------+----------+-----------------------+
   | id | select_type | table | partitions | type | possible_keys | key  | key_len | ref   | rows | filtered | Extra                 |
   +----+-------------+-------+------------+------+---------------+------+---------+-------+------+----------+-----------------------+
   |  1 | SIMPLE      | t     | NULL       | ref  | abc           | abc  | 4       | const |    1 |    50.00 | Using index condition |
   +----+-------------+-------+------------+------+---------------+------+---------+-------+------+----------+-----------------------+
   1 row in set, 1 warning (0.00 sec)
   
   mysql> explain select * from t where a=1 and b='hello';
   +----+-------------+-------+------------+------+---------------+------+---------+-------------+------+----------+-------+
   | id | select_type | table | partitions | type | possible_keys | key  | key_len | ref         | rows | filtered | Extra |
   +----+-------------+-------+------------+------+---------------+------+---------+-------------+------+----------+-------+
   |  1 | SIMPLE      | t     | NULL       | ref  | abc           | abc  | 34      | const,const |    1 |   100.00 | NULL  |
   +----+-------------+-------+------------+------+---------------+------+---------+-------------+------+----------+-------+
   1 row in set, 1 warning (0.00 sec)
   ```

5. MySQL查询优化器会优化and连接，将组合索引列规则排号。（比如：b and a 等同于 a and b）

   ```mysql
   mysql> explain select * from t where b='hello' and a=1;
   +----+-------------+-------+------------+------+---------------+------+---------+-------------+------+----------+-------+
   | id | select_type | table | partitions | type | possible_keys | key  | key_len | ref         | rows | filtered | Extra |
   +----+-------------+-------+------------+------+---------------+------+---------+-------------+------+----------+-------+
   |  1 | SIMPLE      | t     | NULL       | ref  | abc           | abc  | 34      | const,const |    1 |   100.00 | NULL  |
   +----+-------------+-------+------------+------+---------------+------+---------+-------------+------+----------+-------+
   1 row in set, 1 warning (0.00 sec)
   ```

   

## 前缀索引

有时候索引需要很长的字符列，这会让索引变得大且慢。通常可以**以某列开始的部分字符作为索引**，这样可以大大节约索引空间，从而提高索引效率。但这样也会降低索引的选择性。索引的选择性是指不重复的索引值和数据表的记录总数的比值，**索引的选择性越高则查询效率越高**。



以下是一个百万级数据表的简化呈现

![img](D:\blog\source\_drafts\mysql索引学习\11.png)

图一 area 字段没有设置为索引，图二 area 字段设置为前4字符作为索引，图三 area 字段设置前5字符作为索引，当数据是百万当量时候，毫无疑问，图三的索引速度将大大优越于前两个图场景。



下面还是直接看例子：

先建表：

```mysql
CREATE TABLE `x_test` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `x_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

插入10万条数据

```mysql
DROP PROCEDURE IF EXISTS proc_initData;
DELIMITER $
CREATE PROCEDURE proc_initData()
BEGIN
    DECLARE i INT DEFAULT 1;
    WHILE i<=100000 DO
        INSERT INTO x_test VALUES(null,RAND()*100000);
        SET i = i+1;
    END WHILE;
END $
CALL proc_initData();
```

不使用索引查询某条记录：

```mysql
mysql> select * from x_test where x_name='8999.29200205886';
+-------+------------------+
| id    | x_name           |
+-------+------------------+
| 91302 | 8999.29200205886 |
+-------+------------------+
1 row in set (0.04 sec)

mysql> explain select * from x_test where x_name='8999.29200205886';
+----+-------------+--------+------------+------+---------------+------+---------+------+--------+----------+-------------+
| id | select_type | table  | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra       |
+----+-------------+--------+------------+------+---------------+------+---------+------+--------+----------+-------------+
|  1 | SIMPLE      | x_test | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 100067 |    10.00 | Using where |
+----+-------------+--------+------------+------+---------------+------+---------+------+--------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

使用索引查询：

```mysql
mysql> alter table x_test add index(x_name(5));
Query OK, 0 rows affected (0.50 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> select * from x_test where x_name='8999.29200205886';
+-------+------------------+
| id    | x_name           |
+-------+------------------+
| 91302 | 8999.29200205886 |
+-------+------------------+
1 row in set (0.00 sec)

mysql> explain select * from x_test where x_name='98652.68794694234';
+----+-------------+--------+------------+------+---------------+--------+---------+-------+------+----------+-------------+
| id | select_type | table  | partitions | type | possible_keys | key    | key_len | ref   | rows | filtered | Extra       |
+----+-------------+--------+------------+------+---------------+--------+---------+-------+------+----------+-------------+
|  1 | SIMPLE      | x_test | NULL       | ref  | x_name        | x_name | 17      | const |    3 |   100.00 | Using where |
+----+-------------+--------+------------+------+---------------+--------+---------+-------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

前缀字符并非越多越好，需要在索引的选择性和索引IO读取量中做出衡量。



## 覆盖索引与回表

### 覆盖索引

上文介绍过索引可以划分为聚簇索引和辅助索引。在InnoDB中的主键索引就是聚簇索引，主键索引的查询效率也是非常高的，除此之外，还有非聚簇索引，其查询效率稍逊。

**覆盖索引其形式就是，查询的字段恰好是索引键中的字段（或是组合索引键中的其它字段）。**

**覆盖索引的查询效率极高，原因在与其不用做回表查询。**



使用之前的student表举例子（组合索引为`stu_class_phone(name,c_id,phone)`）：

```mysql
mysql> desc student;
+----------+--------------+------+-----+---------+----------------+
| Field    | Type         | Null | Key | Default | Extra          |
+----------+--------------+------+-----+---------+----------------+
| id       | int(11)      | NO   | PRI | NULL    | auto_increment |
| name     | varchar(255) | NO   | MUL | NULL    |                |
| c_id     | int(11)      | YES  |     | NULL    |                |
| phone    | char(11)     | YES  |     | NULL    |                |
| guardian | varchar(50)  | NO   |     | NULL    |                |
+----------+--------------+------+-----+---------+----------------+
```

覆盖索引最直观的呈现就是：通过explain执行分析SQL可观测到Extra字段值包含Using index

```mysql
mysql> explain select name from student where name='Joe';
+----+-------------+---------+------------+------+-----------------+-----------------+---------+-------+------+----------+-------------+
| id | select_type | table   | partitions | type | possible_keys   | key             | key_len | ref   | rows | filtered | Extra       |
+----+-------------+---------+------------+------+-----------------+-----------------+---------+-------+------+----------+-------------+
|  1 | SIMPLE      | student | NULL       | ref  | stu_class_phone | stu_class_phone | 767     | const |    1 |   100.00 | Using index |
+----+-------------+---------+------------+------+-----------------+-----------------+---------+-------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

当然对于组合索引你还可以查询组合索引键中的其他字段：

```mysql
mysql> explain select name from student where c_id=1;
+----+-------------+---------+------------+-------+-----------------+-----------------+---------+------+------+----------+--------------------------+
| id | select_type | table   | partitions | type  | possible_keys   | key             | key_len | ref  | rows | filtered | Extra                    |
+----+-------------+---------+------------+-------+-----------------+-----------------+---------+------+------+----------+--------------------------+
|  1 | SIMPLE      | student | NULL       | index | stu_class_phone | stu_class_phone | 806     | NULL |    2 |    50.00 | Using where; Using index |
+----+-------------+---------+------------+-------+-----------------+-----------------+---------+------+------+----------+--------------------------+
1 row in set, 1 warning (0.00 sec)

mysql> explain select c_id from student where phone=119;
+----+-------------+---------+------------+-------+---------------+-----------------+---------+------+------+----------+--------------------------+
| id | select_type | table   | partitions | type  | possible_keys | key             | key_len | ref  | rows | filtered | Extra                    |
+----+-------------+---------+------------+-------+---------------+-----------------+---------+------+------+----------+--------------------------+
|  1 | SIMPLE      | student | NULL       | index | NULL          | stu_class_phone | 806     | NULL |    2 |    50.00 | Using where; Using index |
+----+-------------+---------+------------+-------+---------------+-----------------+---------+------+------+----------+--------------------------+
1 row in set, 2 warnings (0.00 sec)
```

但是不能包含杂质搜索键（不属于所搜索索引中的列）：

```mysql
# 搜索列中，或者条件列中包含了索引以外的列
mysql> explain select c_id from student where phone=119 and guardian='Joe_father';
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table   | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | student | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    2 |    50.00 | Using where |
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

mysql> explain select c_id,guardian from student where phone=119;
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table   | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | student | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    2 |    50.00 | Using where |
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 2 warnings (0.00 sec)
```

此外，注意区别最左前缀原则。当覆盖索引不满足时，就判断是否满足最左前缀原则：

```mysql
mysql> explain select c_id,guardian from student where name='Joe' and phone=119;
+----+-------------+---------+------------+------+-----------------+-----------------+---------+-------+------+----------+-----------------------+
| id | select_type | table   | partitions | type | possible_keys   | key             | key_len | ref   | rows | filtered | Extra                 |
+----+-------------+---------+------------+------+-----------------+-----------------+---------+-------+------+----------+-----------------------+
|  1 | SIMPLE      | student | NULL       | ref  | stu_class_phone | stu_class_phone | 767     | const |    1 |    50.00 | Using index condition |
+----+-------------+---------+------------+------+-----------------+-----------------+---------+-------+------+----------+-----------------------+
1 row in set, 2 warnings (0.00 sec)
```



### 回表

回表就是指：回到主表中查询数据。

比如刚刚的覆盖索引，查询的列数据作为索引树的键值，直接在索引树中得到反馈（存在于索引节点），不用遍历如InnoDB中的叶子节点（存放数据表各行数据）就可得到查询的数据，这就是不用回表。

下面以InnoDB表中的辅助索引作图示说明：

<img src="https://img-blog.csdnimg.cn/20210206194334864.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dhbmdmZWlqaXU=,size_16,color_FFFFFF,t_70" alt="在这里插入图片描述" style="zoom:120%;" />



## 全文索引

通过数值比较、范围过滤等可以完成绝大多数我们需要的查询。但是，如果希望***通过关键字的匹配***来进行查询过滤，那么就需要基于相似度的查询，而不是原来的精确数值比较。

全文索引（fulltext），就是为这种场景设计的，通过建立倒排索引，可以极大的提升检索效率，解决判断字段是否包含的问题。



### FULLTEXT与LIKE

使用`LIKE+%`确实可以实现模糊匹配，适用于文本比较少的时候。对于大量的文本检索，`LIKE+%`与全文索引的检索速度相比就不是一个数量级的。

例如: 有title字段，需要查询所有包含 "政府"的记录.，使用 `like "%政府%"`方式查询，查询速度慢（全表查询）。且当查询包含"政府” OR "中国"的字段时，使用like就难以简单满足，而全文索引就可以实现这个功能。



### FULLTEXT的支持情况

- MySQL 5.6 以前的版本，只有 MyISAM 存储引擎支持全文索引；

- MySQL 5.6 及以后的版本，MyISAM 和 InnoDB 存储引擎均支持全文索引;

- 只有字段的数据类型为 char、varchar、text 及其系列才可以建全文索引

- MySQL 5.7.6 之前，全文索引只支持英文全文索引，不支持中文全文索引，需要利用分词器把中文段落预处理拆分成单词，然后存入数据库。

- 从 MySQL 5.7.6 开始，MySQL内置了ngram全文解析器，用来支持中文、日文、韩文分词。

  ```mysql
  ## 建表的时候 创建联合全文索引列,并声明使用ngram解析器
  FULLTEXT (title, body) WITH PARSER ngram
  
  ## 在已存在的表上创建，并声明使用ngram解析器
  ALTER TABLE articles ADD FULLTEXT INDEX ft_index (title,body) WITH PARSER ngram;
  
  CREATE FULLTEXT INDEX ft_index ON articles (title,body) WITH PARSER ngram;
  ```



### 创建全文索引

```mysql
## 建表的时候 创建联合全文索引列
FULLTEXT INDEX keyname(colume1,colume2)  

## 在已存在的表上创建
create fulltext index keyname on xxtable(colume1,colume2);

alter table xxtable add fulltext index keyname (colume1,colume2);
```



### 使用全文索引

全文索引有独特的语法格式，需要配合 `match` 和 `against` 关键字使用

- `match()` 函数中指定的列必须是设置为全文索引的列，否则就会报错，这是因为全文索引不会记录关键字来自哪一列。如果想要对某一列使用全文索引，请单独为该列创建全文索引。
- `against()` 函数标识需要模糊查找的关键字



看例子：

先建表，插入数据

```mysql
create table fulltext_test(
     id int auto_increment primary key,
     words varchar(2000) not null,
     artical text not null,
     fulltext index words_artical(words,artical)
)engine=innodb default charset=utf8;

insert into fulltext_test values(null,'a','a');
insert into fulltext_test values(null,'aa','aa');
insert into fulltext_test values(null,'aaa','aaa');
insert into fulltext_test values(null,'aaaa','aaaa');
```

接下来用全文索引搜索查看一下：

```mysql
mysql> select * from fulltext_test where match(words,artical) against('a');
Empty set (0.00 sec)

mysql> select * from fulltext_test where match(words,artical) against('aa');
Empty set (0.00 sec)

mysql> select * from fulltext_test where match(words,artical) against('aaa');
+----+-------+---------+
| id | words | artical |
+----+-------+---------+
|  3 | aaa   | aaa     |
+----+-------+---------+
1 row in set (0.00 sec)

mysql> select * from fulltext_test where match(words,artical) against('aaaa');
+----+-------+---------+
| id | words | artical |
+----+-------+---------+
|  4 | aaaa  | aaaa    |
+----+-------+---------+
1 row in set (0.00 sec)

## match() 函数中指定的列必须和全文索引中指定的列完全相同，否则就会报错
mysql> select * from fulltext_test where match(words) against('aaaa');
ERROR 1191 (HY000): Can't find FULLTEXT index matching the column list
```

可见，只有aaa和aaaa才能查到记录，为什么会这样呢？



### 全文索引关键词长度阈值

这其实跟***全文索引关键词长度阈值***有关，可以通过 `show variables like '%ft%';` 查看。

```mysql
mysql> show variables like '%ft%';
+---------------------------------+----------------+
| Variable_name                   | Value          |
+---------------------------------+----------------+
| ft_boolean_syntax               | + -><()~*:""&| |
| ft_max_word_len                 | 84             | ## MyISAM全文索引关键词最大长度
| ft_min_word_len                 | 4              | ## MyISAM全文索引关键词最小长度
| ft_query_expansion_limit        | 20             |
| ft_stopword_file                | (built-in)     |
| innodb_ft_aux_table             |                |
| innodb_ft_cache_size            | 8000000        |
| innodb_ft_enable_diag_print     | OFF            |
| innodb_ft_enable_stopword       | ON             |
| innodb_ft_max_token_size        | 84             | ## Innodb全文索引关键词最大长度   
| innodb_ft_min_token_size        | 3              | ## Innodb全文索引关键词最小长度 
| innodb_ft_num_word_optimize     | 2000           |
| innodb_ft_result_cache_limit    | 2000000000     |
| innodb_ft_server_stopword_table |                |
| innodb_ft_sort_pll_degree       | 2              |
| innodb_ft_total_cache_size      | 640000000      |
| innodb_ft_user_stopword_table   |                |
+---------------------------------+----------------+
17 rows in set, 1 warning (0.01 sec)
```

可见InnoDB的全文索引的关键词 最小索引长度 为3。上文使用的是InnoDB引擎建表，同时也解释为什么只有3a以上才有搜索结果。



设置关键词长度阈值，可以有效的避免过短的关键词，得到的结果过多也没有意义。

也可以手动配置关键词长度阈值，修改MySQL配置文件，在[mysqld]的下面追加以下内容，设置关键词最小长度为5。

```xml
[mysqld]
innodb_ft_min_token_size = 5
ft_min_word_len = 5
```

然后重启MySQL服务器，还要修复索引，不然参数不会生效

```mysql
repair table 表名 quick;
```



为什么上文搜索关键字为aaa的时候，有且仅有一条aaa的记录，为什么没有aaaa的记录呢？



### 全文索引模式

#### 自然语言的全文索引 IN NATURAL LANGUAGE MODE

默认情况下，或者使用 `IN NATURAL LANGUAGE MODE` 修饰符时，`match()` 函数对文本集合执行自然语言搜索，上面的例子都是自然语言的全文索引。

**自然语言搜索引擎将计算每一个文档对象和查询的相关度。这里，相关度是基于匹配的关键词的个数，以及关键词在文档中出现的次数。在整个索引中出现次数越少的词语，匹配时的相关度就越高。**

MySQL在全文查询中会对每个合适的词都会先计算它们的权重，如果一个词出现在多个记录中，那它只有较低的权重；相反，如果词是较少出现在这个集的文档中，它将得到一个较高的权重。

**MySQL默认的阀值是50%。如果一个词语的在超过 50% 的记录中都出现了，那么自然语言的搜索将不会搜索这类词语。**

这个机制也比较好理解，比如一个数据表存储的是一篇篇的文章，文章中的常见词、语气词等等，出现的肯定比较多，搜索这些词语就没什么意义了，需要搜索的是那些文章中有特殊意义的词，这样才能把文章区分开。

此外，

```mysql
select * from fulltext_test where match(words,artical) against('aaa');
等价
select * from fulltext_test where match(words,artical) against('aaa'  IN NATURAL LANGUAGE MODE);
```



#### 布尔全文索引 IN BOOLEAN MODE

在布尔搜索中，我们可以在查询中**自定义某个被搜索的词语的相关性**，这个模式和lucene中的BooleanQuery很像，可以**通过一些操作符，来指定搜索词在结果中的包含情况**。



建表举个例子：

```mysql
CREATE TABLE articles (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR(200),
    body TEXT,
    FULLTEXT (title,body)
) ENGINE=InnoDB
```



下面列举几个常用的修饰符：

1. `+` （AND）全文索引列必须包含该词且全文索引列（之一）有且仅有该词

2. `-` （NOT）全文索引列必须不包含该词

   ```mysql
   ## 查找title,body列中有且仅有apple（是apple不是applexx 也不是 xxapple）但是不含有banana的记录
   SELECT * FROM articles WHERE MATCH (title,body) AGAINST ('+apple -banana' IN BOOLEAN MODE);
   ```

3. `>` 提高该词的相关性，查询的结果靠前

4. `<` 降低该词的相关性，查询的结果靠后

5. 空格，表示OR

   ```mysql
   ## 返回同时包含apple（是apple不是applexx 也不是 xxapple）和banana的记录，与同时包含apple和orange的记录。
   ## 但是同时包含apple和banana的记录的权重高于同时包含apple和orange的记录。
   SELECT * FROM articles WHERE MATCH (title,body) AGAINST ('+apple +(>banana <orange)' IN BOOLEAN MODE);   
   ```

6. `*` 通配符，表示关键词后面可以跟任意字符

   ```mysql
   ## 返回的记录可以为applexx 
   SELECT * FROM articles WHERE MATCH (title,body) AGAINST ('apple*' IN BOOLEAN MODE);
   ```

7. `~` 异或，如果包含则降低关键词整体的相关性

   ```mysql
   ## 返回的记录必须包含apple（且不能是applexx 或 xxapple），
   ## 但是如果同时也包含banana会降低权重（只出现apple的记录会出现在结果集前面）。
   ## 但是它没有 +apple -banana 严格，因为后者如果包含banana压根就不返回。
   SELECT * FROM articles WHERE MATCH (title,body) AGAINST ('+apple ~banana' IN BOOLEAN MODE);
   ```

8. `""` 双引号，效果类似`like '%some words%'`

   ```mysql
   ## 模糊匹配 “apple banana goog”会被匹配到，而“apple good banana”就不会被匹配
   SELECT * FROM articles WHERE MATCH (title,body) AGAINST ('"apple banana"' IN BOOLEAN MODE);  
   ```



## 索引失效

数据库表中添加索引后确实会让查询速度起飞，但前提必须是正确的使用索引来查询，如果以错误的方式使用，则即使建立索引也会不奏效。即使建立索引，索引也不会生效。

先建表，插入数据：

```mysql
CREATE TABLE `user` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `age` int(10) DEFAULT '0',
  `pos` varchar(30) DEFAULT NULL,
  `phone` varchar(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_name_age_pos_phone` (`name`,`age`,`pos`,`phone`),
  KEY `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT charset=utf8;


insert into user(name,age,pos,phone,created_time) values
('Joe',14,'Guangzhou','119','2022-1-31'),
('Tony',14,'Hangzhou','110','2022-2-21'),
('Kobe',24,'Los Angle','120','2011-12-31'),
('Wade',34,'Shenzhen','12316','2000-12-11');
```

下面说明几种索引失效的例子：

1. **字符串不加单引号**

   ```mysql
   mysql> explain select * from user where phone='119';
   +----+-------------+-------+------------+------+---------------+-----------+---------+-------+------+----------+-------+
   | id | select_type | table | partitions | type | possible_keys | key       | key_len | ref   | rows | filtered | Extra |
   +----+-------------+-------+------------+------+---------------+-----------+---------+-------+------+----------+-------+
   |  1 | SIMPLE      | user  | NULL       | ref  | idx_phone     | idx_phone | 36      | const |    1 |   100.00 | NULL  |
   +----+-------------+-------+------------+------+---------------+-----------+---------+-------+------+----------+-------+
   1 row in set, 1 warning (0.00 sec)
   
   mysql> explain select * from user where phone=119;
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   | id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   |  1 | SIMPLE      | user  | NULL       | ALL  | idx_phone     | NULL | NULL    | NULL |    4 |    25.00 | Using where |
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   1 row in set, 4 warnings (0.00 sec)
   ```

2. **违反最左前缀法则（且不满足覆盖索引）**

   如果索引有多列，要遵守最左前缀法则，即查询从索引的最左前列开始并且不跳过索引中的列。

   ```mysql
   ## 违反最左前缀法则（且不满足覆盖索引） 
   mysql> explain select * from user where age=14;
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   | id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   |  1 | SIMPLE      | user  | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    4 |    25.00 | Using where |
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   1 row in set, 1 warning (0.00 sec)
   
   ## 违反最左前缀法则，但满足覆盖索引 
   mysql> explain select name from user where age=14;
   +----+-------------+-------+------------+-------+------------------------+------------------------+---------+------+------+----------+--------------------------+
   | id | select_type | table | partitions | type  | possible_keys          | key                    | key_len | ref  | rows | filtered | Extra                    |
   +----+-------------+-------+------------+-------+------------------------+------------------------+---------+------+------+----------+--------------------------+
   |  1 | SIMPLE      | user  | NULL       | index | idx_name_age_pos_phone | idx_name_age_pos_phone | 197     | NULL |    4 |    25.00 | Using where; Using index |
   +----+-------------+-------+------------+-------+------------------------+------------------------+---------+------+------+----------+--------------------------+
   1 row in set, 1 warning (0.00 sec)
   
   ## 遵守最左前缀法则
   mysql> explain select name from user where name='Joe' and age=14;
   +----+-------------+-------+------------+------+------------------------+------------------------+---------+-------------+------+----------+-------------+
   | id | select_type | table | partitions | type | possible_keys          | key                    | key_len | ref         | rows | filtered | Extra       |
   +----+-------------+-------+------------+------+------------------------+------------------------+---------+-------------+------+----------+-------------+
   |  1 | SIMPLE      | user  | NULL       | ref  | idx_name_age_pos_phone | idx_name_age_pos_phone | 68      | const,const |    1 |   100.00 | Using index |
   +----+-------------+-------+------------+------+------------------------+------------------------+---------+-------------+------+----------+-------------+
   1 row in set, 1 warning (0.00 sec)
   
   ## 遵守最左前缀法则
   mysql> explain select * from user where name='Joe' and age=14 and pos='Guangzhou' and phone='119';
   +----+-------------+-------+------------+------+----------------------------------+------------------------+---------+-------------------------+------+----------+-------+
   | id | select_type | table | partitions | type | possible_keys                    | key                    | key_len | ref                     | rows | filtered | Extra |
   +----+-------------+-------+------------+------+----------------------------------+------------------------+---------+-------------------------+------+----------+-------+
   |  1 | SIMPLE      | user  | NULL       | ref  | idx_name_age_pos_phone,idx_phone | idx_name_age_pos_phone | 197     | const,const,const,const |    1 |   100.00 | NULL  |
   +----+-------------+-------+------------+------+----------------------------------+------------------------+---------+-------------------------+------+----------+-------+
   1 row in set, 1 warning (0.00 sec)
   ```

3. **like以通配符开头（'%abc'）**

   如搜索键值以通配符`%开头`（如：`like '%abc'`），则索引失效，直接全表扫描；若只是以%结尾，则不影响索引构建。

   ```mysql
   # 遵守最左前缀法则,但like以通配符开头
   mysql> explain select * from user where name like '%Joe';
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   | id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   |  1 | SIMPLE      | user  | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    4 |    25.00 | Using where |
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   1 row in set, 1 warning (0.00 sec)
   
   # 遵守最左前缀法则,但like不以通配符开头
   mysql> explain select * from user where name like 'Joe%';
   +----+-------------+-------+------------+-------+------------------------+------------------------+---------+------+------+----------+-----------------------+
   | id | select_type | table | partitions | type  | possible_keys          | key                    | key_len | ref  | rows | filtered | Extra                 |
   +----+-------------+-------+------------+-------+------------------------+------------------------+---------+------+------+----------+-----------------------+
   |  1 | SIMPLE      | user  | NULL       | range | idx_name_age_pos_phone | idx_name_age_pos_phone | 63      | NULL |    1 |   100.00 | Using index condition |
   +----+-------------+-------+------------+-------+------------------------+------------------------+---------+------+------+----------+-----------------------+
   1 row in set, 1 warning (0.00 sec)
   
   # 这样索引又不会失效
   mysql> explain select * from user where name='Joe' and pos like '%zhou';
   +----+-------------+-------+------------+------+------------------------+------------------------+---------+-------+------+----------+-----------------------+
   | id | select_type | table | partitions | type | possible_keys          | key                    | key_len | ref   | rows | filtered | Extra                 |
   +----+-------------+-------+------------+------+------------------------+------------------------+---------+-------+------+----------+-----------------------+
   |  1 | SIMPLE      | user  | NULL       | ref  | idx_name_age_pos_phone | idx_name_age_pos_phone | 63      | const |    1 |    25.00 | Using index condition |
   +----+-------------+-------+------------+------+------------------------+------------------------+---------+-------+------+----------+-----------------------+
   1 row in set, 1 warning (0.00 sec)
   ```

4. **使用不等于（!=、<>）（覆盖索引除外）**

   普通索引使用 `!=`索引失效，主键索引没影响。

   ```mysql
   mysql> explain select * from user where phone<>'Joe';
   +----+-------------+-------+------------+-------+---------------+-----------+---------+------+------+----------+-----------------------+
   | id | select_type | table | partitions | type  | possible_keys | key       | key_len | ref  | rows | filtered | Extra                 |
   +----+-------------+-------+------------+-------+---------------+-----------+---------+------+------+----------+-----------------------+
   |  1 | SIMPLE      | user  | NULL       | range | idx_phone     | idx_phone | 36      | NULL |    5 |   100.00 | Using index condition |
   +----+-------------+-------+------------+-------+---------------+-----------+---------+------+------+----------+-----------------------+
   1 row in set, 1 warning (0.00 sec)
   
   mysql> explain select * from user where name!='Joe';
   +----+-------------+-------+------------+-------+------------------------+------------------------+---------+------+------+----------+-----------------------+
   | id | select_type | table | partitions | type  | possible_keys          | key                    | key_len | ref  | rows | filtered | Extra                 |
   +----+-------------+-------+------------+-------+------------------------+------------------------+---------+------+------+----------+-----------------------+
   |  1 | SIMPLE      | user  | NULL       | range | idx_name_age_pos_phone | idx_name_age_pos_phone | 63      | NULL |    4 |   100.00 | Using index condition |
   +----+-------------+-------+------------+-------+------------------------+------------------------+---------+------+------+----------+-----------------------+
   1 row in set, 1 warning (0.00 sec)
   
   # 主键索引
   mysql> explain select * from user where id!=1;
   +----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
   | id | select_type | table | partitions | type  | possible_keys | key     | key_len | ref  | rows | filtered | Extra       |
   +----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
   |  1 | SIMPLE      | user  | NULL       | range | PRIMARY       | PRIMARY | 4       | NULL |    4 |   100.00 | Using where |
   +----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
   1 row in set, 1 warning (0.00 sec)
   ```

   虽说是会索引失效，但可能是因为我这是mysql 8.0.13的原因，现在或许已经支持索引了。

5. **在索引列上做任何操作**

   如果查询条件中含有函数或表达式，将导致索引失效而进行全表扫描。

   ```mysql
   mysql> explain select * from user where length(name)>2;
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   | id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   |  1 | SIMPLE      | user  | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    4 |   100.00 | Using where |
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   1 row in set, 1 warning (0.00 sec)
   ```

6. **索引范围条件右边的列** 

   mysql 会一直向右匹配直到遇到索引搜索键使用 `>` 、 `<` 就停止匹配。

   ```mysql
   # 明显只用了name和age索引键，后面pos就没用
   mysql> explain select * from user where name='Joe' and age>20 and pos='Guangzhou';
   +----+-------------+-------+------------+-------+------------------------+------------------------+---------+------+------+----------+-----------------------+
   | id | select_type | table | partitions | type  | possible_keys          | key                    | key_len | ref  | rows | filtered | Extra
     |
   +----+-------------+-------+------------+-------+------------------------+------------------------+---------+------+------+----------+-----------------------+
   |  1 | SIMPLE      | user  | NULL       | range | idx_name_age_pos_phone | idx_name_age_pos_phone | 68      | NULL |    1 |    25.00 | Using index condition |
   +----+-------------+-------+------------+-------+------------------------+------------------------+---------+------+------+----------+-----------------------+
   1 row in set, 1 warning (0.00 sec)
   
   mysql> explain select * from user where name='Joe' and age=20 and pos='Guangzhou';
   +----+-------------+-------+------------+------+------------------------+------------------------+---------+-------------------+------+----------+-------+
   | id | select_type | table | partitions | type | possible_keys          | key                    | key_len | ref               | rows | filtered | Extra |
   +----+-------------+-------+------------+------+------------------------+------------------------+---------+-------------------+------+----------+-------+
   |  1 | SIMPLE      | user  | NULL       | ref  | idx_name_age_pos_phone | idx_name_age_pos_phone | 161     | const,const,const |    1 |   100.00 | NULL  |
   +----+-------------+-------+------------+------+------------------------+------------------------+---------+-------------------+------+----------+-------+
   1 row in set, 1 warning (0.00 sec)
   
   # 还是会使用phone这个索引键的，但phone之后就不用了
   mysql> explain select * from user where phone<'110';
   +----+-------------+-------+------------+-------+---------------+-----------+---------+------+------+----------+-----------------------+
   | id | select_type | table | partitions | type  | possible_keys | key       | key_len | ref  | rows | filtered | Extra                 |
   +----+-------------+-------+------------+-------+---------------+-----------+---------+------+------+----------+-----------------------+
   |  1 | SIMPLE      | user  | NULL       | range | idx_phone     | idx_phone | 36      | NULL |    1 |   100.00 | Using index condition |
   +----+-------------+-------+------------+-------+---------------+-----------+---------+------+------+----------+-----------------------+
   1 row in set, 1 warning (0.00 sec)
   
   # 只用了name索引键
   mysql> explain select * from user where name>'Joe' and age>20 and pos<'Guangzhou';
   +----+-------------+-------+------------+-------+------------------------+------------------------+---------+------+------+----------+-----------------------+
   | id | select_type | table | partitions | type  | possible_keys          | key                    | key_len | ref  | rows | filtered | Extra                 |
   +----+-------------+-------+------------+-------+------------------------+------------------------+---------+------+------+----------+-----------------------+
   |  1 | SIMPLE      | user  | NULL       | range | idx_name_age_pos_phone | idx_name_age_pos_phone | 63      | NULL |    3 |    25.00 | Using index condition |
   +----+-------------+-------+------------+-------+------------------------+------------------------+---------+------+------+----------+-----------------------+
   1 row in set, 1 warning (0.00 sec)
   ```

7. **or连接** 

   当用 `or` 连接不同的列时，索引会失效

   ```mysql
   # or连接同一个索引列，有效
   mysql> explain select * from user where id=1 or id=9;
   +----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
   | id | select_type | table | partitions | type  | possible_keys | key     | key_len | ref  | rows | filtered | Extra       |
   +----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
   |  1 | SIMPLE      | user  | NULL       | range | PRIMARY       | PRIMARY | 4       | NULL |    2 |   100.00 | Using where |
   +----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
   1 row in set, 1 warning (0.00 sec)
   
   mysql> explain select * from user where name='Joe' or name='Tom';
   +----+-------------+-------+------------+-------+------------------------+------------------------+---------+------+------+----------+-----------------------+
   | id | select_type | table | partitions | type  | possible_keys          | key                    | key_len | ref  | rows | filtered | Extra                 |
   +----+-------------+-------+------------+-------+------------------------+------------------------+---------+------+------+----------+-----------------------+
   |  1 | SIMPLE      | user  | NULL       | range | idx_name_age_pos_phone | idx_name_age_pos_phone | 63      | NULL |    2 |   100.00 | Using index condition |
   +----+-------------+-------+------------+-------+------------------------+------------------------+---------+------+------+----------+-----------------------+
   1 row in set, 1 warning (0.00 sec)
   
   # or连接不同的索引列，无效
   mysql> explain select * from user where name='Joe' or age=14;
   +----+-------------+-------+------------+------+------------------------+------+---------+------+------+----------+-------------+
   | id | select_type | table | partitions | type | possible_keys          | key  | key_len | ref  | rows | filtered | Extra       |
   +----+-------------+-------+------------+------+------------------------+------+---------+------+------+----------+-------------+
   |  1 | SIMPLE      | user  | NULL       | ALL  | idx_name_age_pos_phone | NULL | NULL    | NULL |    4 |    43.75 | Using where |
   +----+-------------+-------+------------+------+------------------------+------+---------+------+------+----------+-------------+
   1 row in set, 1 warning (0.00 sec)
   
   mysql> explain select * from user where id=9 or age=14;
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   | id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   |  1 | SIMPLE      | user  | NULL       | ALL  | PRIMARY       | NULL | NULL    | NULL |    4 |    43.75 | Using where |
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
   1 row in set, 1 warning (0.00 sec)
   
   # 这个又有效，优化器的作用
   mysql> explain select * from user where id=9 or name='Joe';
   +----+-------------+-------+------------+-------------+--------------------------------+--------------------------------+---------+------+------+----------+---------------------------------------------------------------+
   | id | select_type | table | partitions | type        | possible_keys                  | key                            | key_len | ref  | rows | filtered | Extra
             |
   +----+-------------+-------+------------+-------------+--------------------------------+--------------------------------+---------+------+------+----------+---------------------------------------------------------------+
   |  1 | SIMPLE      | user  | NULL       | index_merge | PRIMARY,idx_name_age_pos_phone | idx_name_age_pos_phone,PRIMARY | 63,4    | NULL |    2 |   100.00 | Using sort_union(idx_name_age_pos_phone,PRIMARY); Using where |
   +----+-------------+-------+------------+-------------+--------------------------------+--------------------------------+---------+------+------+----------+---------------------------------------------------------------+
   1 row in set, 1 warning (0.00 sec)
   
   mysql> explain select * from user where name='Joe' or phone='110';
   +----+-------------+-------+------------+-------------+----------------------------------+----------------------------------+---------+------+------+----------+-----------------------------------------------------------------+
   | id | select_type | table | partitions | type        | possible_keys                    | key                              | key_len | ref  | rows | filtered | Extra
                                                     |
   +----+-------------+-------+------------+-------------+----------------------------------+----------------------------------+---------+------+------+----------+-----------------------------------------------------------------+
   |  1 | SIMPLE      | user  | NULL       | index_merge | idx_name_age_pos_phone,idx_phone | idx_name_age_pos_phone,idx_phone | 63,36   | NULL |    2 |   100.00 | Using sort_union(idx_name_age_pos_phone,idx_phone); Using where |
   +----+-------------+-------+------------+-------------+----------------------------------+----------------------------------+---------+------+------+----------+-----------------------------------------------------------------+
   1 row in set, 1 warning (0.00 sec)
   ```

8. **order by** 

   order by 对主键索引排序会用到索引，其他的索引失效

   ```mysql
   # order by 其他索引键，失效
   mysql> explain select * from user order by name;
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+
   | id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra          |
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+
   |  1 | SIMPLE      | user  | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    4 |   100.00 | Using filesort |
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+
   1 row in set, 1 warning (0.00 sec)
   
   mysql> explain select * from user order by phone;
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+
   | id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra          |
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+
   |  1 | SIMPLE      | user  | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    4 |   100.00 | Using filesort |
   +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+
   1 row in set, 1 warning (0.00 sec)
   
   # order by 主键，有效
   mysql> explain select * from user order by id desc;
   +----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+---------------------+
   | id | select_type | table | partitions | type  | possible_keys | key     | key_len | ref  | rows | filtered | Extra               |
   +----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+---------------------+
   |  1 | SIMPLE      | user  | NULL       | index | NULL          | PRIMARY | 4       | NULL |    4 |   100.00 | Backward index scan |
   +----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+---------------------+
   1 row in set, 1 warning (0.00 sec)
   ```

   

<img src="D:\blog\source\_drafts\mysql索引学习\15.png" alt="img" style="zoom: 50%;" />







# 参考

1. [一文搞懂MySQL索引（清晰明了）](https://blog.csdn.net/wangfeijiu/article/details/113409719)
2. [mysql索引之哈希索引](https://www.cnblogs.com/igoodful/p/9361500.html)
2. [mysql中文全文检索](https://www.cnblogs.com/lianyiu/p/14325045.html)
2. [MySQL 之全文索引](https://blog.csdn.net/mrzhouxiaofei/article/details/79940958)
2. [一张图搞懂MySQL的索引失效](https://segmentfault.com/a/1190000021464570)
