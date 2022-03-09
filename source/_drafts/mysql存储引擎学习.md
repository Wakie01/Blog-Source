---
title: mysql存储引擎学习
comment: true
date: 2022-02-09 15:55:17
tags: mysql
categories:
addrlink:
---

# 存储引擎是？

MySQL中的数据用各种不同的技术存储在文件（或者内存）中。

每一种技术都使用不同的==存储机制==、==索引技巧==、==锁定水平==并且最终提供广泛的不同的功能和能力。通过选择不同的技术，能够获得额外的速度或者功能，从而改善应用的整体功能。 这些不同的技术以及配套的相关功能在MySQL中被称作***存储引擎***（也称作表类型）。

**MySQL区别于其他数据库的最重要的一个特点就是插件式的表存储引擎，也就是说存储引擎是基于表的。**

存储引擎的概念是MySQL里面才有的，不是所有的关系型数据库都有存储引擎这个概念 。其它数据库系统 (包括大多数商业选择)仅支持一种类型的数据存储， 也就是说采用“ 一个尺码满足一切需求 ”的存储方式，也意味着“功能强大，性能平庸”。而MySQL默认配置了许多不同的存储引擎，你可以根据业务需求选取一种最适配最高效的存储引擎。这也是为什么MySQL为何如此受欢迎的主要原因之一。



# 存储引擎分类

查看当前安装的MySQL版本支持的存储引擎：

```mysql
# 查看MySQL版本
mysql> select version();
+-----------+
| version() |
+-----------+
| 8.0.13    |
+-----------+
1 row in set (0.00 sec)

# 查看当前版本Mysql支持的存储引擎
# 默认InnoDB引擎
mysql> show engines;
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
| Engine             | Support | Comment                                                        | Transactions | XA   | Savepoints |
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
| MEMORY             | YES     | Hash based, stored in memory, useful for temporary tables      | NO           | NO   | NO         |
| MRG_MYISAM         | YES     | Collection of identical MyISAM tables                          | NO           | NO   | NO         |
| CSV                | YES     | CSV storage engine                                             | NO           | NO   | NO         |
| FEDERATED          | NO      | Federated MySQL storage engine                                 | NULL         | NULL | NULL       |
| PERFORMANCE_SCHEMA | YES     | Performance Schema                                             | NO           | NO   | NO         |
| MyISAM             | YES     | MyISAM storage engine                                          | NO           | NO   | NO         |
| InnoDB             | DEFAULT | Supports transactions, row-level locking, and foreign keys     | YES          | YES  | YES        |
| BLACKHOLE          | YES     | /dev/null storage engine (anything you write to it disappears) | NO           | NO   | NO         |
| ARCHIVE            | YES     | Archive storage engine                                         | NO           | NO   | NO         |
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
9 rows in set (0.00 sec)
```

简单说明一下 `show engines;` 命令的每一列：

1. Engine：引擎名字
2. Support：支持与否
3. Comment：简要说明特性
4. Transactions：是否支持事务
5. XA：是否支持XA规范
6. Savepoints：是否支持保存点



简单介绍一下上面列出来的几种存储引擎：

1. ***MEMORY：*** 所有数据置于内存的存储引擎，拥有极高的插入，更新和查询效率。但是会占用和数据量成正比的内存空间。并且其内容会在Mysql重新启动时丢失
2. MRG_MYISAM：将一定数量的MyISAM表联合而成一个整体，在超大规模数据存储时很有用
3. CSV：逻辑上由逗号分割数据的存储引擎。它会在数据库子目录里为每个数据表创建一个`.csv`文件。这是一种普通文本文件，每个数据行占用一个文本行。不支持索引。
4. FEDERATED：将不同的Mysql服务器联合起来，逻辑上组成一个完整的数据库。==非常适合分布式应用==
5. ***MyISAM：*** 拥有较高的插入，查询速度，但不支持事务
6. ***InnoDB：*** 5.5.8版本后Mysql的默认数据库引擎，支持ACID事务，支持行级锁定，对比MyISAM，写的处理效率会差一些，并且会占用更多的磁盘空间以保留数据和索引。
7. BLACKHOLE：黑洞引擎，写入的任何数据都会消失，一般用于记录binlog做复制的中继
8. ARCHIVE：非常适合存储大量的独立的，作为==历史记录==的数据。因为它们不经常被读取。Archive拥有高效的插入速度，但其对查询的支持相对较差



# 存储引擎特性

对于一个存储引擎，常有如下要求：

1. 并发性：某些应用程序比其他应用程序具有更高的颗粒级锁定要求（如行级锁定）。
2. 事务支持：并非所有的应用程序都需要事务，但对的确需要事务的应用程序来说，有着定义良好的需求，如ACID兼容等。
3. 引用完整性：通过DDL定义的外键，服务器需要强制保持关联数据库的引用完整性。
4. 物理存储：它包括各种各样的事项，从表和索引的总的页大小，到存储数据所需的格式，到物理磁盘。
5. 索引支持：不同的应用程序倾向于采用不同的索引策略，每种存储引擎通常有自己的编制索引方法，但某些索引方法（如B-tree索引）对几乎所有的存储引擎来说是共同的。
6. 内存高速缓冲：与其他应用程序相比，不同的应用程序对某些内存高速缓冲策略的响应更好，因此，尽管某些内存高速缓冲对所有存储引擎来说是共同的（如用于用户连接的高速缓冲，MySQL的高速查询高速缓冲等），其他高速缓冲策略仅当使用特殊的存储引擎时才唯一定义。
7. 性能帮助：包括针对并行操作的多I/O线程，线程并发性，数据库检查点，成批插入处理等。 
8. 其他目标特性：可能包括对地理空间操作的支持，对特定数据处理操作的安全限制等。



以上特性很多是互斥的，一个存储引擎只能具备其中某些要求。

具体可参考官网：[Chapter 16 Alternative Storage Engines](https://dev.mysql.com/doc/refman/8.0/en/storage-engines.html)

| Feature                                | MyISAM       | Memory           | InnoDB       | Archive      | NDB          |
| -------------------------------------- | :----------- | :--------------- | :----------- | :----------- | :----------- |
| B-tree indexes                         | Yes          | Yes              | Yes          | No           | No           |
| Backup/point-in-time recovery (note 1) | Yes          | Yes              | Yes          | Yes          | Yes          |
| Cluster database support               | No           | No               | No           | No           | Yes          |
| Clustered indexes                      | No           | No               | Yes          | No           | No           |
| Compressed data                        | Yes (note 2) | No               | Yes          | Yes          | No           |
| Data caches                            | No           | N/A              | Yes          | No           | Yes          |
| Encrypted data                         | Yes (note 3) | Yes (note 3)     | Yes (note 4) | Yes (note 3) | Yes (note 3) |
| Foreign key support                    | No           | No               | Yes          | No           | Yes (note 5) |
| Full-text search indexes               | Yes          | No               | Yes (note 6) | No           | No           |
| Geospatial data type support           | Yes          | No               | Yes          | Yes          | Yes          |
| Geospatial indexing support            | Yes          | No               | Yes (note 7) | No           | No           |
| Hash indexes                           | No           | Yes              | No (note 8)  | No           | Yes          |
| Index caches                           | Yes          | N/A              | Yes          | No           | Yes          |
| Locking granularity                    | Table        | Table            | Row          | Row          | Row          |
| MVCC                                   | No           | No               | Yes          | No           | No           |
| Replication support (note 1)           | Yes          | Limited (note 9) | Yes          | Yes          | Yes          |
| Storage limits                         | 256TB        | RAM              | 64TB         | None         | 384EB        |
| T-tree indexes                         | No           | No               | No           | No           | Yes          |
| Transactions                           | No           | No               | Yes          | No           | Yes          |
| Update statistics for data dictionary  | Yes          | Yes              | Yes          | Yes          | Yes          |



接下来主要介绍InnoDB MyISAM Memory三种存储引擎。

| 功能         | MyISAM | Memory | InnoDB           |
| ------------ | ------ | ------ | ---------------- |
| 存储限制     | 256TB  | RAM    | 64TB             |
| 支持事务     | No     | No     | Yes              |
| 支持全文索引 | Yes    | No     | Mysql 5.6之后Yes |
| 支持B数索引  | Yes    | Yes    | Yes              |
| 支持哈希索引 | No     | Yes    | No               |
| 支持聚集索引 | No     | No     | Yes              |
| 支持数据压缩 | Yes    | No     | No               |
| 空间使用率   | 低     | N/A    | 高               |
| 支持外键     | No     | No     | Yes              |



## InnoDB引擎

InnoDB 是一个事务安全的存储引擎，它具备提交、回滚以及崩溃恢复的功能以保护用户数据。InnoDB 的行级别锁定保证数据一致性提升了它的多用户并发数以及性能。InnoDB 将用户数据存储在聚集索引中以减少基于主键的普通查询所带来的 I/O 开销。为了保证数据的完整性，InnoDB 还支持外键约束。默认使用B+TREE数据结构存储索引。



总的来说，它有如下特点：

1. 支持事务，支持4个事务隔离（ACID）级别
2. 行级锁定（更新时锁定当前行）
3. 读写阻塞与事务隔离级别相关
4. 在InnoDB中存在着缓冲管理，既能缓存索引又能缓存数据，加快查询的速度；
5. 支持外键
6. InnoDB更消耗资源，读取速度没有MyISAM快
7. 对于InnoDB类型的表，其数据的物理组织形式是聚簇表。所有的数据按照主键来组织。数据和索引放在一块，都位于B+数的叶子节点上；



然后它适用于如下业务场景：

1. 需要支持事务的场景（银行转账之类）
2. 适合高并发，行级锁定对高并发有很好的适应能力，但需要确保查询是通过索引完成的
3. 数据修改较频繁的业务



InnoDB引擎调优：

- 主键尽可能小，否则会给Secondary index带来负担
- 避免全表扫描，这会造成锁表
- 避免主键更新，这会造成大量的数据移动



补充，事务ACID指：

- **A，原子性（Atomicity）：** 指一个事务要么全部执行，要么不执行。也就是说一个事务不可能只执行了一半就停止了。比如你从取款机取钱，这个事务可以分成两个步骤：1划卡，2出钱.不可能划了卡，而钱却没出来.这两步必须同时完成，要么就不完成。
- **C，一致性（Consistency）：** 指事务的运行并不改变数据库中数据的一致性。例如，完整性约束了a+b=10，一个事务改变了a，那么b也应该随之改变。
- **I，独立性（Isolation）：** 事务的独立性也有称作隔离性，是指两个以上的事务不会出现交错执行的状态，因为这样可能会导致数据不一致。
- **D，持久性（Durability）：** 事务的持久性是指事务执行成功以后，该事务所对数据库所作的更改便是持久的保存在数据库之中，不会无缘无故的回滚。



## MyISAM引擎

MyISAM既不支持事务、也不支持外键、其优势是访问速度快，但是表级别的锁定限制了它在读写负载方面的性能，因此它**经常应用于只读或者以读为主的数据场景**。默认使用B+TREE数据结构存储索引。



MyISAM引擎有如下特点：

1. 不支持事务
2. 表级锁定（更新时锁定整个表）
3. 读写互相阻塞（写入时阻塞读入、读时阻塞写入；但是读不会互相阻塞）
4. 只会缓存索引（通过key_buffer_size缓存索引，但是不会缓存数据）
5. 不支持外键
6. 读取速度快



然后它适用于如下业务场景：

1. 不需要支持事务的场景（像银行转账之类的不可行）
2. 一般读数据的较多的业务
3. 数据修改相对较少的业务
4. 数据一致性要求不是很高的业务



MyISAM引擎调优：

1. 设置合适索引
2. 启用延迟写入，尽量一次大批量写入，而非频繁写入
3. 尽量顺序insert数据，让数据写入到尾部，减少阻塞
4. 降低并发数，高并发使用排队机制
5. MyISAM的count只有全表扫描比较高效，带有其它条件都需要进行实际数据访问



## Memory引擎

在内存中创建表。每个MEMORY表只实际对应一个磁盘文件（frm 表结构文件）。MEMORY类型的表访问非常得快，因为它的数据是放在内存中的，并且默认使用[HASH](https://so.csdn.net/so/search?q=HASH&spm=1001.2101.3001.7020)索引。要记住，在用完表格之后就删除表格，不然一直占据内存空间。



Memory引擎有如下特点：

1. 支持的数据类型有限制，比如：不支持TEXT和BLOB类型（长度不固定），对于字符串类型的数据，只支持固定长度的行，VARCHAR会被自动存储为CHAR类型；
2. 支持的锁粒度为表级锁。所以，在访问量比较大时，表级锁会成为MEMORY存储引擎的瓶颈；
3. 由于数据是存放在内存中，一旦服务器出现故障，数据都会丢失；
4. 查询的时候，如果有用到临时表，而且临时表中有BLOB，TEXT类型的字段，那么这个临时表就会转化为MyISAM类型的表，性能会急剧降低；
5. 默认使用hash索引。
6. 如果一个内部表很大，会转化为磁盘表。



然后它适用于如下业务场景：

1. 那些内容变化不频繁的代码表，或者作为统计操作的中间结果表，便于高效地对中间结果进行分析并得到最终的统计结果。
2. 目标数据比较小，而且非常频繁的进行访问，在内存中存放数据，如果太大的数据会造成内存溢出。可以通过参数max_heap_table_size控制Memory表的大小，限制Memory表的最大的大小。
3. 数据是临时的，而且必须立即可用得到，那么就可以放在内存中。
4. 存储在Memory表中的数据如果突然间丢失的话也没有太大的关系。









# 参考

1. [MySQL体系构架、存储引擎和索引结构](https://blog.csdn.net/wangfeijiu/article/details/112454405)
2. [MySQL中四种常用存储引擎的介绍](https://blog.csdn.net/qq_27028821/article/details/52267991)
