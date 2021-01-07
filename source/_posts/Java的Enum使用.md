---
title: Java的Enum使用
comment: true
date: 2020-12-27 16:31:08
tags: Java
categories: BackEnd
addrlink: 1030
---


# 枚举

枚举类型有以下特性：

- 不可变
- 不相同


# 传统定义枚举

```java
public class DayDemo {

    public static final int MONDAY =1;

    public static final int TUESDAY=2;

    public static final int WEDNESDAY=3;

    public static final int THURSDAY=4;

    public static final int FRIDAY=5;

    public static final int SATURDAY=6;

    public static final int SUNDAY=7;

}
```

**问题**

不同的枚举变量可能会手误弄成相同，而且相同之后又不容易被发现


# Enum类

Enum类是Java 5的新增特性，

**例子**

```java
public enum Day {
    //枚举变量，一般用大写表示
    //枚举变量间用逗号隔开，最后才用分号
    //枚举变量也有类似构造函数之类的
    MONDAY(1,"星期一"),
    TUESDAY(2,"星期二"),
    WEDNESDAY(3,"星期三"),
    THURSDAY(4,"星期四"),
    FRIDAY(5,"星期五"),
    SATURDAY(6,"星期六"),    //有参数的构造函数
    SUNDAY,     //无参数的构造函数
    ;
    
    //描述 枚举变量 的 具体变量
    private int dayNum;    
    private String desc;   


    //枚举变量的构造函数，无参数
    Day(){

    }

    //枚举变量的构造函数，全参数
    Day(int dayNum,String desc){
        this.dayNum=dayNum;
        this.desc=desc;
    }

    //GET函数
    public String getDesc(){
        return desc;
    }

    public int getDayNum(){
        return dayNum;
    }
}

public class Main {

    public static void main(String[] args) {
        Day day=Day.MONDAY;
        System.out.println(day);     //输出MONDAY
        System.out.println(day.getDesc());     //输出星期一
    }
}
```

**注意：** 枚举变量的名字是不可以相同的，但枚举变量里的变量值又是可以相同的