---
title: Java集合面试题
comment: true
date: 2022-03-05 21:26:23
tags:
categories:
addrlink:
---

## 1. Java 中常用的容器有哪些？

常见容器主要包括 Collection 和 Map 两种，Collection 存储着对象的集合，而 Map 存储着键值对（两个对象）的映射表。

<img src="D:\blog\source\_drafts\Java集合面试题\1.png" alt="img" style="zoom:100%;" />

### Collection





## 2. ArrayList 和 LinkedList 的区别？

**ArrayList：**底层是基于数组实现的，查找快，增删较慢；

**LinkedList：**底层是基于链表实现的。确切的说是双向链表（JDK1.6 之前是双向循环链表、JDK1.7 之后取消了循环），查找慢、增删快。LinkedList 链表由一系列表项连接而成，一个表项包含 3 个部分：元素内容、前驱表和后驱表。链表内部有一个 header 表项，既是链表的开始也是链表的结尾。header 的后继表项是链表中的第一个元素，header 的前驱表项是链表中的最后一个元素。

**ArrayList 的增删未必就是比 LinkedList 要慢：**

1. 如果增删都是在末尾来操作【每次调用的都是 remove() 和 add()】，此时 ArrayList 就不需要移动和复制数组来进行操作了。如果数据量有百万级的时，速度是会比 LinkedList 要快的。
2. 如果删除操作的位置是在中间。由于 LinkedList 的消耗主要是在遍历上，ArrayList 的消耗主要是在移动和复制上（底层调用的是 arrayCopy() 方法，是 native 方法）。如果数据量有百万级的时，LinkedList 的遍历速度是要慢于 ArrayList 的复制移动速度的。





## 17. HashSet 的实现原理？

HashSet 是基于 HashMap 实现的，默认构造函数是构建一个初始容量为16，负载因子为0.75 的 HashMap 。

即，HashSet 封装了一个 HashMap 对象来存储所有的集合元素，所有放入 HashSet 中的集合元素实际上由 HashMap 的 key 来保存，而 HashMap 的 value 则存储了一个 PRESENT，它是一个静态的 Object 对象。

因此，HashSet的其他操作都是基于HashMap的。



## 18. HashSet 怎么保证元素不重复的？

1. 存储元素首先会使用 `hash()` 算法函数生成一个 int 类型 hashCode 散列值。
2. 与已经存储的元素的 hashCode 值比较，如果 hashCode 不相等，则这两个对象一定不相等，如果 hashCode 相等，那这两个对象还不一定相等，得继续第三步。
3. 调用 `equals()` 方法判断两个对象的内容是否相等，如果内容相等，那么就是同一个对象，无需存储；如果比较的内容不相等，那么就是不同的对象，可以存储。可见， `equals()` 方法就是用于解决 hash 地址冲突的。

因此，要存入 `HashSet` 集合中的自定义类必须覆盖 `hashCode()` 和 `equals()` 两个方法，才能保证集合中元素不重复。





## 24. Collection 和 Collections 有什么区别？

- `java.util.Collection` 是一个 **集合接口**。它提供了对集合对象进行基本操作的通用接口方法。

- `java.util.Collections` 是一个包装类。它包含各种对集合操作的 **静态多态方法** ，来实现对各种集合的搜索、排序、线程安全等操作。

  此外它不能被实例化，就像一个工具类，服务于 `java.util.Collection` 集合接口。至于为什么不能被实例化，且看 `Collections` 源码：

  ```java
  public class Collections {
      // 构造函数为private
      private Collections() {
      }
      ...
  }
  ```

  
