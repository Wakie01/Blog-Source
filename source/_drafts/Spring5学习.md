---
title: Spring5学习
comment: true
date: 2021-05-07 17:31:21
tags:
categories:
addrlink:
---



# 简介

- Spring是一个开源的、免费的框架（容器）

- Spring是一个轻量级、非入侵式的框架
- 支持控制反转（IOC），面向切面编程（AOP）
- 支持事务的处理，对框架整合的支持

总结一句话，Spring是一个轻量级的控制反转（IOC）和面向切面编程（AOP）的框架



框架结构：



# IOC思想





# IOC创建对象方式

以`User`类为例子：

```java
public class User {

    private String name;

    public User() {
        System.out.println("User的无参构造");
    }

    public User(String name){
        this.name=name;
        System.out.println("User的有参构造");
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                '}';
    }
}

```

## 无参构造函数创建

在Spring中，默认通过无参构造函数来创建对象，在创建对象时，Spring会自动调用`User`的无参构造方法

- **xml配置：**

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <beans xmlns="http://www.springframework.org/schema/beans"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.springframework.org/schema/beans
          https://www.springframework.org/schema/beans/spring-beans.xsd">
      
      
  	<bean id="user" class="com.my.springIoc2.pojo.User">
          <property name="name" value="Kobe" />
      </bean>
      
  </beans>
  ```

  

## 有参构造函数创建

在Spring中，通过配置，也可以实现通过有参构造函数来创建对象

- **xml配置方法一：**

  下标赋值法，index表示参数位置，从0开始

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <beans xmlns="http://www.springframework.org/schema/beans"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.springframework.org/schema/beans
          https://www.springframework.org/schema/beans/spring-beans.xsd">
  	
      <bean id="xiaoHu" class="com.my.springIoc2.pojo.User">
          <constructor-arg index="0" value="XiaoHu" />
      </bean>
  
  </beans>
  ```

- **xml配置方法二：**

  直接对参数名赋值（最常用）

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <beans xmlns="http://www.springframework.org/schema/beans"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.springframework.org/schema/beans
                             https://www.springframework.org/schema/beans/spring-beans.xsd">
  	
      <bean id="tonya" class="com.my.springIoc2.pojo.User">
          <constructor-arg name="name" value="Tonya" />
      </bean>
      
  </beans>
  ```



## 获取对象

从Spring容器中获取对象，方法：

```java
@Test
public void userTest(){
    //先根据xml配置文件配置Spring容器，然后获取Spring容器上下文
    ApplicationContext context=new ClassPathXmlApplicationContext("beans.xml");
    //从Spring容器获取对象
    User user = (User) context.getBean("user");
    System.out.println(user);
    user = (User) context.getBean("xiaoHu");
    System.out.println(user);
    user = (User) context.getBean("tonya");
    System.out.println(user);

}
```



总结：在配置文件加载的时候，容器中管理的对象就已经初始化了



# Spring配置

## XML文件配置

Spring的常见配置有：

- `bean` ：相当于对象

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <beans xmlns="http://www.springframework.org/schema/beans"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.springframework.org/schema/beans
          https://www.springframework.org/schema/beans/spring-beans.xsd">
  
      <!--
          使用Spring来创建对象，在Spring中对象都称为Bean，
          这个创建对象的过程默认是通过对象的无参构造方法创建的
           id : bean的唯一标识符，相对于 变量名
           class : bean 对象所对应的全限定名 ：包名 + 类名
           name : 别名，不过 name 可以同时取多个别名
      -->
      <bean id="userBean" class="com.my.springIoc2.pojo.User" name="user2,u2">
          <!--
              property : 给对象中的属性注入值，这个注入值的过程是通过setter方法实现的
              ref : 引用Spring容器中创建好的bean
              value : 赋予一个具体的、基本数据类型的值
          -->
          <property name="name" value="User Bean" />
      </bean>
      
      <bean id="username" class="java.lang.String">
          <constructor-arg name="value" value="User Bean 2" />
      </bean>
  
      <bean id="userBean2" class="com.my.springIoc2.pojo.User" name="user2,u2">
          <!-- ref : 引用Spring容器中创建好的bean -->
          <property name="name" ref="username" />
      </bean>
  
  </beans>
  ```

- `alias` ：别名，对`bean`对象创建一个别名，然后我们也可以使用别名来获取这个对象

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <beans xmlns="http://www.springframework.org/schema/beans"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.springframework.org/schema/beans
          https://www.springframework.org/schema/beans/spring-beans.xsd">
  
      <bean id="tonya" class="com.my.springIoc2.pojo.User">
          <constructor-arg name="name" value="Tonya" />
      </bean>
  
      <alias name="tonya" alias="helloTonya" />
  
  </beans>
  ```

- `import` ：一般用于团队开发，将多个配置文件导入合并为一个



## 注解配置





# 依赖注入

## 构造器注入







## Set方式注入



## 其他方式注入



## bean的作用域

bean的作用域有6种：`singleton`、`prototype`、`request`、`session`、`application`、`websocket`



### singleton

单例模式（Spring默认），即Spring容器中只创建一个bean对象实例

![singleton](D:\blog\source\_drafts\Spring5学习\2.png)

并且这个bean对象是与spring容器一起共存亡的：Spring容器在创建时，该bean对象也会随着创建，并由Spring容器管理，然后该bean对象会随着Spring容器的die而die

例子：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <bean id="user" class="com.my.springIoc2.pojo.User" scope="singleton">
        <property name="name" value="Kobe" />
    </bean>

</beans>
```

```java
@Test
public void userTest(){
    ApplicationContext context=new ClassPathXmlApplicationContext("beans.xml");
    User user1=context.getBean("user",User.class);
    User user2=context.getBean("user",User.class);
    System.out.println(user1.toString());
    user2.setName("superman");
    System.out.println(user1==user2);
    System.out.println(user1.toString());
    System.out.println(user2.toString());
    User user3=context.getBean("user",User.class);
    System.out.println(user3.toString());
}
```

输出：

<img src="D:\blog\source\_drafts\Spring5学习\1.png" alt="image-20210510195553602" style="zoom:80%;" />



### prototype

原型模式，即Spring容器会创建多个bean对象实例

在原型模型下，当Spring容器创建时，bean对象并不会被实例化，而是当用户请求获取bean对象实例时，Spring容器才会对该bean对象进行实例化，并对该bean对象实例进行管理。用户的每次请求bean对象实例，Spring容器都会实例化一个该bean对象。

![prototype](D:\blog\source\_drafts\Spring5学习\3.png)

例子：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <bean id="user" class="com.my.springIoc2.pojo.User" scope="prototype">
        <property name="name" value="Kobe" />
    </bean>

</beans>
```

```java
@Test
public void userTest(){
    ApplicationContext context=new ClassPathXmlApplicationContext("beans.xml");
    User user1=context.getBean("user",User.class);
    User user2=context.getBean("user",User.class);
    System.out.println(user1==user2);
    user2.setName("superman");
    System.out.println(user1.toString());
    System.out.println(user2.toString());
}
```

输出：

<img src="D:\blog\source\_drafts\Spring5学习\4.png" alt="image-20210510201038718" style="zoom:80%;" />



其余的request、session、application、websocket都需要在web环境下使用



# Bean的自动装配

bean的自动装配指：Spring会在上下文中自动寻找，并自动给bean装配属性

而类似这种装配方式：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <bean id="user" class="com.my.springIoc2.pojo.User" scope="prototype">
        <property name="name" value="Kobe" />
    </bean>

</beans>
```

叫手动装配，用户手动给bean配置属性



其实在Spring中有三种装配bean属性的方式：

1. 在xml中显式的装配（就是刚刚上面的那种）
2. 在java中显式的装配
3. 隐式的自动装配



## 使用注解







## 



