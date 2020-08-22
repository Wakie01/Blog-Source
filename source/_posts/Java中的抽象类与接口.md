---
title: Java中的抽象类与接口
comment: true
date: 2020-08-07 18:42:40
tags: Java
categories:
- 华为班
- Java
- BackEnd
addrlink: 1843
---




## 抽象类

抽象类是用来捕捉子类的通用特性的，它不能被实例化，只能被子类继承extend，抽象类相当于一个模板

抽象类里有抽象方法（没有内容），也可有普通正常的方法（有内容）

抽象类只能设置为`public`,抽象类中的抽象方法可设为`public`或`protected`,其它方法则没限制


**例子**

```java
//抽象类Animal
public abstract class Animal {
  	Animal() { System.out.println("I'm animal"); }
       
    public abstract void eat();

    public abstract void sleep();

    public void walk() { System.out.println("animal walking"); }

    public static void say() { System.out.println("animal saying"); }
         
}

//继承抽象类Animal
public class Person extends Animal {
    @Override
    public void eat() { System.out.println("person eating"); }

    @Override
    public void sleep() { System.out.println("person sleeping"); }
}

public class Main {
    public static void main(String[] args) {
        Animal.say();
        Person person=new Person();
        person.walk();
        person.eat();
        person.sleep();
    }
}

```

```terminal
## 结果
animal saying
I'm animal
animal walking
person eating
person sleeping
```

可能因为Java规定子类最多只能继承extend一个父类，所以出现 `接口` 这东西


## 接口

在Java中，类可以实现implement多个接口

接口中只有抽象方法，所以方法中的 `abstract` 一般会不写，

接口以及接口中的方法只能设为`public`

接口可以实例化

接口速度相对抽象类来说较慢，因为它需要时间去寻找在类中实现的方法


**例子**

```java
public interface Animal {
    void eat();    //默认public，也只能public
    void sleep();
}

public interface Student {
    void learn();
}

//实现两个接口
public class Person implements Animal,Student{
    @Override
    public void eat() { System.out.println("person eatting"); }

    @Override
    public void sleep() { System.out.println("person sleeping"); }

    @Override
    public void learn() { System.out.println("person learning"); }
}

public class Main {
    public static void main(String[] args) {
        Animal person=new Person();
        person.eat();
        person.sleep();
        //person.learn();       报错，因为 person是Animal的实例
    }
}

```



## 区别

|             |                 抽象类                 |                    接口                    |
| :---------: | :------------------------------------: | :----------------------------------------: |
|    方法     |     有抽象方法、普通方法、静态方法     |                只有抽象方法                |
|    实现     |  只能extend一个抽象类  |  可implement多个接口  |
| Constructor |                  可有                  |                   不能有                   |
| 访问修饰符  | 类：public；方法：public、protected |            类与方法：public            |
|  main方法   |                  可有                  |                   不能有                   |
|    速度     |                比接口快                | 较慢 |
| 添加新方法  | 若非添加抽象方法,可不用改变子类代码 |             需改变实现类的代码             |

<br/>

## 选择

- 若拥有一些方法，且想让他们默认实现，则使用抽象类

- 想继承多个，则使用接口

- 若基本功能不断改变，则使用抽象类


<br/>

参考：
1.[至尊宝博文](https://www.cnblogs.com/aspirant/p/7079670.html)

