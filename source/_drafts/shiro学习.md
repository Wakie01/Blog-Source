---
title: shiro学习
comment: true
date: 2021-05-06 21:02:44
tags:
categories:
addrlink:
---

# Shiro框架结构









# 与Spring boot结合

## thymeleaf例子

1. 创建Spring boot项目

2. 引入依赖

   ```xml
   <dependencies>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-web</artifactId>
       </dependency>
   
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-test</artifactId>
           <scope>test</scope>
       </dependency>
   
       <!-- shiro整合spring boot -->
       <dependency>
           <groupId>org.apache.shiro</groupId>
           <artifactId>shiro-spring-boot-web-starter</artifactId>
           <version>1.7.1</version>
       </dependency>
   
       <!-- thymeleaf  -->
       <dependency>
           <groupId>org.thymeleaf</groupId>
           <artifactId>thymeleaf-spring5</artifactId>
       </dependency>
   
       <dependency>
           <groupId>org.thymeleaf.extras</groupId>
           <artifactId>thymeleaf-extras-java8time</artifactId>
       </dependency>
   
       <dependency>
           <groupId>mysql</groupId>
           <artifactId>mysql-connector-java</artifactId>
       </dependency>
   
       <dependency>
           <groupId>log4j</groupId>
           <artifactId>log4j</artifactId>
           <version>1.2.17</version>
       </dependency>
   
       <!-- druid数据库连接池 -->
       <dependency>
           <groupId>com.alibaba</groupId>
           <artifactId>druid</artifactId>
           <version>1.1.18</version>
       </dependency>
   
       <!-- mybatis  -->
       <dependency>
           <groupId>org.mybatis.spring.boot</groupId>
           <artifactId>mybatis-spring-boot-starter</artifactId>
           <version>2.1.4</version>
       </dependency>
   
       <!-- lombok  -->
       <dependency>
           <groupId>org.projectlombok</groupId>
           <artifactId>lombok</artifactId>
       </dependency>
   </dependencies>
   ```

3. 配置`application.yml`

   ```yml
   spring:
     datasource:
       driver-class-name: com.mysql.cj.jdbc.Driver
       username: root
       password: wakie
       url: jdbc:mysql://localhost:3306/learn?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8
       type: com.alibaba.druid.pool.DruidDataSource
   
       # Spring boot 默认是不注入这些属性值的，需要自己绑定
       # druid 数据源专有配置
       initialSize: 5
       minIdle: 5
       maxActive: 20
       maxWait: 60000
       timeBetweenEvictionRunsMillis: 60000
       minEvictableIdleTimeMillis: 300000
       validationQuery: SELECT 1 FROM DUAL
       testWhileIdle: true
       testOnBorrow: false
       testOnReturn: false
       poolPreparedStatements: true
   
       #配置监控统计拦截的filters，stat:监控统计、log4j：日志记录、wall：防御sql注入
       #如果允许时报错  java.lang.ClassNotFoundException: org.apache.log4j.Priority
       #则导入 log4j 依赖即可
       filters: stat,wall,log4j
       maxPoolPreparedStatementPerConnectionSize: 20
       useGlobalDataSourceStat: true
       connectionProperties: druid.stat.mergeSql=true;druid.stat.slowSqlMillis=500
   
   
   
   # mybatis配置
   mybatis:
     type-aliases-package: com.my.springbootshiro.polo
     mapper-locations: classpath:mapper/*.xml
   
   ```

4. **自定义Realm类**

   ```java
   package com.my.springbootshiro.config;
   
   //自定义的Realm，需要继承AuthorizingRealm
   public class UserRealm extends AuthorizingRealm {
   
       @Autowired
       private UserService userService;
   
       //授权
       @Override
       protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
           System.out.println("执行了=>授权doGetAuthorizationInfo");
   
           SimpleAuthorizationInfo authorizationInfo=new SimpleAuthorizationInfo();
   
           //拿到当前登录的对象
           Subject subject=SecurityUtils.getSubject();
           //对应认证时的SimpleAuthenticationInfo
           User currentUser= (User) subject.getPrincipal();    
   
           authorizationInfo.addStringPermission(currentUser.getPerms());
           return authorizationInfo;
       }
   
       // 认证
       // 当执行subject.login(token);方法时，会运行这个方法
       @Override
       protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
           System.out.println("执行了=>认证doGetAuthenticationInfo");
   
           UsernamePasswordToken userToken=(UsernamePasswordToken) token;
           //连接真实数据库
           User user=userService.queryUserByName(userToken.getUsername());
   
           if(user==null){   //没有该账号
               return null;    //抛出UnknownAccountException异常
           }
           //可以加密，如MD5加密，MD5盐值加密
           //密码认证，shiro做
           return new SimpleAuthenticationInfo(
                   user,     //priciple，它会传给SecurityUtils管理的Subject
                   user.getPwd(),      //password
                   ByteSource.Util.bytes(user.getName()),    //以username作为盐值
                   getName()     //自定义realm的名
           );
       }
   }
   
   ```

5. **配置Shiro**

   ```java
   package com.my.springbootshiro.config;
   
   @Configuration
   public class ShiroConfig {
   
       //ShiroFilterFactoryBean，相当于IniSecurityManagerFactory，第三步
       @Bean(name="shiroFilterFactoryBean")
       public ShiroFilterFactoryBean getShiroFilterFactoryBean(@Qualifier("defaultWebSecurityManager") DefaultWebSecurityManager defaultWebSecurityManager){
           
           ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
           shiroFilterFactoryBean.setSecurityManager(defaultWebSecurityManager);
   
           //添加shiro的内置拦截器
           /*
               anon:无需认证就可以访问
               authc:必须认证了才能访问
               user:必须拥有 " 记住我 " 功能才能用
               perms:拥有对某个资源的权限才能访问
               role: 拥有某个角色权限才能访问
            */
           //拦截路径
           Map<String,String> filterMap=new LinkedHashMap<>();
   
           //授权,正常情况下，未授权的话会跳转到未授权页面
           filterMap.put("/user/add","perms[user:add]");
           filterMap.put("/user/update","perms[user:update]");
   
           //filterMap.put("/user/add","authc");
           //filterMap.put("/user/update","authc");
           //通配符*，表示/user路径下的所有路径
           filterMap.put("/user/*", "authc");
   
           shiroFilterFactoryBean.setFilterChainDefinitionMap(filterMap);
   
           //设置认证的请求路径，当用户在未认证的情况下访问需要认证的页面时，就跳转到 ” /toLogin “ 页面
           shiroFilterFactoryBean.setLoginUrl("/toLogin");
   
           //设置授权的请求路径，当用户在未授权的情况下访问需要授权的页面时，就跳转到 ” /unauthorized “ 页面
           shiroFilterFactoryBean.setUnauthorizedUrl("/unauthorized");
   
           return shiroFilterFactoryBean;
       }
   
       //DefaultWebSecurityManager，相当于SecurityManager，第二步
       @Bean(name="defaultWebSecurityManager")
       public DefaultWebSecurityManager getDefaultWebSecurityManager(@Qualifier("userRealm") UserRealm userRealm){
           DefaultWebSecurityManager securityManager=new DefaultWebSecurityManager();
           //关联UserRealm
           securityManager.setRealm(userRealm);
           return securityManager;
       }
   
       //创建Realm对象，需要自定义Realm类，第一步
       //声明为Bean，让Spring boot管理器管理
       @Bean(name = "userRealm")
       public UserRealm userRealm(){
           return new UserRealm();
       }
   }
   ```

6. 编写实体层

   ```java
   package com.my.springbootshiro.pojo;
   
   @Data
   @AllArgsConstructor
   @NoArgsConstructor
   public class User {
   
       private Integer id;
       private String name;
       private String pwd;
       private String perms;
   }
   
   ```

7. 编写Controller层

   ```java
   package com.my.springbootshiro.controller;
   
   @Controller
   public class MyController {
   
       @GetMapping({"/","/toIndex"})
       public String toIndex(Model model){
           model.addAttribute("msg","hello shiro");
           return "index";
       }
   
       @GetMapping("/user/add")
       public String add(){
           return "user/add";
       }
   
       @GetMapping("/user/update")
       public String update(){
           return "user/update";
       }
   
       @GetMapping("/toLogin")
       public String toLogin(){
           return "login";
       }
   
       @GetMapping("/login")
       public String login(String username,String password,Model model){
           //获取当前的用户
           Subject subject = SecurityUtils.getSubject();
           //封装用户的登录数据
           UsernamePasswordToken token=new UsernamePasswordToken(username,password);
           try {
               //执行登录方法，如果没有异常就说明OK
               subject.login(token);
           } catch (UnknownAccountException uae) {
               model.addAttribute("msg","用户名错误或用户名不存在");
               return "login";
           } catch (IncorrectCredentialsException ice) {
               model.addAttribute("msg","密码错误");
               return "login";
           } catch (LockedAccountException lae) {
               model.addAttribute("msg","登录失败，该用户已被锁定");
               return "login";
           } catch (AuthenticationException ae) {
               model.addAttribute("msg","登录失败");
               return "login";
           }
   
           return "index";
       }
   
       @GetMapping("/unauthorized")
       @ResponseBody
       public String unauthorized(){
           return "未经授权无法访问此页面";
       }
   
       @GetMapping("/logout")
       public String logout(Model model){
           model.addAttribute("logoutMsg","注销成功");
           model.addAttribute("msg","hello shiro");
           SecurityUtils.getSubject().logout();
           return "index";
       }
   }
   ```

8. 编写Service层

   ```java
   public interface UserService {
       User queryUserByName(String name);
   }
   ```

   ```java
   package com.my.springbootshiro.service.impl;
   
   @Service
   public class UserServiceImpl implements UserService {
   
       @Autowired
       private UserMapper userMapper;
   
       @Override
       public User queryUserByName(String name) {
           return userMapper.queryUserByName(name);
       }
   }
   
   ```

9. 编写DAO层

   ```java
   package com.my.springbootshiro.mapper;
   
   @Repository
   @Mapper
   public interface UserMapper {
   
       @Select("select * from user where name=#{name}")
       User queryUserByName(String name);
   }
   
   ```

10. 前端页面

    `user/add.html`

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
    </head>
    <body>
        <h1>add</h1>
    </body>
    </html>
    ```

    `user/update.html`

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
    </head>
    <body>
        <h1>Update</h1>
    </body>
    </html>
    ```

    `index.html`

    ```html
    <!DOCTYPE html>
    <html lang="en" xmlns:th="http://www.w3.org/1999/xhtml">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
    </head>
    <body>
        <p th:text="${logoutMsg}" style="color: red;"></p>
        <h1>首页</h1>
        <p th:text="${msg}"></p>
        <hr>
        <a th:href="@{/user/add}">ADD</a> | <a th:href="@{/user/update}">UPDATE</a>
        <br/>
        <br/>
        <a th:href="@{/logout}">Logout</a>
    </body>
    </html>
    ```

    `login.html`

    ```html
    <!DOCTYPE html>
    <html lang="en" xmlns:th="http://www.w3.org/1999/xhtml">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
    </head>
    <body>
        <h1>登录</h1>
        <hr>
        <p th:text="${msg}" style="color:red;"></p>
        <form th:action="@{/login}">
            <p>用户名：<input type="text" name="username"></p>
            <p>密码：<input type="password" name="password"></p>
            <p><input type="submit"></p>
        </form>
    </body>
    </html>
    ```

    <img src="D:\blog\source\_drafts\shiro学习\1.png" alt="image-20210506213654178" style="zoom:67%;" />















