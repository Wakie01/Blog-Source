---
title: Java异常面试题
comment: true
date: 2022-03-04 21:36:33
tags:
categories:
addrlink:
---

## 1. finally 块中的代码什么时候被执行？

在 Java 语言的异常处理中，finally 块的作用就是为了保证无论出现什么情况，finally 块里的代码一定会被执行。

由于程序执行 return 就意味着结束对当前函数的调用并跳出这个函数体，因此任何语句要执行都只能在 return 前执行（除非碰到 exit 函数），因此 finally 块里的代码也是在 return 之前执行的。

此外，如果 try-finally 或者 catch-finally 中都有 return，那么 finally 块中的 return 将会覆盖别处的 return 语句，最终返回到调用者那里的是 finally 中 return 的值。

具体可看 [11. try-catch-finally中的执行顺序]()



## 2. finally 是不是一定会被执行到？

不一定。下面列举两种执行不到的情况：

1. 当程序进入 try 块之前就出现异常时，会直接结束，不会执行 finally 块中的代码；
2. 当程序在 try 块中强制退出时也不会去执行 finally 块中的代码，比如在 try 块中执行 `System.exit()` 方法。



## 3. try-catch-finally 中，如果 catch 中 return 了，finally 还会执行吗？

会。

程序在执行到 return 时会首先将返回值存储在一个指定的位置，其次去执行 finally 块，最后再返回。

对基本数据类型，在 finally 块中改变 return 的值没有任何影响，直接覆盖掉；而对引用类型是有影响的，返回的是在 finally 对 前面 return 语句返回对象的修改值。

具体可看 [11. try-catch-finally中的执行顺序]()



## 4. try-catch-finally 中那个部分可以省略？

catch 和 finally可以省略其中一个，但必须保留其中一个。

try 只适合处理运行时异常，try+catch 适合处理运行时异常+普通异常。也就是说，如果你只用 try 去处理普通异常却不加以 catch 处理，编译是通不过的，因为编译器硬性规定，普通异常如果选择捕获，则必须用 catch 显示声明以便进一步处理。而运行时异常在编译时没有如此规定，所以 catch 可以省略，你加上 catch 编译器也觉得无可厚非。



## 5. Error 和 Exception 的区别？

Error 类和 Exception 类的父类都是 Throwable 类。主要区别如下：

1. Error 类： 一般是指与虚拟机相关的问题，如：系统崩溃、虚拟机错误、内存空间不足、方法调用栈溢出等。这类错误将会导致应用程序中断，仅靠程序本身无法恢复和预防；
2. Exception 类：分为运行时异常和受检查的异常（编译异常）。
   1. 运行时异常：RuntimeException，这些异常是不检查异常，即Java编译器不会检查它，程序中可以选择捕获处理，也可以不处理。这些异常一般是由程序逻辑错误引起的，程序应该从逻辑角度尽可能避免这类异常的发生。
   2. 受检查的异常：又称非运行时异常、编译异常。是RuntimeException以外的异常，从程序语法角度讲是必须进行处理的异常（try-catch处理），如果不处理，程序就不能编译通过。

![img](D:\blog\source\_drafts\Java异常面试题\1.jpg)

<img src="https://img.jbzj.com/file_images/article/202011/2020112212554925.png" alt="在这里插入图片描述" style="zoom:80%;" />



## 6. 运行时异常与受检异常有何异同？

1. **运行时异常：** 如：空指针异常、指定的类找不到、数组越界、方法传递参数错误、数据类型转换错误。**可以编译通过，但是一运行就停止了，程序不会自己处理；** 
2. **受检查异常：** 要么用 try … catch… 捕获，要么用 throws 声明抛出，交给父类处理。



## 7. throw 和 throws 的区别？

- **throw：** 在方法体内部，表示抛出异常，由方法体内部的语句处理；throw 是具体向外抛出异常的动作，所以它抛出的是一个异常实例；
- **throws：** 在方法声明后面，表示如果抛出异常，由该方法的调用者来进行异常的处理；表示出现异常的可能性，并不一定会发生这种异常。



## 8. 常见的异常类有哪些？

- NullPointerException：当应用程序试图访问空对象时，则抛出该异常。
- SQLException：提供关于数据库访问错误或其他错误信息的异常。
- IndexOutOfBoundsException：指示某排序索引（例如对数组、字符串或向量的排序）超出范围时抛出。
- FileNotFoundException：当试图打开指定路径名表示的文件失败时，抛出此异常。
- IOException：当发生某种 I/O 异常时，抛出此异常。此类是失败或中断的 I/O 操作生成的异常的通用类。
- IllegalArgumentException：抛出的异常表明向方法传递了一个不合法或不正确的参数。
- ClassCastException：当试图将对象强制转换为不是实例的子类时，抛出该异常

<img src="D:\blog\source\_drafts\Java异常面试题\2.png" alt="在这里插入图片描述" style="zoom:80%;" />



## 9. 主线程可以捕获到子线程的异常吗？

线程设计的理念：“线程的问题应该线程自己本身来解决，而不要委托到外部”。

正常情况下，如果不做特殊的处理，在主线程中是不能够捕获到子线程中的异常的。如果想要在主线程中捕获子线程的异常，我们可以用如下的方式进行处理，使用 Thread 的静态方法：

```java
Thread.setDefaultUncaughtExceptionHandler(new MyUncaughtExceptionHandle());
```



## 10. 说一下Java异常处理涉及到的几个关键字

1. `try` ：用于监听。将要被监听的代码（可能抛出异常的代码）放在 try 语句块之内，当 try 语句块内发生异常时，异常就被抛出。
2. `catch` ：用于捕获异常。catch 用来捕获 try 语句块中发生的异常。
3. `finally` ：finally 语句块总是会被执行。它主要用于回收在 try 块里打开的物力资源（如数据库连接、网络连接和磁盘文件）。
4. `throw` ：用于抛出异常。
5. `throws` ：用在方法签名中，用于声明该方法可能抛出的异常。



## 11. try-catch-finally中的执行顺序

例子一：

```java
public int test01(){
    try{
        System.out.println("try块");
        return 0;
    }catch (Exception e){
        System.out.println("Exception块");
    }finally {
        System.out.println("finally块");
    }
    System.out.println("return块");
    return 1;
}
```

输出结果：

```bash
try块
finally块
0
```

例子二：

```java
public int test02(){
    int a=1,b=0;
    try {
        System.out.println("try块");
        int n=a/b;
    }catch (Exception e){
        System.out.println("Exception块");
        return -1;
    }finally {
        System.out.println("finally块");
    }
    System.out.println("return块");
    return 1;
}
```

输出结果：

```bash
try块
Exception块
finally块
-1
```

从例子一与例子二中可见，在finally块前return，依旧会执行finally块。

例子三：

```java
public int test03(){
    int res=1;
    int a=1,b=0;
    try {
        System.out.println("try块");
        int n=a/b;
    }catch (Exception e){
        System.out.println("Exception块");
        res=-1;
        return res;
    }finally {
        System.out.println("finally块");
        res=-2;
    }
    System.out.println("return块");
    return res;
}
```

输出结果：

```bash
try块
Exception块
finally块
-1
```

例子四：

```java
public int test04(){
    int res=1;
    try {
        System.out.println("try块");
        return res;
    }catch (Exception e){
        System.out.println("Exception块");
        res=-1;
        return res;
    }finally {
        System.out.println("finally块");
        res=-2;
        System.out.println("finally块的res: "+res);
    }
}
```

输出结果：

```
try块
finally块
finally块的res: -2
1
```

在例子三与例子四中，虽然在finally块对返回值的变量进行了修改，但由于返回值已经返回了，所以函数的返回值不变。

例子五：

```java
public int test05(){
    int res=1;
    try {
        System.out.println("try块");
        return res;
    }catch (Exception e){
        System.out.println("Exception块");
        res=-1;
        return res;
    }finally {
        System.out.println("finally块");
        res=-2;
        System.out.println("finally块的res: "+res);
        return res;
    }
}
```

输出结果：

```bash
try块
finally块
finally块的res: -2
-2
```

例子六：

```java
public int test06(){
    int res=1;
    int a=1,b=0;
    try {
        System.out.println("try块");
        int n=a/b;
        return res;
    }catch (Exception e){
        System.out.println("Exception块");
        res=-1;
        return res;
    }finally {
        System.out.println("finally块");
        res=-2;
        System.out.println("finally块的res: "+res);
        return res;
    }
}
```

输出结果：

```bash
try块
Exception块
finally块
finally块的res: -2
-2
```

从例子五与例子六可见，当finally块也返回值时，finally块的返回值会覆盖之前的返回值。

例子七：

```java
public List<Integer> test07(){
    List<Integer> res=new ArrayList<>();
    try{
        System.out.println("try块");
        res.add(1);
        return res;
    }catch (Exception e){
        System.out.println("Exception块");
        res.add(-1);
        return res;
    }finally {
        System.out.println("finally块");
        res.add(-2);
    }
}

public static void main(String[] args) {
    ExceptionLearn el = new ExceptionLearn();
    List<Integer> list = el.test07();
    System.out.print("res: ");
    for (int l : list) {
        System.out.print(l+"  ");
    }
}
```

输出结果：

```bash
try块
finally块
res: 1  -2  
```

例子八：

```java
public List<Integer> test08(){
    List<Integer> res=new ArrayList<>();
    int a=1,b=0;
    try{
        System.out.println("try块");
        int n=a/b;
        res.add(1);
        return res;
    }catch (Exception e){
        System.out.println("Exception块");
        res.add(-1);
        return res;
    }finally {
        System.out.println("finally块");
        res.add(-2);
    }
}

public static void main(String[] args) {
    ExceptionLearn el = new ExceptionLearn();
    List<Integer> list = el.test07();
    System.out.print("res: ");
    for (int l : list) {
        System.out.print(l+"  ");
    }
}
```

输出结果：

```bash
try块
Exception块
finally块
res: -1  -2  
```

从例子七与例子八可见，当返回值的类型为引用类型时，若是finally块对返回值进行了修改，就算finally块没有return，返回值也会改变。

**总结：** 

1. 在try中return，在finally执行前会把结果保存起来，即使在finally中有修改也以try中保存的值为准，但如果是引用类型，修改的属性会以finally修改后的为准；
2. 如果try/finally都有return，直接返回finally中的return。
3. finally始终都会执行，
4. 建议不要在finally块中使用return。



## 12. Java异常的分类

Error 类和 Exception 类的父类都是 Throwable 类。主要区别如下：

1. Error 类： 一般是指与虚拟机相关的问题，如：系统崩溃、虚拟机错误、内存空间不足、方法调用栈溢出等。这类错误将会导致应用程序中断，仅靠程序本身无法恢复和预防；
2. Exception 类：分为运行时异常和受检查的异常（编译异常）。
   1. 运行时异常：RuntimeException，这些异常是不检查异常，即Java编译器不会检查它，程序中可以选择捕获处理，也可以不处理。这些异常一般是由程序逻辑错误引起的，程序应该从逻辑角度尽可能避免这类异常的发生。
   2. 受检查的异常：又称非运行时异常、编译异常。是RuntimeException以外的异常，从程序语法角度讲是必须进行处理的异常（try-catch处理或者throw处理），如果不处理，程序就不能编译通过。

![img](D:\blog\source\_drafts\Java异常面试题\1.jpg)

<img src="D:\blog\source\_drafts\Java异常面试题\2.png" alt="在这里插入图片描述" style="zoom:80%;" />





# 记录

1. 2022-03-05 一遍

   