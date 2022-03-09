---
title: Java集合学习
comment: true
date: 2022-03-06 17:09:22
tags:
categories:
addrlink:
---

# Java集合介绍

## 集合是？

Java是面向对象的语言，我们在编程的时候自然需要存储对象的容器，数组可以满足这个需求，但是数组初始化时长度是固定的，但是我们往往需要一个长度可变化的容器，因此，集合出现了。

Java集合在`java.util`包中，这些集合可以看作是容器，用来存储、获取、操纵和传输具有相同性质的多个元素。

Java集合有很多种，有些是方便插入和删除的，有些是为了方便查找数据。



## 集合类的继承关系

集合类分为两种：`Collection` 和 `Map` ：

- `Collection` 存储着对象的集合。
- `Map` 存储着键值对（两个对象）的映射表。



`Collection`接口是集合类的根接口，Java中没有提供这个接口的直接的实现类。

`Map`是Java.util包中的另一个接口，它和`Collection`接口没有关系，是相互独立的，但是都属于集合类的一部分。Map包含了key-value对。Map不能包含重复的key，但是可以包含相同的value。

Java中常用的集合类有`List`集合、`Set`集合和`Map`集合。其中`List`集合和`Set`集合继承了`Collection`接口(Java5后新增了队列`Queue`)，`List`接口的实现类为`ArrayList`，`LinkedList`；

`Map`接口有两个实现类，`HashMap`，`HashTable`，如下图：

![请添加图片描述](D:\blog\source\_drafts\Java集合学习\1.jpg)

<img src="D:\blog\source\_drafts\Java集合学习\3.png" alt="img" style="zoom:100%;" />





## 集合和数组的区别

- **长度区别**：数组是静态的，一个数组实例长度不可变，一旦创建了就无法改变容量；集合是可以动态扩展容量，集合长度可变。
- **内容区别**：集合不声明可存储元素类型，集合可存储不同类型元素；数组声明了它容纳的元素的类型且只可存放单一类型元素。
- **元素区别**：集合只能存储引用类型元素，数组可存储引用类型，也可存储基本类型。
- 数组是java语言中内置的数据类型，是线性排列的，执行效率或者类型检查都是最快的。

![这里写图片描述](D:\blog\source\_drafts\Java集合学习\2.jpg)





下面就详细介绍各个集合类。



# Collection接口和Iterator接口

## Collection接口

`Collection` 接口常用的方法有：

|               方法                |                             说明                             |
| :-------------------------------: | :----------------------------------------------------------: |
|       boolean add(Object o)       |      向集合中加入指定对象o,增加成功返回true，失败false       |
|   boolean addAll(Collection c)    | 将指定集合c内的所有元素添加到该集合内，增加成功返回true，否则返回false |
|           void clear()            |                     删除集合内的所有元素                     |
|    boolean contains(Object o)     |            判定集合内是否包含指定元素，是返回true            |
| boolean containsAll(Collection c) |        判定集合内是否包含集合c的所有元素 ,是返回true         |
|         boolean isEmpty()         |                 判定是否为空集合，是返回true                 |
|        Iterator iterator()        |        返回一个Iterator对象，可以用来遍历集合中的元素        |
|     boolean remove(Object o)      |            从集合中删除指定元素 o，成功则返回true            |
|  boolean removeAll(Collection c)  | 删除该集合中包含集合c的所有元素，若删除了1个及以上的元素则返回true |
|  boolean retainAll(Collection c)  | 删除该集合中除集合c中元素以外的元素，若调用该方法的集合元素改变了，则返回true |
|            int size()             |                     返回集合中元素的数目                     |
|        Object[] toArray()         |          返回一个数组，该数组中包括集合中的所有元素          |

![这里写图片描述](D:\blog\source\_drafts\Java集合学习\4.jpg)



## Iterator接口

遍历 `Collection` 集合中的元素，除了可以通过常规的 `for` 循环之外，还可以通过迭代器 `Iterator` 。

迭代器 `Iterator` 在对集合进行迭代遍历的同时，还可插入、删除元素。

此外， `ListIterator` 在 `Iterator` 的基础上进行了扩展，允许双向遍历列表，而 `Iterator` 只能向后迭代，但 `ListIterator` 只能用于 `List` 及其子类。

`Iterator` 接口常用的方法有：

|         方法          |   接口类型   |                             说明                             |
| :-------------------: | :----------: | :----------------------------------------------------------: |
|   boolean hasNext()   |   Iterator   |                   还有元素可以迭代返回true                   |
|     Object next()     |   Iterator   |                        返回下一个元素                        |
|     void remove()     |   Iterator   |                         删除当前元素                         |
|  void add(Object o)   | ListIterator |  将指定元素o插入集合，该元素在下一次调用next()方法时被返回   |
|   boolean hasNext()   | ListIterator |                   存在下一个元素时返回true                   |
| boolean hasPrevious() | ListIterator |                   存在前一个元素时返回true                   |
|     Object next()     | ListIterator |                    返回列表中的下一个元素                    |
|   Object previous()   | ListIterator |                    返回列表中的前一个元素                    |
|    int nextIndex()    | ListIterator | 返回列表下一个元素的下标，如果不存在下一个元素，则返回列表的大小 |
|  int previousIndex()  | ListIterator |  返回列表前一个元素的下标，如果不存在前一个元素，则返回 -1   |
|     void remove()     | ListIterator |                         删除当前元素                         |
|  void set(Object o)   | ListIterator | 将o赋值给当前元素，即上一次调用next方法或previous方法后返回的元素 |



### 示例

利用Iterator进行集合元素的输出：

```java
class Example8_2 {
    public static void main(String[] args) {
        ArrayList arrayList = new ArrayList();
        arrayList.add("a");
        arrayList.add("b");
        arrayList.add("c");
        System.out.println("集合的内容为：");
        Iterator iterator = arrayList.iterator();//iterator()方法返回一个Iterator对象
        while (iterator.hasNext()){
            Object o = iterator.next();//循环输出
            System.out.println(o);
            if(o.equals("b")){
                iterator.remove();//将当前元素删除
            }
        }
        System.out.println("删除b元素后，集合的内容为："+arrayList);
    }
}
```

利用Iterator进行反向输出：

```java
class Example8_3 {
    public static void main(String[] args) {
        ArrayList arrayList = new ArrayList();
        arrayList.add("a");
        arrayList.add("b");
        arrayList.add("c");
        ListIterator listIterator = arrayList.listIterator();//返回ListIterator对象
        while (listIterator.hasNext()){
            System.out.println(listIterator.next());
        }

		// 将列表反向输出
        while (listIterator.hasPrevious()){
            Object o= listIterator.previous();
            System.out.println(o);
        } 
    }
}
```



# List集合

`List` 集合为列表类型，以线性方式存储对象，可以通过对象的索引操作对象，因此 `List` 集合中的元素保持一定的顺序，此外允许元素重复。

 `List` 集合主要有两种实现类： `ArrayList` 类和 `LinkedList` 类。

`List`接口实现了`Collection`接口，因此 `List` 接口拥有 `Collection` 接口提供的所有方法，此外 `List` 接口还提供了一些其他的方法。

`List` 接口的常用方法有：

| 方法                                        | 说明                                                         |
| :------------------------------------------ | :----------------------------------------------------------- |
| boolean add(int index, Object element)      | index为对象element要加入的位置，其他对象的索引位置相对后移１位，索引位置从０开始 |
| E remove(int index)                         | 移出列表中指定位置元素                                       |
| E set(int index, E element)                 | 用指定元素替换列表中指定位置元素                             |
| E get(int index)                            | 返回列表中指定位置元素                                       |
| int indexOf(Object o)                       | 返回列表中指定元素位置的索引。存在多个时，返回第一个的索引位置，不存在返回－１ |
| int lastIndexOf(Object o)                   | 返回列表中指定元素位置的索引。存在多个时，返回最后一个的索引位置，不存在返回－１ |
| ListIterator<> listIterator()               | 返回此列表元素的列表迭代器(按适当顺序)                       |
| ListIterator<> listIterator(int index)      | 返回此列表元素的列表迭代器(按适当顺序)，从列表的指定位置开始 |
| List <> subList(int fromIndex, int toIndex) | 返回一个指定区域的List集合对象，指定区域从索引fromIndex（包括）到索引toIndex（不包括） |



## ArrayList类

`ArrayList`采用动态对象数组实现，默认构造方法创建一个初始容量为10的空数组，之后的扩容算法为：新建一个新的数组，其容量为原来数组的大小＋原来数组的一半。建议创建`ArrayList`时给定一个初始容量。

>  如果频繁的对 `ArrayList` 进行扩容，毫不疑问会降低`ArrayList`的使用性能，因此当我们确定添加元素的个数的时候，我们可以事先知道并指定ArrayList的可存储元素的个数，这样当我们向`ArrayList`中加入元素的时候，就可以避免`ArrayList`的自动扩容，从而提高`ArrayList`的性能。

总的来说， `ArrayList` 的底层数据结构是**数组**，**查询快**，**增删慢**，**线程不安全**，**效率高**，可以存储重复元素。



## Vector类

`Vector` 的底层数据结构是**数组**，**查询快**，**增删慢**，**线程安全**，**效率低**，可以存储重复元素。

`Vector` 的扩容与 `ArrayList` 相比，多了个扩容因子 `capacityIncrement` ，当扩容因子大于0时，新数组长度为原数组长度+扩容因子，否则为原数组长度的2倍。



`ArrayList` 和 `Vector` 都是用数组实现的，主要有这么三个区别：

1. `Vector` 是多线程安全的，而 `ArrayList` 不是，然而这也导致了 `Vector` 在效率比 `ArrayList` 低很多；
2. `Vector` 与 `ArrayList` 都是采用的线性连续空间存储元素，但当空间不足的时候，它们的空间扩容方式不一样。
3. `Vector` 是一种老的动态数组，是线程同步的，效率很低，一般不赞成使用。



## LinkedList类

`LinkedList` 类的底层数据结构是**链表**，**查询慢**，**增删快**，**线程不安全**，**效率高**，可以存储重复元素。

它的常用方法：

| 方法               | 说明                       |
| ------------------ | -------------------------- |
| void addFirst(E e) | 将指定元素插入此列表的开头 |
| void addLast(E e)  | 将指定元素插入此列表的结尾 |
| E getFirst()       | 返回列表开头的元素         |
| E getLast()        | 返回列表结尾的元素         |
| E removeFirst()    | 移除列表开头的元素         |
| E removeLast()     | 移除列表结尾的元素         |



`LinkedList` 与 `ArrayList` 对比：

1. 都是不同步的，也就是不保证线程安全；
2. `Arraylist` 底层使用的是 `Object` 数组；`LinkedList` 底层使用的是 **双向链表** 数据结构（JDK1.6 之前为循环链表，JDK1.7 取消了循环）
3. 插入和删除是否受元素位置的影响：
   - `ArrayList` 采用数组存储，所以插入和删除元素的时间复杂度受元素位置的影响。 比如：执行`add(E e)`方法的时候， `ArrayList` 会默认在将指定的元素追加到此列表的末尾，这种情况时间复杂度就是 O(1)。但是如果要在指定位置 i 插入和删除元素的话（`add(int index, E element)`）时间复杂度就为 O(n-i)。因为在进行上述操作的时候集合中第 i 和第 i 个元素之后的(n-i)个元素都要执行向后位/向前移一位的操作。
   - `LinkedList` 采用链表存储，所以，如果是在头尾插入或者删除元素不受元素位置的影响（`add(E e)`、`addFirst(E e)`、`addLast(E e)`、`removeFirst()` 、 `removeLast()`），近似 O(1)，如果是要在指定位置 `i` 插入和删除元素的话（`add(int index, E element)`，`remove(Object o)`） 时间复杂度近似为 O(n) ，因为需要先移动到指定位置再插入。
4. `LinkedList` 不支持高效的随机元素访问，而 `ArrayList` 支持。快速随机访问就是通过元素的序号快速获取元素对象(对应于`get(int index)`方法)。
5. ArrayList 的空 间浪费主要体现在在 list 列表的结尾会预留一定的容量空间，而 LinkedList 的空间花费则体现在它的每一个元素都需要消耗比 ArrayList 更多的空间（因为要存放直接后继和直接前驱以及数据）。







## 总结

![img](D:\blog\source\_drafts\Java集合学习\5.jpg)



# Set集合

`List` 集合按照对象的插入顺序保存对象， `Set`  集合的对象不按照顺序保存对象，可以说是不完全无序状态。

`Set` 集合中的对象没有按照特定的方式排序，仅仅简单地将对象加入其中，但是集合中不能存放重复对象。由于 `Set` 接口实现了`Collection` 接口，所以 `Set` 接口也有 `Collection` 接口提供的所有常用方法。



## HashSet类

`HashSet` 类底层用数组存储数据，按照 Hash 算法来存储集合中的元素，根据对象的哈希码确定对象的存储位置，具有良好的存取和查找性能，效率高，可以存储 `Null` 值（只存一个），但**线程不安全**。

元素的唯一性是靠所存储元素类型是否重写 `hashCode()` 和 `equals()` 方法来保证的，如果没有重写这两个方法，则无法保证元素的唯一性。

`HashSet` 实现元素唯一性的比较过程：

1. 存储元素首先会使用 `hash()` 算法函数生成一个 int 类型 hashCode 散列值。
2. 与已经存储的元素的 hashCode 值比较，如果 hashCode 不相等，则这两个对象一定不相等，如果 hashCode 相等，那这两个对象还不一定相等，得继续第三步。
3. 调用 `equals()` 方法判断两个对象的内容是否相等，如果内容相等，那么就是同一个对象，无需存储；如果比较的内容不相等，那么就是不同的对象，可以存储。可见， `equals()` 方法就是用于解决 hash 地址冲突的。

> 因此，要存入 `HashSet` 集合中的自定义类必须覆盖 `hashCode()` 和 `equals()` 两个方法，才能保证集合中元素不重复。
>
> Override `hashCode()` 方法的原则：
>
> 1. 一定要让那些我们认为相同的对象返回相同的hashCode值
> 2. 尽量让那些我们认为不同的对象返回不同的hashCode值，否则，就会增加冲突的概率。
> 3. 尽量的让hashCode值散列开（两值用异或运算可使结果的范围更广）



`HashSet` 类的常用方法：

| 方法                        | 说明                             |
| --------------------------- | -------------------------------- |
| boolean add(E e)            | 向集合中添加集合中没有的元素     |
| void clear()                | 移除集合中所有的元素             |
| boolean contains(Object o ) | 如果集合中包含指定元素，返回true |
| boolean isEmpty()           | 如果为空集合，则返回true         |
| Iterator iterator()         | 返回此集合中元素进行迭代的迭代器 |
| boolean remove(Object o)    | 删除指定元素                     |
| int size()                  | 返回集合中元素数量               |



### 底层实现

`HashSet`底层完全就是在`HashMap`的基础上包了一层，只不过存储的时候`value`是默认存储了一个`Object`的静态常量，取的时候也是只返回`key`



HashSet 是基于 HashMap 实现的，默认构造函数是构建一个初始容量为16，负载因子为0.75 的 HashMap 。即，HashSet 封装了一个 HashMap 对象来存储所有的集合元素，所有放入 HashSet 中的集合元素实际上由 HashMap 的 key 来保存，而 HashMap 的 value 则存储了一个 PRESENT，它是一个静态的 Object 对象。

因此，HashSet的其他操作都是基于HashMap的。




直接看源码：

```java
public class HashSet<E>
    extends AbstractSet<E>
    implements Set<E>, Cloneable, java.io.Serializable
{
    //序列化版本号
    static final long serialVersionUID = -5024744406713321676L;   

    //底层使用HashMap来保存HashSet中所有元素。
    private transient HashMap<E,Object> map;

    //定义一个虚拟的Object对象作为HashMap的value，将此对象定义为static final。
    private static final Object PRESENT = new Object();

	// 默认的无参构造器，构造一个空的HashSet。
	// 实际底层会初始化一个空的HashMap，并使用默认初始容量为16和加载因子0.75。
    public HashSet() {
        map = new HashMap<>();
    }

	// 构造一个包含指定collection中的元素的新set
    // 实际底层使用默认的加载因子0.75和足以包含指定collection中所有元素的初始容量来创建一个HashMap。
    public HashSet(Collection<? extends E> c) {
        map = new HashMap<>(Math.max((int) (c.size()/.75f) + 1, 16));
        addAll(c);
    }

	// 以指定的初始容量和加载因子构造一个空的HashSet。
	// 实际底层以相应的参数构造一个空的HashMap。
    public HashSet(int initialCapacity, float loadFactor) {
        map = new HashMap<>(initialCapacity, loadFactor);
    }

    // 以指定的初始容量构造一个空的HashSet。
	// 实际底层以相应的参数构造一个空的HashMap。
    public HashSet(int initialCapacity) {
        map = new HashMap<>(initialCapacity);
    }


    HashSet(int initialCapacity, float loadFactor, boolean dummy) {
        map = new LinkedHashMap<>(initialCapacity, loadFactor);
    }
	
 	
    // 返回对此set中元素进行迭代的迭代器。返回元素的顺序并不是特定的。
    // 实际调用底层HashMap的keySet来返回所有的key。
    // 可见HashSet中的元素，只是存放在了底层HashMap的key上，value使用一个static final的Object对象标识。
    public Iterator<E> iterator() {
        return map.keySet().iterator();
    }

    public int size() {
        return map.size();
    }

    public boolean isEmpty() {
        return map.isEmpty();
    }

    
	//如果此set包含指定元素，则返回true
    //底层实际调用HashMap的containsKey判断是否包含指定key
    public boolean contains(Object o) {
        return map.containsKey(o);
    }

	
    public boolean add(E e) {
        return map.put(e, PRESENT)==null;
    }


    public boolean remove(Object o) {
        return map.remove(o)==PRESENT;
    }


    public void clear() {
        map.clear();
    }

    
    @SuppressWarnings("unchecked")
    public Object clone() {
        try {
            HashSet<E> newSet = (HashSet<E>) super.clone();
            newSet.map = (HashMap<E, Object>) map.clone();
            return newSet;
        } catch (CloneNotSupportedException e) {
            throw new InternalError(e);
        }
    }
	
	
    //写入输出流操作。
    private void writeObject(java.io.ObjectOutputStream s)
        throws java.io.IOException {
        // Write out any hidden serialization magic
        s.defaultWriteObject();

        // Write out HashMap capacity and load factor
        s.writeInt(map.capacity());
        s.writeFloat(map.loadFactor());

        // Write out size
        s.writeInt(map.size());

        // Write out all elements in the proper order.
        for (E e : map.keySet())
            s.writeObject(e);
    }

    
    //从输入流中读取对象
    private void readObject(java.io.ObjectInputStream s)
        throws java.io.IOException, ClassNotFoundException {
        // Read in any hidden serialization magic
        s.defaultReadObject();

        // Read capacity and verify non-negative.
        int capacity = s.readInt();
        if (capacity < 0) {
            throw new InvalidObjectException("Illegal capacity: " +
                                             capacity);
        }

        // Read load factor and verify positive and non NaN.
        float loadFactor = s.readFloat();
        if (loadFactor <= 0 || Float.isNaN(loadFactor)) {
            throw new InvalidObjectException("Illegal load factor: " +
                                             loadFactor);
        }

        // Read size and verify non-negative.
        int size = s.readInt();
        if (size < 0) {
            throw new InvalidObjectException("Illegal size: " +
                                             size);
        }
        // Set the capacity according to the size and load factor ensuring that
        // the HashMap is at least 25% full but clamping to maximum capacity.
        capacity = (int) Math.min(size * Math.min(1 / loadFactor, 4.0f),
                HashMap.MAXIMUM_CAPACITY);

        // Constructing the backing map will lazily create an array when the first element is
        // added, so check it before construction. Call HashMap.tableSizeFor to compute the
        // actual allocation size. Check Map.Entry[].class since it's the nearest public type to
        // what is actually created.

        SharedSecrets.getJavaOISAccess()
                     .checkArray(s, Map.Entry[].class, HashMap.tableSizeFor(capacity));

        // Create backing HashMap
        map = (((HashSet<?>)this) instanceof LinkedHashSet ?
               new LinkedHashMap<E,Object>(capacity, loadFactor) :
               new HashMap<E,Object>(capacity, loadFactor));

        // Read in all elements in the proper order.
        for (int i=0; i<size; i++) {
            @SuppressWarnings("unchecked")
                E e = (E) s.readObject();
            map.put(e, PRESENT);
        }
    }


    public Spliterator<E> spliterator() {
        return new HashMap.KeySpliterator<E,Object>(map, 0, -1, 0, 0);
    }
}

```





## LinkedHashSet类

`LinkedHashSet` 类底层数据结构采用双向链表和哈希表共同实现，链表保证了元素的顺序与存储顺序一致，哈希表保证了元素的唯一性。

还有， `LinkedHashSet` 类线程不安全。



## TreeSet类

`TreeSet` 底层数据结构采用二叉树（具体点就是红黑树）来实现，元素唯一且已经排好序；唯一性同样需要重写 `hashCode()` 和 `equals()` 方法，二叉树结构保证了元素的有序性。

> 红黑树（Red-Black Tree，R-B Tree）是一种特殊的二叉查找树。它是自平衡的。

关于元素的排序，根据 `TreeSet` 构造方法的不同，可分为 **自然排序（无参构造）** 和 **比较器排序（有参构造）** ：

1. **自然排序：** 要求元素必须实现 `Compareable` 接口，并重写里面的 `x.compareTo(T y)` 方法，元素通过比较返回的 int 值来判断排序序列（ `int compare(T o1,T o2)` 也类似 ）

   - 返回 0 ：两个对象相同，不需要存储；
   - 返回负数：x比y小；
   - 返回正数：x比y大。

   若该元素为基本类型，则有如下默认排序规则：

   - 数值：大小排序
   - 字符：按照字符对应的Unicode值排序
   - 时间日期：按照时间顺序排序
   - boolean：true>false

2. **比较器排序：** 需要在 `TreeSet` 初始化的时候传入一个实现 `Comparator` 接口的比较器对象，或者采用匿名内部类的方式 new一个 `Comparator` 对象，重写里面的 `compare()` 方法。



`TreeSet` 常用方法：

| 方法                                         | 说明                                                        |
| -------------------------------------------- | ----------------------------------------------------------- |
| TreeSet()                                    | 构造一个空Set对象，Set根据元素的自然顺序进行排序            |
| TreeSet(Collection c)                        | 构造了一个包含c中的元素的set                                |
| TreeSet(Comparator comparator)               | 按照comparator指定的比较方法进行排序                        |
| TreeSet(SortedSet s)                         | 构造了一个包含s中的元素的set                                |
| Object first()                               | 返回Set中排序为第一个的元素                                 |
| Object last()                                | 返回Set中排序为最后一个的元素                               |
| E lower(E e)                                 | 返回此Set中严格小于给定元素的最大元素，如果不存在则返回null |
| E higher(E e)                                | 返回此Set中严格大于给定元素的最大元素，如果不存在则返回nul  |
| SortedSet subSet(E fromElement, E toElement) | 返回有序集合，其元素范围为[ fromElement, toElement )        |
| SortedSet headSet(E toElement)               | 返回此Set的部分集合，其元素小于toElement                    |
| SortedSet tailSet(E fromElement)             | 返回此Set的部分集合，其元素大于等于fromElement              |



## 总结

![这里写图片描述](D:\blog\source\_drafts\Java集合学习\6.jpg)



# Queue集合

`Queue` 接口是一个先入先出（ `FIFO` ）的数据结构，继承 `Collection` 接口，`LinkedList`（双向链表）实现了 `List` 和 `Deque` 接口。



## Deque接口

`Deque` 是 `Queue` 的子接口



## ArrayDeque类



## PriorityQueue类

`PriorityQueue` （优先队列）是 `Queue` 接口的实现类，其**底层是堆实现**的。每次插入或删除元素后都对队列进行调整，队列始终构成最小堆或最大堆。

`PriorityQueue` 类的常用方法：

| 方法                       | 说明                                         |
| -------------------------- | -------------------------------------------- |
| boolean add(E e)           | 插入指定元素到此优先队列                     |
| boolean offer(E e)         | 插入指定元素到此优先队列                     |
| void clear()               | 删除所有元素                                 |
| boolean contains(Object o) | 是否包含指定元素                             |
| peek()                     | 获取此优先队列的头，队列为空返回null         |
| poll()                     | 获取并且删除此优先队列的头，队列为空返回null |
| boolean remove(Object o)   | 删除指定元素                                 |
| int size()                 | 返回此优先队列元素个数                       |



# Map集合

`Map` 集合用于保存具有映射关系的数据，在 Map 集合中保存着两组值，一组值是 key 键，另一组值是 value 值。key 和value之间存在一对一的关系，通过指定的 key 键就能找到唯一的 value 值。 `Map` 中的 key 键不允许重复（key键唯一），value 值可以重复。

`Map` 接口常用方法：

| 方法                                         | 说明                                           |
| -------------------------------------------- | ---------------------------------------------- |
| put(K key, V value)                          | 向集合中添加指定的键——值映射关系               |
| void putAll(Map<? extends K, ? extends V> m) | 向集合中添加指定集合中所有的键——值映射关系     |
| boolean containsKey(Object key)              | 判断此集合中是否包含指定的键映射关系           |
| boolean containsValue(Object value)          | 判断此集合中是否包含指定的值映射关系           |
| V get(Object key)                            | 返回指定的键所映射的值，否则返回null           |
| Set keySet()                                 | 以Set集合的形式返回该集合中的所有键对象        |
| Collection values()                          | 以Collection集合的形式返回该集合中的所有值对象 |
| V remove(Object key)                         | 删除并返回键对应的值对象                       |
| void clear()                                 | 清空集合中所有的映射关系                       |
| boolean isEmpty()                            | 判断集合是否为空                               |
| int size()                                   | 返回集合中键——值映射关系的个数                 |
| boolean equals(Object o)                     | 比较指定的键——值映射关系是否相等               |

![这里写图片描述](D:\blog\source\_drafts\Java集合学习\7.jpg)



## HashMap类

`HashMap` 实现了 `Map` 接口，因此 `HashMap` 有Map接口提供的所有常用方法。与 `HashSet` 类似， `HashMap` 不能保证元素的顺序。

`HashMap`的底层实现采用了哈希表，JDK1.8之前，HashMap的底层是采用数组+链表的方法，即用链表处理哈希冲突。



![请添加图片描述](D:\blog\source\_drafts\Java集合学习\8.jpg)





# 参考

1. [Java学习笔记十七——集合类详细总结各自对比](https://blog.csdn.net/Pandafz1997/article/details/120558429) 
2. [java集合超详解](https://blog.csdn.net/feiyanaffection/article/details/81394745) 
2. [红黑树(一)之 原理和算法详细介绍](https://www.cnblogs.com/skywang12345/p/3245399.html)
2. [Java ArrayList自动扩容机制](https://blog.csdn.net/qiangxuan520/article/details/82664274)
2. [ArrayList和Vector的扩容机制](https://www.cnblogs.com/wuxiang/p/5328241.html)
2. [Java面试题之HashSet 的实现原理？](https://www.cnblogs.com/hyhy904/p/10930703.html)
2. [Java集合 --- HashSet底层实现和原理（源码解析）](https://www.jianshu.com/p/6cab0fae2403)
