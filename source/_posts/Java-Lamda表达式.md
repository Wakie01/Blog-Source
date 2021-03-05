---
title: Java Lamda表达式
tags: Java
categories: Java BackEnd
comment: true
addrlink: 1044
date: 2021-03-01 10:44:23
---




# Lamda表达式

是JDK1.8以后的内容，是用于简化`函数式接口（Function Interface）`的

> 函数式接口：如果在一个接口中，它只有一个抽象方法，那它就是一个函数式接口



**例子：**

无参的

```java
public class LamdaLearn {
    //2. 静态内部类
    static class Say2 implements ISay {
        public void sayHello() {
            System.out.println("hello 2");
        }
    }

    public static void main(String[] args) {
        ISay say;
        say=new Say1();
        say.sayHello();

        say=new Say2();
        say.sayHello();

        //3. 局部内部类
        class Say3 implements ISay {
            public void sayHello() {
                System.out.println("hello 3");
            }
        }
        say=new Say3();
        say.sayHello();

        //4.局部匿名类
        say=new ISay() {
            public void sayHello() {
                System.out.println("hello 4");
            }
        };
        say.sayHello();

        //5.Lamda表达式
        say= ()->{
            System.out.println("hello 5");
        };
        say.sayHello();

        //6.Lamda表达式 ,方法只有一行代码
        say=()->System.out.println("hello 6");
        say.sayHello();
    }
}

//1. 实现类
class Say1 implements ISay{
    public void sayHello() {
        System.out.println("hello 1");
    }
}

interface ISay{
    public void sayHello();
}
```

简化的过程：

实现类 --> 静态内部类 --> 局部内部类 --> 局部匿名类 -->  Lamda表达式



**例子二：**

有参数的

```java
public class LamdaLearn {
    //2. 静态内部类
    static class Say2 implements ISay {
        public void sayHello(int a,int b) {
            System.out.println("hello "+a+b);
        }
    }

    public static void main(String[] args) {
        ISay say;
        say=new Say1();
        say.sayHello(1,2);

        say=new Say2();
        say.sayHello(3,4);

        //3. 局部内部类
        class Say3 implements ISay {
            public void sayHello(int a,int b) {
                System.out.println("hello "+a+b);
            }
        }
        say=new Say3();
        say.sayHello(5,6);

        //4.局部匿名类
        say=new ISay() {
            public void sayHello(int a,int b) {
                System.out.println("hello "+a+b);
            }
        };
        say.sayHello(7,8);

        //5.Lamda表达式
        say= (int a,int b)->{
            System.out.println("hello "+a+b);
        };
        say.sayHello(9,10);

        //6.Lamda表达式 ,方法只有一行代码
        say=(int a,int b)->System.out.println("hello "+a+b);
        say.sayHello(11,12);

        //7.Lamda表达式 ,省去参数类型
        say=(a,b)->System.out.println("hello "+a+b);
        say.sayHello(13,14);
    }
}

//1. 实现类
class Say1 implements ISay{
    public void sayHello(int a,int b) {
        System.out.println("hello "+a+b);
    }
}

interface ISay{
    public void sayHello(int a,int b);
}
```

