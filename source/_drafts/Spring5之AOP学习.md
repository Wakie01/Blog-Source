---
title: Spring5之AOP学习
comment: true
date: 2021-05-18 21:04:25
tags:
categories:
addrlink:
---





在了解Spring5的AOP特性之前，首先得要了解一种设计模式：代理模式

# 代理模式

**定义：** 代理模式是给某一个对象提供一个代理对象，并由代理对象控制对原对象的引用。代理模式是一种结构型设计模式。

其实就是中介

我们在平时开发的过程中，常见的就是纵向开发：

`前端`->`Controller`->`Service`->`Dao`->`Service`->`Controller`->`前端`

然而，在很多时候，我们需要在某个方法执行的过程中，加入一些公共服务，比如缓存、日志等等，而这，其实就是将方法的执行切面化。这个切面化的开发就是横向开发



代理的好处：

- 保护目标对象
- 增强目标对象



其中代理又分为静态代理跟动态代理



## 静态代理

静态代理，其实就是程序员手动对目标对象进行编码代理。

**例子1：**

1. 租房服务接口

   ```java
   //租房服务
   public interface Rent {
       void rent();
   }
   ```

2. 房东实现租房服务接口

   ```java
   //房东
   public class Landlord implements Rent{
       public void rent() {
           System.out.println("房东出租房子");
       }
   }
   ```

3. 中介代理

   ```java
   //中介
   public class Proxy implements Rent{
   
       //中介代理的房东
       private Landlord landlord;
   
       public Proxy() {
       }
   
       public Proxy(Landlord landlord) {
           this.landlord = landlord;
       }
   
       public void setLandlord(Landlord landlord) {
           this.landlord = landlord;
       }
   
       public void rent() {
           charge();
           System.out.println("中介代理租房");
           landlord.rent();
       }
   
       private void charge(){
           System.out.println("中介收中介费");
       }
   }
   ```

4. 客户租房

   ```java
   public class Client {
       public static void main(String[] args) {
           Landlord landlord=new Landlord();
           Proxy proxy=new Proxy(landlord);
           System.out.println("客户找中介租房");
           proxy.rent();
       }
   }
   ```

   结果：

<img src="D:\blog\source\_drafts\Spring5之AOP学习\1.png" alt="image-20210519155353424" style="zoom:80%;" />



**例子2：** 

1. 用户服务接口

   ```java
   public interface UserService {
       void add();
       void delete();
       void update();
       void query();
   }
   ```

2. 实现用户服务接口

   ```java
   public class UserServiceImpl implements UserService{
   
       public void add() {
           System.out.println("增加了用户信息");
       }
   
       public void delete() {
           System.out.println("删除了用户信息");
       }
   
       public void update() {
           System.out.println("修改了用户信息");
       }
   
       public void query() {
           System.out.println("查询用户信息");
       }
   }
   ```

3. 实现代理

   ```java
   public class UserServiceProxy implements UserService{
   
       private UserService userService;
   
       public void setUserService(UserService userService) {
           this.userService = userService;
       }
   
       public void add() {
           log("add");
           userService.add();
       }
   
       public void delete() {
           log("delete");
           userService.delete();
       }
   
       public void update() {
           log("update");
           userService.update();
       }
   
       public void query() {
           log("query");
           userService.query();
       }
   
       public void log(String method){
           System.out.println("[Debug] 运行了 "+method+" 方法");
       }
   }
   ```

4. 测试

   ```java
   public class DemoTest {
       @Test
       public void test(){
           UserServiceProxy userServiceProxy=new UserServiceProxy();
           UserService userService=new UserServiceImpl();
           userServiceProxy.setUserService(userService);
           userServiceProxy.add();
           userServiceProxy.delete();
           userServiceProxy.update();
           userServiceProxy.query();
       }
   }
   ```

   结果：

<img src="D:\blog\source\_drafts\Spring5之AOP学习\2.png" alt="image-20210519155848703" style="zoom:80%;" />



- **优点：** 
- 实现代理
  
- **缺点：** 

  - 需要为每个接口创建代理类

  - 工作量太大，不易管理

  - 同时接口一旦发生改变，代理类也得相应修改



## 动态代理

动态代理就是在静态代理的基础上，对其改进，减少工作量。

怎么改进？动态代理是在程序运行期间由JVM根据反射等机制来动态生成代理。

所以，动态代理的代理类是动态生成的，不是程序员自己写好的



常见的动态代理方式分为两大类：基于接口的动态代理，基于类的动态代理

- JDK原生动态代理      ------     基于接口（只作用于接口）
- CGLIB动态代理     -------  基于类
- Javasist    -------  java字节码实现



### JDK原生动态代理

它需要两个类：

- `Proxy` ：它用来创建动态代理类
- `InvocationHandler` ：



**例子一：**

租房接口

```java
package com.my.demo03;

//租房服务
public interface Rent {

    void rent();
}
```

房东实现租房接口：

```java
package com.my.demo03;

//房东
public class Landlord implements Rent {

    public void rent() {
        System.out.println("房东出租房子");
    }
}
```

代理：

```java
package com.my.demo03;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

//使用这个类来自动生成代理类
public class ProxyInvocationHandler implements InvocationHandler {

    //被代理的接口
    private Rent rent;

    public void setRent(Rent rent) {
        this.rent = rent;
    }

    //生成得到代理类
    public Object getProxy(){
        return Proxy.newProxyInstance(this.getClass().getClassLoader(),rent.getClass().getInterfaces(),this);
    }

    /**
     * 处理代理实例，并返回结果
     * @param proxy 真实代理对象
     * @param method 真实代理对象的某个方法
     * @param args 被代理方法执行时所需要的参数
     * @return 被代理方法的执行结果
     * @throws Throwable
     */
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        seeHouse();
        //动态代理的就是使用反射机制来实现的
        Object result = method.invoke(rent, args);
        agencyFee();
        return result;
    }

    public void seeHouse(){
        System.out.println("中介带看房子");
    }

    public void agencyFee(){
        System.out.println("中介收中介费");
    }
}
```

顾客租房：

```java
package com.my.demo03;

public class Client {

    public static void main(String[] args) {
        //房东，真实角色
        Landlord landlord=new Landlord();
        //中介，代理角色
        ProxyInvocationHandler pih = new ProxyInvocationHandler();
        //通过调用程序处理角色来处理我们要调用的接口对象
        pih.setRent(landlord);
        //动态生成代理
        Rent proxy = (Rent) pih.getProxy();
        proxy.rent();

    }
}
```



**范例化：**

Service接口：

```java
package com.my.demo04;

public interface UserService {

    void add();

    void delete();

    void update();

    void query();
}
```

Service接口实体类：

```java
package com.my.demo04;

public class UserServiceImpl implements UserService {

    public void add() {
        System.out.println("增加了用户信息");
    }

    public void delete() {
        System.out.println("删除了用户信息");
    }

    public void update() {
        System.out.println("修改了用户信息");
    }

    public void query() {
        System.out.println("查询用户信息");
    }
}
```

动态代理工具类：

```java
package com.my.demo04;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class ProxyInvocationHandler implements InvocationHandler {

    //被代理的接口
    private Object target;

    public void setTarget(Object target) {
        this.target = target;
    }

    //生成得到代理类
    public Object getProxy(){
        return Proxy.newProxyInstance(this.getClass().getClassLoader(),
                target.getClass().getInterfaces(),this);
    }

     /**
     * 处理代理实例，并返回结果
     * @param proxy 真实代理对象
     * @param method 真实代理对象的某个方法
     * @param args 被代理方法执行时所需要的参数
     * @return 被代理方法的执行结果
     * @throws Throwable
     */
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("[Debug] 执行了 "+method.getName()+" 方法");
        Object result = method.invoke(target, args);
        return result;
    }
}
```

调用类：

```java
package com.my.demo04;

public class Main {

    public static void main(String[] args) {
        ProxyInvocationHandler pih=new ProxyInvocationHandler();
        UserService userService=new UserServiceImpl();
        pih.setTarget(userService);
        UserService userServiceProxy= (UserService) pih.getProxy();
        userServiceProxy.add();
        userServiceProxy.delete();
        userServiceProxy.update();
        userServiceProxy.query();
    }
}
```

运行结果：

<img src="D:\blog\source\_drafts\Spring5之AOP学习\3.png" alt="image-20210713164705742" style="zoom:80%;" />





# AOP

AOP，Aspect Oriented Programming，面向切面编程

它是通过预编译方式和运行期动态代理实现程序功能的统一维护的一种技术。

AOP是OOP（Object Oriented Programming，面向对象编程）的延续

通过AOP可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，提高开发效率。



## AOP在Spring中的作用

Spring AOP 提供声明式事务，允许用户自定义切面

- **横切关注点：** 跨越应用程序多个模块的方法或功能，如：日志、安全、缓存、事务等等……

- **切面（Aspect）：** 横切关注点 被模块化 的特殊对象。即，它是一个类
- **通知（Advice）：** 切面要完成的功能。即，它是类中的一个方法。其中通知类型有：
  - **前置通知（Before Advice）：** 在某连接点（JoinPoint）之前执行的通知，但这个通知不能阻止连接点前的执行。接口：`MethodBeforeAdvice`，XML配置：`<aop:before>`，注解：`@Before`
  - **后置通知（After Advice）：** 当某连接点退出的时候执行的通知（不论是正常返回还是异常退出）。接口：`AfterAdvice`，XML配置：`<aop:after>`，注解：`@After`
  - **返回后通知（After Return Advice）：** 在某连接点正常完成后执行的通知，不包括抛出异常的情况。接口：`AfterReturningAdvice`，XML配置：`<aop:after-returning>`，注解：`@AfterReturning`
  - **环绕通知（Around Advice）：** 包围一个连接点的通知，可以在方法的调用前后完成自定义的行为，也可以选择不执行。XML配置：`<aop:around>`，注解：`@Around`
  - **异常通知（After Throwing Advice）：** 在方法抛出异常退出时执行的通知 。接口：`ThrowsAdvice`，XML配置：`<aop:after-throwing>`，注解：`@AfterThrowing`
- **目标（Target）：** 被通知的对象
- **代理（Proxy）：** 向目标对象应用通知之后创建的对象
- **切入点（PointCut）：** 切面通知 执行的“地点”
- **连接点（JoinPoint）： ** 与切入点匹配的执行点



<img src="D:\blog\source\_drafts\Spring5之AOP学习\6.png" alt="image-20210713200211049" style="zoom:80%;" />





使用Spring AOP需要导入`aspectjweaver`依赖

```xml
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
    <version>1.9.4</version>
</dependency>
```

**例子一：** 使用XML配置+Spring API接口

Service接口：

```java
package com.my.springAop.service;

public interface UserService {

    boolean add(String name);

    void delete();

    void update();

    void query();
}
```

实现Service接口：

```java
package com.my.springAop.service;

public class UserServiceImpl implements UserService {

    public boolean add(String name) {
        System.out.println("增加了 "+name+" 用户信息");
        return true;
    }

    public void delete() {
        System.out.println("删除了用户信息");
    }

    public void update() {
        System.out.println("修改了用户信息");
    }

    public void query() {
        System.out.println("查询用户信息");
    }
}
```

切面通知方法：

```java
package com.my.springAop.log;

import org.springframework.aop.MethodBeforeAdvice;

import java.lang.reflect.Method;

public class Log implements MethodBeforeAdvice {

    /**
     *
     * @param method 要执行的目标对象的方法
     * @param args 方法参数
     * @param target 目标对象
     * @throws Throwable
     */
    public void before(Method method, Object[] args, Object target) throws Throwable {
        System.out.println(target.getClass().getName()+" 的 "+method.getName()+" 方法被执行了");
    }
}
```

```java
package com.my.springAop.log;

import org.springframework.aop.AfterReturningAdvice;

import java.lang.reflect.Method;

public class AfterLog implements AfterReturningAdvice {

    /**
     *
     * @param returnValue 返回值
     * @param method 
     * @param args
     * @param target
     * @throws Throwable
     */
    public void afterReturning(Object returnValue, Method method, Object[] args, Object target) throws Throwable {
        System.out.println("执行了 "+method.getName()+" 方法，返回了 "+returnValue+" 结果");
    }
}
```

applicationContext.xml配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd http://www.springframework.org/schema/aop https://www.springframework.org/schema/aop/spring-aop.xsd">

    <!--注册bean-->
    <bean id="userService" class="com.my.springAop.service.UserServiceImpl" />
    <bean id="log" class="com.my.springAop.log.Log" />
    <bean id="afterLog" class="com.my.springAop.log.AfterLog" />

    <!--配置aop-->
    <aop:config>
        <!--切入点：
        expression：表达式,execution(要执行的位置! 修饰符 返回类型 全限定名 方法名 方法参数 异常类型)
        * ：匹配任何部分，但只能表示一个单词
        比如execution(* com.my.springAop.service.UserServiceImpl.*(..))
        表示：对com.my.springAop.service包下的UserServiceImpl类的所有方法进行切片，
        (..)表示方法里的任意参数-->
        <aop:pointcut id="pointcut" expression="execution(* com.my.springAop.service.UserServiceImpl.*(..))"/>

        <!--执行环绕增加-->
        <aop:advisor advice-ref="log" pointcut-ref="pointcut" />
        <aop:advisor advice-ref="afterLog" pointcut-ref="pointcut" />
    </aop:config>
</beans>
```

测试类：

```java
package com.my.springAop;

import com.my.springAop.service.UserService;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class MyTest {

    @Test
    public void test(){
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        //注意：动态代理，代理的是接口
        UserService userService = context.getBean("userService", UserService.class);
        userService.add("xiao ming");
    }
}
```

运行结果：

<img src="D:\blog\source\_drafts\Spring5之AOP学习\4.png" alt="image-20210713185657447" style="zoom:80%;" />





**例子二：** 不实现Spring AOP相关接口，使用XML标签配置切面方法

Service接口：

```java
package com.my.aop2.service;

public interface UserService {

    boolean add(String name);

    void delete();

    void update();

    void query();
}
```

Service接口实现类：

```java
package com.my.aop2.service.impl;

import com.my.aop2.service.UserService;

public class UserServiceImpl implements UserService {

    public boolean add(String name) {
        System.out.println("增加了 "+name+" 用户信息");
        return true;
    }

    public void delete() {
        System.out.println("删除了用户信息");
    }

    public void update() {
        System.out.println("修改了用户信息");
    }

    public void query() {
        System.out.println("查询用户信息");
    }
}
```

自定义切面类：

```java
package com.my.aop2.log;

import org.springframework.aop.MethodBeforeAdvice;

import java.lang.reflect.Method;

public class Log  {

    public void before() {
        System.out.println("---------方法执行前--------");
    }

    public void after(){
        System.out.println("---------方法执行后--------");
    }
}
```

ApplicationContext.xml配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
         http://www.springframework.org/schema/aop https://www.springframework.org/schema/aop/spring-aop.xsd">


    <bean id="log" class="com.my.aop2.log.Log" />
    <bean id="userService" class="com.my.aop2.service.impl.UserServiceImpl" />
    <!--配置aop-->
    <aop:config>
        <!--自定义切面，ref：要引用的类，即切面类-->
        <aop:aspect ref="log">
            <!--切入点-->
            <aop:pointcut id="pointCut" expression="execution(* com.my.aop2.service.impl.*.*(..))"/>
            <!--通知-->
            <aop:before method="before" pointcut-ref="pointCut" />
            <aop:after method="after" pointcut-ref="pointCut" />
        </aop:aspect>
    </aop:config>
</beans>
```

测试方法：

```java
package com.my;

import com.my.aop2.service.UserService;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.web.context.support.XmlWebApplicationContext;

public class SpringAop2Test {

    @Test
    public void myTest(){
        ApplicationContext context=new ClassPathXmlApplicationContext("applicationContext.xml");
        UserService userService = context.getBean("userService", UserService.class);
        userService.add("hello");
    }
}
```

执行结果：

<img src="D:\blog\source\_drafts\Spring5之AOP学习\5.png" alt="image-20210713195841506" style="zoom:80%;" />





**例子三：** 使用注解

Service接口：

```java
package com.my.aop3.service;

public interface UserService {

    boolean add(String name);

    void delete();

    void update();

    void query();
}
```

Service接口实现类：

```java
package com.my.aop3.service.impl;

import com.my.aop3.service.UserService;

public class UserServiceImpl implements UserService {

    public boolean add(String name) {
        System.out.println("增加了 "+name+" 用户信息");
        return true;
    }

    public void delete() {
        System.out.println("删除了用户信息");
    }

    public void update() {
        System.out.println("修改了用户信息");
    }

    public void query() {
        System.out.println("查询用户信息");
    }
}
```

切面类：

```java
package com.my.aop3.log;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;

//声明这是一个切面Bean
@Aspect
public class Log  {
	
    //切点
    @Pointcut("execution(* com.my.aop3.service.impl.*.*(..))")
    public void aspect(){}

    @Before("aspect()")
    public void before(JoinPoint joinPoint) {
        System.out.println("[ "+joinPoint.getSignature().getName() +" 方法执行前 ] ");
    }

    @AfterReturning(value = "aspect()",returning = "result")
    public void after(JoinPoint joinPoint,Object result){
        System.out.println("[ "+joinPoint.getSignature().getName() +" 方法执行后 ]  返回结果： "+result);
    }
}
```

ApplicationContext.xml配置：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
         http://www.springframework.org/schema/aop https://www.springframework.org/schema/aop/spring-aop.xsd ">

    <bean id="userService" class="com.my.aop3.service.impl.UserServiceImpl" />
    <bean id="log" class="com.my.aop3.log.Log" />

    <!--开启Spring AOP的注解支持-->
    <aop:aspectj-autoproxy />
</beans>
```

测试类：

```java
package com.my;

import com.my.aop3.service.UserService;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class MyTest {

    @Test
    public void myTest(){
        ApplicationContext applicationContext=new ClassPathXmlApplicationContext("applicationContext.xml");
        UserService userService = applicationContext.getBean("userService", UserService.class);
        userService.add("hello");
    }
}
```

结果：

<img src="D:\blog\source\_drafts\Spring5之AOP学习\7.png" alt="image-20210713205659151" style="zoom:80%;" />



