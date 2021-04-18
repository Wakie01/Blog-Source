---
title: Java注解和反射
comment: true
date: 2021-03-05 14:32:24
tags: Java
categories: BackEnd
addrlink: 1608
---




# 注解Annotation

## 介绍

注解Annotation是从JDK5.0开始引入

**作用：** 

- 注解不是程序本身，它相当于一个标签，对程序进行评价与解释（这一点与注释comment相同）

- 可以被其他程序（如编译器等）读取

**使用：**

- 注解可以附加在package、class、method、field等上面，这就相当于给他们添加了额外的辅助信息，然后我们可以通过反射机制编程实现对这些元数据的访问



## 内置注解

即JDK本身内置的注解

常见内置注解：

- **@Override：** 用于修饰方法，表示重写超类的方法

- **@Deprecated：** 用于修饰方法、属性、类，表示不建议使用

- **@SuppressWarnings：** 用于抑制编译时的警告信息



## 元注解

元注解的作用就是负责注解其他注解，这些元注解可在java.lang.annotation包中找到

对于JDK1.8，共有6个元注解：

- **@Document：** 说明该注解将被包含在javadoc中

- **@Inherited：** 说明子类可以继承父类中的该注解

- **@Native：** 用于修饰成员变量，表示该变量可以被本地代码引用，常被代码生成工具使用

- **@Repeatable：** 表示允许在相同的程序元素中重复注解，即在一处地方重复使用同一个注解

- **@Retention：** 用于描述注解的生命周期

- **@Target：** 用于描述注解的使用范围



## 自定义注解

几个关键点：

- 一个注解里只有参数，没有方法

- 定义注解方法：

  ```java
  public @interface 注解名{
      //参数
  }
  ```

- 注解参数格式：`参数类型`+`参数名`+`();`

- 可通过`default`来声明参数的默认值

- 当注解只有一个参数时，可以使用value当参数名，这样在使用时就可以直接省掉参数名，但若是用别的参数名就不能省了

- 当注解参数没默认值时，则在使用时，必须给参数赋值（即：注解参数必须要有值）



**例子：**


```java
public class Learn {

    //当注解参数没默认值时，则在使用时，必须给参数赋值
    @Student(id = 1,name="Tony")
    public void addStudent(){
    }

    //如果想修改默认值时，也可自行赋值
    @Student(id=2,name="John",age = 20)
    public void addStudent2(){
    }

    //当注解只有一个参数时，可以使用value当参数名，这样在使用时就可以直接省掉参数名
    @GoodStudent("Tony")
    public void praiseStudent(){
    }

    //当然也可以不省
    @GoodStudent(value = "Tony")
    public void praiseStudent2(){
    }

    //该注解虽然只有一个参数，但参数名不是value，所以不能省
    @BadStudent(name = "Tony")
    public void punishStudent(){
    }
}


@Target({ElementType.METHOD,ElementType.FIELD})    //表明注解的使用范围
@Retention(RetentionPolicy.RUNTIME)   //表明注解的生命周期
@interface Student {
    //注解里只有参数
    //注解中的参数格式：  参数类型 + 参数名+ ();
    int id();     //学生ID
    String name();     //名字
    int age() default 18;      //年龄，默认18
    String[] schools() default {"北京小学","北京中学","北京大学"};    //学校，默认……
}

//好学生注解
@Target({ElementType.METHOD,ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@interface GoodStudent{
    //当注解只有一个参数时，可以使用value当参数名，这样在使用时就可以直接省掉参数名，用别的参数名就不能省了
    //表示学生名
    String value();
}

//坏学生注解
@Target({ElementType.METHOD,ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@interface BadStudent{
    String name();
}
```



# 反射Reflection

## 介绍

反射Reflection，是Java被视为准动态语言的关键

> **动态语言：** 是一类在运行时可以改变其结构的语言（就是代码在运行时可被改变）
>
> **静态语言：** 运行时结构不可变的语言



反射机制允许程序在执行期间借助Reflection API获取任何类的内部信息，并能直接操作任意对象的所有内部属性以及方法

在加载完类之后，JVM的堆内存的方法区会产生一个Class类型的对象（一个类只有一个Class对象），这个Class对象包含了完整的类的结构信息，因此我们可以通过这个对象看到类的结构。所以我们形象地称之为`反射`

![image-20210305210853564](.\Java注解和反射\1.png)



反射用到的主要API是`java.lang.Class类`与`java.lang.reflect包`


## 类加载过程

在Java内存中，有以下几个区：

1. **堆：** 

   存放new的对象和数组

   可以被所有的线程共享，不会存放别的对象引用

2. **栈：** 

   存放基本变量类型（会包含这个基本类型的具体数值）

   引用对象的变量（会存放这个引用在堆里面的具体地址）

3. **方法区：** 

   可以被所有的线程共享

   包含了所有的class和static变量



当程序主动使用某个类时，如果该类还未被加载到内存中，则系统会通过以下三个步骤来对该类进行初始化：

1. **类的加载（Load）：**

   将类的class文件字节码读入内存，并将这些静态数据转换成方法区的运行时数据结构，然后为之创建一个java.lang.Class对象。

   此过程由`类加载器`完成

2. **类的链接（Link）：** 

   将类的二进制数据合并到JVM的运行状态之中的过程。此过程又具体分为三个部分：

   **验证：** 确保加载的类信息符合JVM规范，没有安全方面的问题

   **准备： ** 为类变量（static）分配内存，并设置类变量默认初始值，这些内存都在方法区中进行分配

   **解析：** 将虚拟机常量池内的符号引用（常量名）替换为直接引用（地址）

3. **类的初始化（Initialize）：** 

   JVM负责对类进行初始化

   也就是执行类构造器`<clinit>()`方法的过程。类构造器`<clinit>()`方法是由编译器自动收集类中所有类变量的赋值动作和静态代码块中的语句合并产生的。（类构造器是构造类信息的，不是构造该类对象的构造器）

   当初始化一个类的时候，如果发现其父类还没有进行初始化，则需要先初始化父类

   虚拟机会保证一个类的`<clinit()>`方法在多线程环境中被正确加锁和同步





**Q：** 类加载器的作用？

它的作用是把类(class)装载进内存。

JVM规范定义了如下类型的类加载器：

![img](.\Java注解和反射\7.png)



1. **Bootstrap Class Loader：** 引导类加载器，用C++编写的，是JVM自带的类加载器，负责Java平台核心库，用来装载核心类库。该加载器无法直接获取

2. **Extension Class Loader：** 扩展类加载器，负责把`jre/lib/ext`目录下的jar包或`-D java.ext.dirs`指定目录下的jar包装入工作库。该加载器可以获取

3. **App Class Loader：** 系统类加载器，负责将`java -classpath`或`-D java.class.path`所指目录下的类与jar包装入工作库，是最常用的加载器。该加载器可以获取

4. **Custom Class Loader：** 自定义类加载器

**例子：**

```java
public class ClassLoadLearn3 {

    public static void main(String[] args) throws ClassNotFoundException {

        //获取系统类的加载器
        ClassLoader systemClassLoader=ClassLoader.getSystemClassLoader();
        System.out.println(systemClassLoader);

        //获取系统类加载器的父类加载器-->扩展类加载器
        ClassLoader parent=systemClassLoader.getParent();
        System.out.println(parent);

        //获取扩展类加载器的父类加载器-->根加载器(c/c++)
        ClassLoader parent2=parent.getParent();
        //因为无法获取，所以输出null
        System.out.println(parent2);

        //获取当前类是哪个加载器加载的，
        ClassLoader classLoader=ClassLoadLearn3.class.getClassLoader();
        System.out.println(classLoader);

        //测试JDK内置的类是谁加载的
        ClassLoader classLoader1=Class.forName("java.util.Objects").getClassLoader();
        //该类属于Java的核心库，是由引导类（根）加载器加载，所以输出null
        System.out.println(classLoader1);

        //获得系统类加载器可以加载的路径
        System.out.println(System.getProperty("java.class.path"));
        //会输出以下东西
        /*
        D:\java\jdk\jre\lib\charsets.jar;
        D:\java\jdk\jre\lib\deploy.jar;
        D:\java\jdk\jre\lib\ext\access-bridge-64.jar;
        D:\java\jdk\jre\lib\ext\cldrdata.jar;
        D:\java\jdk\jre\lib\ext\dnsns.jar;
        D:\java\jdk\jre\lib\ext\jaccess.jar;
        D:\java\jdk\jre\lib\ext\jfxrt.jar;
        D:\java\jdk\jre\lib\ext\localedata.jar;
        D:\java\jdk\jre\lib\ext\nashorn.jar;
        D:\java\jdk\jre\lib\ext\sunec.jar;
        D:\java\jdk\jre\lib\ext\sunjce_provider.jar;
        D:\java\jdk\jre\lib\ext\sunmscapi.jar;
        D:\java\jdk\jre\lib\ext\sunpkcs11.jar;
        D:\java\jdk\jre\lib\ext\zipfs.jar;
        D:\java\jdk\jre\lib\javaws.jar;
        D:\java\jdk\jre\lib\jce.jar;
        D:\java\jdk\jre\lib\jfr.jar;
        D:\java\jdk\jre\lib\jfxswt.jar;
        D:\java\jdk\jre\lib\jsse.jar;
        D:\java\jdk\jre\lib\management-agent.jar;
        D:\java\jdk\jre\lib\plugin.jar;
        D:\java\jdk\jre\lib\resources.jar;
        D:\java\jdk\jre\lib\rt.jar;
        D:\Java workspace\annotationLearn\out\production\annotationLearn;
        D:\IntelliJ IDEA\IntelliJ IDEA 2020.1.2\lib\idea_rt.jar
         */
    }
}
```

**结果：**

<img src=".\Java注解和反射\8.png" alt="image-20210309170136369" style="zoom:80%;" />





**Q：** 什么是双亲委派机制？有什么作用？

双亲委派机制是：当某个类加载器需要加载某个`.class`文件时，它首先会把这个任务委托给它的上级类加载器，递归这个操作，如果上级的类加载器没有加载，该类加载器才会去加载这个类

双亲委派机制作用：

1. 防止重复加载同一个`.class`

2. 保证核心`.class`不会被纂改，即使被纂改也不会去加载，这样就保证了`.class`的执行安全

比如若用户定义一个`java.lang.String`类，执行的话，该自定义的类是不会被执行的





**Q：** 什么时候会发生类初始化？

类的主动引用时，一定会发生类的初始化；而被动引用的话，可能会发生

主动引用有：

- 当JVM启动时，会先初始化main()方法所在的类
- new一个类的对象

- 调用类的静态成员（除了final常量）和静态方法

- 使用java.lang.reflect包的方法对类进行反射调用

- 当初始化一个类的时候，如果发现其父类还没有进行初始化，则需要先初始化父类

被动引用有：

- 当访问一个静态域时，只有真正声明这个域的类才会被初始化，若是通过子类引用父类的静态变量，不会导致子类的初始化

- 通过数组定义类引用，不会触发此类的初始化

- 引用常量不会触发此类的初始化（常量在链接阶段就存入调用类的常量池中了）



**例子：**

```java
public class ClassLoadLearn2 {

    static {
        System.out.println("Main类被加载");
    }

    public static void main(String[] args) throws ClassNotFoundException {
        //1. 主动引用
//        Son son=new Son();

        //2. 反射也会产生主动引用
//        Class.forName("com.my.reflection.Son");

        //3. 调用父类的静态变量或静态方法，不会产生子类的初始化
//        System.out.println(Son.b);

        //4. 通过数组定义类引用，不会触发此类的初始化
//        Son[] array=new Son[5];

        //5. 常量不会引起父类和子类的初始化
//        System.out.println(Son.M);
    }
}

class Father{

    static int b=2;

    static {
        System.out.println("父类被加载");
    }
}

class Son extends Father{

    static int m=100;
    static final int M=1;

    static {
        System.out.println("子类被加载");
        m=300;
    }
}
```

结果1与结果2：

<img src=".\Java注解和反射\3.png" alt="image-20210308195031768" style="zoom:80%;" />

结果3：

<img src=".\Java注解和反射\4.png" alt="image-20210308195108793" style="zoom:80%;" />

结果4：

<img src=".\Java注解和反射\5.png" alt="image-20210308195141422" style="zoom:80%;" />

结果5：

<img src=".\Java注解和反射\6.png" alt="image-20210308195208383" style="zoom:80%;" />





此外，类加载器还是有缓存的

**类缓存：** 标准的JavaSE类加载器可以按要求查找类，但一旦某个类被加载到类加载器中，它将维持加载（缓存）一段时间。当然JVM垃圾回收机制可以回收这些Class对象






## Class类

每个对象，通过反射获得一个Class类型的对象，通过这个Class对象可以获得该类中的信息

- Class本身也是一个类

- Class对象只能由系统建立

- 一个加载的类在JVM中只会有一个Class实例

- 一个Class对象对应的是一个加载在JVM中的一个`.class`文件

- 每个类的实例都会记得自己是由哪个Class实例所生成的

- 通过Class可以完整地得到一个类中的所有被加载的结构

- Class类是Reflection的根源，针对任何你想动态加载、运行的类，唯有先获得相应的Class对象 

  

**那哪些类型可以有Class对象呢？** 

有：class（所有类）、interface（接口）、[]（数组）、enum（枚举）、annotation（注解）、primitive type（基本数据类型）、void

```java
public class ReflectionLearn {
    public static void main(String[] args) {
        Class c1=Object.class;   //类
        Class c2=Runnable.class;    //接口
        Class c3=String[].class;    //数组
        Class c4=int[][].class;     //二维数组
        Class c5=Override.class;    //注解
        Class c6= ElementType.class;      //枚举
        Class c7=Integer.class;    //基本类型
        Class c8=void.class;      //void
        Class c9=Class.class;    //Class本身

        System.out.println(c1);
        System.out.println(c2);
        System.out.println(c3);
        System.out.println(c4);
        System.out.println(c5);
        System.out.println(c6);
        System.out.println(c7);
        System.out.println(c8);
        System.out.println(c9);
    }
}
```

结果：

<img src=".\Java注解和反射\2.png" alt="image-20210306112343153" style="zoom:80%;" />





### 获取Class类实例

先假设有个`User`类，并且此类位于`com.my.reflection`包下

1. 已知具体的类，通过类的class属性获取，此方法最为安全可靠，程序性能最高

   ```java
   Class userClass=User.class;
   ```

2. 已知某个类的实例，调用该实例的getClass()方法获取

   ```java
   User user=new User();
   Class userClass=user.getClass();
   ```

3. 已知一个类的全类名（包名+类名），则可通过Class类的静态方法forName()获取，然后这方法可能会抛出ClassNotFoundException

   ```java
   Class userClass=Class.forName("com.my.reflection.User");
   ```

4. Java内置的基本数据类型可以直接用`类目.Type`获取

   ```java
   Class integerClass=Integer.TYPE;
   ```

5. 利用ClassLoader



### 常用方法

Class类的常用方法：

| 方法名                                    | 功能说明                                                    |
| ----------------------------------------- | ----------------------------------------------------------- |
| static Class<T> ClassforName(String name) | 返回指定类名name的Class对象                                 |
| Object newInstance()                      | 调用缺省构造参数，返回Class对象的一个实例                   |
| String getName()                          | 返回此Class对象所表示的实体（类、接口、数组类或void）的名称 |
| ……                                        | ……                                                          |

太多了，具体可去 [Java文档中的java.lang.Class](https://docs.oracle.com/javase/8/docs/api/) 看看



**例子：**

```java
package com.my.reflection;

public class User {

    private int id;
    private String name;
    private int age;
    public String school;
    protected String phone;

    public User() {
    }

    public User(int id, String name, int age, String school, String phone) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.school = school;
        this.phone = phone;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getSchool() {
        return school;
    }

    public void setSchool(String school) {
        this.school = school;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    private void addUser(){
    }
}
```



```java
package com.my.reflection;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class ClassLearn {

    public static void main(String[] args) throws ClassNotFoundException, NoSuchFieldException, NoSuchMethodException {
        //获取User类
        Class userClass=Class.forName("com.my.reflection.User");

        System.out.println(userClass.getName());   //获取类的名字   包名+类名
        System.out.println(userClass.getSimpleName());     //获取类的名字   类名

        //获得类的属性,但只能找到public属性
        Field[] fields = userClass.getFields();
        System.out.println("fields:");
        for (Field field : fields) {
            System.out.println(field);
        }

        //获得类的属性,并且可以找到全部的属性,包括private
        Field[] declaredFields = userClass.getDeclaredFields();
        System.out.println("declaredFields:");
        for (Field declaredField : declaredFields) {
            System.out.println(declaredField);
        }

        //获得类的指定属性,但只能是public属性
//        Field name = userClass.getField("name");
//        System.out.println("nameField: "+name);

        //获得类的指定属性,包括private
        Field name = userClass.getDeclaredField("name");
        System.out.println("nameField: "+name);

        //获得类的方法，其中包括本类及其父类的全部public方法
        Method[] methods = userClass.getMethods();
        System.out.println("methods:");
        for (Method method : methods) {
            System.out.println(method);
        }

        //获得类的方法，不过只是获得本类的所有方法，包括private的
        Method[] declaredMethods = userClass.getDeclaredMethods();
        System.out.println("declaredMethods:");
        for (Method declaredMethod : declaredMethods) {
            System.out.println(declaredMethod);
        }

        //获得类指定的方法,第二个参数是指定方法的参数的类
        //第二个参数是用来辨别关于重载的方法的
        Method getName = userClass.getMethod("getName", null);
        Method setName = userClass.getMethod("setName", String.class);
        System.out.println();
        System.out.println(getName);
        System.out.println(setName);

        //获得类的全部public的构造方法
        Constructor[] constructors = userClass.getConstructors();
        System.out.printf("\nconstructors:\n");
        for (Constructor constructor : constructors) {
            System.out.println(constructor);
        }

        //获得类的全部构造方法,包括private
        Constructor[] declaredConstructors = userClass.getDeclaredConstructors();
        System.out.printf("\ndeclaredConstructors:\n");
        for (Constructor declaredConstructor : declaredConstructors) {
            System.out.println(declaredConstructor);
        }

        //获得类的指定的构造方法，参数的指定构造方法参数的类
        Constructor declaredConstructor = userClass.getDeclaredConstructor(int.class, String.class, int.class, String.class, String.class);
        System.out.println();
        System.out.println(declaredConstructor);
    }
}
```

**结果：**

```java
com.my.reflection.User
User
fields:
public java.lang.String com.my.reflection.User.school
    
declaredFields:
private int com.my.reflection.User.id
private java.lang.String com.my.reflection.User.name
private int com.my.reflection.User.age
public java.lang.String com.my.reflection.User.school
protected java.lang.String com.my.reflection.User.phone
    
nameField: private java.lang.String com.my.reflection.User.name
    
methods:
public java.lang.String com.my.reflection.User.getName()
public int com.my.reflection.User.getId()
public void com.my.reflection.User.setName(java.lang.String)
public void com.my.reflection.User.setPhone(java.lang.String)
public void com.my.reflection.User.setSchool(java.lang.String)
public void com.my.reflection.User.setAge(int)
public java.lang.String com.my.reflection.User.getSchool()
public java.lang.String com.my.reflection.User.getPhone()
public int com.my.reflection.User.getAge()
public void com.my.reflection.User.setId(int)
public final void java.lang.Object.wait() throws java.lang.InterruptedException
public final void java.lang.Object.wait(long,int) throws java.lang.InterruptedException
public final native void java.lang.Object.wait(long) throws java.lang.InterruptedException
public boolean java.lang.Object.equals(java.lang.Object)
public java.lang.String java.lang.Object.toString()
public native int java.lang.Object.hashCode()
public final native java.lang.Class java.lang.Object.getClass()
public final native void java.lang.Object.notify()
public final native void java.lang.Object.notifyAll()
   
declaredMethods:
public java.lang.String com.my.reflection.User.getName()
public int com.my.reflection.User.getId()
public void com.my.reflection.User.setName(java.lang.String)
public void com.my.reflection.User.setPhone(java.lang.String)
public void com.my.reflection.User.setSchool(java.lang.String)
public void com.my.reflection.User.setAge(int)
public java.lang.String com.my.reflection.User.getSchool()
public java.lang.String com.my.reflection.User.getPhone()
private void com.my.reflection.User.addUser()
public int com.my.reflection.User.getAge()
public void com.my.reflection.User.setId(int)

public java.lang.String com.my.reflection.User.getName()
public void com.my.reflection.User.setName(java.lang.String)

constructors:
public com.my.reflection.User()
public com.my.reflection.User(int,java.lang.String,int,java.lang.String,java.lang.String)

declaredConstructors:
public com.my.reflection.User()
public com.my.reflection.User(int,java.lang.String,int,java.lang.String,java.lang.String)

public com.my.reflection.User(int,java.lang.String,int,java.lang.String,java.lang.String)

Process finished with exit code 0

```

**例子二：**

```java
package com.my.reflection;

//通过反射，动态地创建对象
public class ClassLearn2 {

    public static void main(String[] args) throws ClassNotFoundException, IllegalAccessException, InstantiationException, NoSuchMethodException, InvocationTargetException, NoSuchFieldException {
        //获取User类
        Class userClass=Class.forName("com.my.reflection.User");

        // 通过User类新建对象，然后强转
        // 此方法默认调用类的无参构造方法，若无无参构造方法，会报错，当然如果访问权限不够的话，也会报错
        User user=(User)userClass.newInstance();
        System.out.println(user);

        //通过构造器创建对象
        Constructor declaredConstructor = userClass.getDeclaredConstructor(int.class, String.class, int.class, String.class, String.class);
        User user2 = (User)declaredConstructor.newInstance(1, "Tony", 20, "Beijing University", "1234566778");
        System.out.println(user2);

        //通过反射调用普通方法
        User user3=(User)userClass.newInstance();
        //先获取方法
        Method setName=userClass.getDeclaredMethod("setName", String.class);
        //激活（调用方法），参数一：调用方法的对象，参数二：调用方法所需要的参数
        setName.invoke(user3, "John");
        System.out.println(user3);

        //通过反射操作属性
        User user4=(User)userClass.newInstance();
        Field name = userClass.getDeclaredField("name");
        //没有的话会报无法访问private属性的错误
        //所以说，不能直接操作私有属性，需要关闭程序的安全检查，或者通过属性的getter/setter方法
        name.setAccessible(true);
        //设置属性，参数一：调用方法的对象，参数二：属性值
        name.set(user4,"Wakie");
        System.out.println(user4);


    }
}
```

**结果：**

<img src=".\Java注解和反射\9.png" alt="image-20210309204426904" style="zoom:80%;" />



**关于setAccessible(boolean flag)方法：**

- Method、Field、Constructor对象都有setAccessible()方法

- 其作用是启动和禁用访问安全检查的开关

- 参数flag为true：表示反射的对象在使用时取消Java语言的访问检查；反之则不取消

- flag为true有助于提高反射的效率



**例子三：**

```java
package com.my.reflection;

//性能测试
public class ClassLearn3 {

    //普通方法调用
    public static void test(){
        User user=new User();
        long startTime = System.currentTimeMillis();
        for (int i = 0; i < 1000000000; i++) {
            user.getName();
        }
        long endTime=System.currentTimeMillis();
        System.out.println("普通方法调用方式: "+(endTime-startTime)+"ms");
    }

    //反射方式调用
    public static void test2() throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
        User user=new User();
        Class userClass=user.getClass();
        Method getName = userClass.getMethod("getName", null);
        long startTime = System.currentTimeMillis();
        for (int i = 0; i < 1000000000; i++) {
            getName.invoke(user,null);
        }
        long endTime=System.currentTimeMillis();
        System.out.println("反射方式调用: "+(endTime-startTime)+"ms");
    }

    //反射方式调用，关闭安全检查
    public static void test3() throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
        User user=new User();
        Class userClass=user.getClass();
        Method getName = userClass.getMethod("getName", null);
        getName.setAccessible(true);
        long startTime = System.currentTimeMillis();
        for (int i = 0; i < 1000000000; i++) {
            getName.invoke(user,null);
        }
        long endTime=System.currentTimeMillis();
        System.out.println("反射方式调用，并且关闭安全检查: "+(endTime-startTime)+"ms");
    }

    public static void main(String[] args) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException {
        test();
        test2();
        test3();
    }
}
```

**结果：**

<img src=".\Java注解和反射\10.png" alt="image-20210309211044017" style="zoom:80%;" />



### 反射操作泛型

Java采用泛型擦除的机制来引入泛型，Java中的泛型仅仅是给编译器Javac使用的，通过泛型确保数据的安全性和免去强制类型的转换问题，但是，一旦编译完成，所有和泛型有关的类型都会全部擦除掉

为了通过反射操作这些类型，Java新增了`ParameterizedType`，`GenericArrayType`，`TypeVariable`和`WildcardType`几种类型来代表不能被归一到Class类中的类型，但是又和原始类型齐名的类型

- **ParameterizedType：** 表示一种参数化类型，

- **GenericArrayType：** 表示一种元素类型是参数化类型或者类型变量的数组类型

- **TypeVariable：** 是各自类型变量的公共父接口

- **WildcardType：** 代表一种通配符类型表达式



**例子：**

```java
package com.my.reflection;

//通过反射获取泛型
public class ClassLearn4 {

    public void test01(Map<String,User> map, List<User> list){
        System.out.println("test01");
    }

    public Map<String,User> test02(){
        System.out.println("test02");
        return null;
    }

    public static void main(String[] args) throws NoSuchMethodException {
        //获取方法的参数类型
        Method test01 = ClassLearn4.class.getMethod("test01", Map.class, List.class);
        System.out.printf(test01+"\n\n");
        Type[] genericParameterTypes = test01.getGenericParameterTypes();
        System.out.printf("方法参数：\n");
        for (Type genericParameterType : genericParameterTypes) {
            System.out.println("总的方法参数： "+genericParameterType);
            
            System.out.println("具体的方法参数：");
            if(genericParameterType instanceof ParameterizedType){
                Type[] actualTypeArguments = ((ParameterizedType) genericParameterType).getActualTypeArguments();
                for (Type actualTypeArgument : actualTypeArguments) {
                    System.out.println(actualTypeArgument);
                }
                System.out.println();
            }
        }

        //获取方法的返回值类型
        Method test02 = ClassLearn4.class.getMethod("test02", null);
        Type genericReturnType = test02.getGenericReturnType();
        System.out.println("总的返回值类型: "+genericReturnType);
        
        if(genericReturnType instanceof ParameterizedType){
            Type[] actualTypeArguments = ((ParameterizedType) genericReturnType).getActualTypeArguments();
            System.out.printf("\n具体的返回值类型：\n");
            for (Type actualTypeArgument : actualTypeArguments) {
                System.out.println(actualTypeArgument);
            }
        }
    }
}
```

**结果：** 

<img src=".\Java注解和反射\11.png" alt="image-20210310111709184" style="zoom:80%;" />



### 反射操作注解

**例子：**

```java
package com.my.reflection;

//通过反射获取注解
public class ClassLearn5 {

    public static void main(String[] args) throws ClassNotFoundException, NoSuchFieldException {
        Class studentClass = Class.forName("com.my.reflection.Student");

        //通过反射获取注解,但这样只能获取到Class外面的注解
        Annotation[] annotations = studentClass.getAnnotations();
        System.out.println("获取注解：");
        for (Annotation annotation : annotations) {
            System.out.println(annotation);
        }

        //获取注解的value的值
        //先获取特定的注解
        TableLearn tableLearnAnnotation = (TableLearn) studentClass.getAnnotation(TableLearn.class);
        //获取特定注解的value
        System.out.println(tableLearnAnnotation.value());


        //获取类的变量的注解
        Field name = studentClass.getDeclaredField("name");
        ColLearn nameAnnotation = name.getAnnotation(ColLearn.class);
        System.out.printf("\n获取类的变量的注解:\n");
        System.out.println(nameAnnotation);
        System.out.println(nameAnnotation.type());
        System.out.println(nameAnnotation.columnName());
        System.out.println(nameAnnotation.length());
    }

}

@TableLearn("student")
class Student{
    @ColLearn(columnName = "id",type = "int",length = 11)
    private int id;
    @ColLearn(columnName = "age",type = "int",length = 5)
    private int age;
    @ColLearn(columnName = "name",type = "varchar",length = 3)
    private String name;

    public Student() {
    }

    public Student(int id, int age, String name) {
        this.id = id;
        this.age = age;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", age=" + age +
                ", name='" + name + '\'' +
                '}';
    }
}


//表注解，值为表名
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface TableLearn{
    String value();    //表名
}


//列注解
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@interface ColLearn{
    String columnName();   //列名
    String type();    //列的类型
    int length();    //列的长度
}
```

**结果：**

<img src=".\Java注解和反射\12.png" alt="image-20210310114713672" style="zoom:80%;" />