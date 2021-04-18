---
title: Mybatis学习
comment: true
date: 2021-03-21 17:07:23
tags:
categories:
addrlink:
---

Mybatis是一款优秀的持久层框架

它支持定制化SQL、存储过程以及高级映射

Mybatis避免了几乎所有的JDBC代码和手动设置参数以及获取结果集。Mybatis可以使用简单的XML或注解来配置和映射原生类型、接口和Java的POJO（Plain Old Java Objects，普通老式Java对象）为数据库中的记录

> **持久化** ：将程序的数据在持久状态和瞬时状态转化的过程 
>
> **持久层** ：完成持久化工作的代码块



 # 第一个程序

1. 建立数据库表

   ```mysql
   create table learn.user
   (
    id   int auto_increment primary key,
       name varchar(20)  not null,
       pwd  varchar(110) null
   );
   ```
   
   



2. 创建Maven项目，导入依赖

    ```xml
    <dependencies>
        <!-- mysql驱动   -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.22</version>
        </dependency>

        <!-- mybatis -->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.4</version>
        </dependency>

        <!-- junit测试-->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
    ```

3. 创建mybatis-config.xml核心配置文件，对mybatis进行xml配置

    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE configuration
            PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
            "http://mybatis.org/dtd/mybatis-3-config.dtd">
    <configuration>
        <!-- 环境 -->
        <environments default="development">
            <environment id="development">
                <!--事务管理 -->
                <transactionManager type="JDBC"/>
                <dataSource type="POOLED">
                    <!-- mysql驱动-->
                    <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                    <property name="url" value="jdbc:mysql://localhost:3306/learn?useUnicode=true&amp;characterEncoding=UTF-8&amp;serverTimezone=Asia/Shanghai"/>
                    <property name="username" value="root"/>
                    <property name="password" value="wakie"/>
                </dataSource>
            </environment>
        </environments>

        <!--
        没有的话，会显示如下错误
        org.apache.ibatis.binding.BindingException:
        Type interface com.my.mybatis01.dao.UserMapper is not known to the MapperRegistry.
        因为每个mapper.xml都需要在mybatis核心配置文件中注册
        -->
        <mappers>
            <mapper resource="mapper/UserMapper.xml"></mapper>
        </mappers>
    </configuration>
    ```

4. 编写获取SqlSession工具类

    ```java
    package com.my.mybatis01.utils;

    import org.apache.ibatis.io.Resources;
    import org.apache.ibatis.session.SqlSession;
    import org.apache.ibatis.session.SqlSessionFactory;
    import org.apache.ibatis.session.SqlSessionFactoryBuilder;
    import java.io.IOException;
    import java.io.InputStream;

    public class MybatisUtils{
        private static SqlSessionFactory sqlSessionFactory;
        static {
            try {
                String resource="mybatis-config.xml";
                //读取mybatis核心配置文件
                InputStream inputStream= Resources.getResourceAsStream(resource);  
                //构建SqlSession工厂
                sqlSessionFactory=new SqlSessionFactoryBuilder().build(inputStream);   
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        public static SqlSession getSqlSession(){
            return sqlSessionFactory.openSession();
        }
    }
    ```

    每个基于 MyBatis 的应用都是以一个 SqlSessionFactory 的实例为核心的。SqlSessionFactory 的实例可以通过 SqlSessionFactoryBuilder 获得。而 SqlSessionFactoryBuilder 则可以从 XML 配置文件或一个预先配置的 Configuration 实例（常用的就是通过XML配置文件来构建）来构建出 SqlSessionFactory 实例。

    有了 SqlSessionFactory，就可以从中获得 SqlSession 的实例，SqlSession 提供了在数据库执行 SQL 命令所需的所有方法。
    
    
    
    **SqlSessionFactoryBuilder：**
    
    这个类可以被实例化、使用和丢弃，一旦创建了SqlSessionFactory，就不再需要它了。
    
    因此 SqlSessionFactoryBuilder 实例的最佳作用域是方法作用域（也就是局部方法变量）。 
    
    你可以重用 SqlSessionFactoryBuilder 来创建多个 SqlSessionFactory 实例，但最好还是不要一直保留着它，以保证所有的 XML 解析资源可以被释放给更重要的事情。
    
    
    
    **SqlSessionFactory：**
    
    SqlSessionFactory 一旦被创建就应该在应用的运行期间一直存在，没有任何理由丢弃它或重新创建另一个实例。 
    
    使用 SqlSessionFactory 的最佳实践是在应用运行期间不要重复创建多次，多次重建 SqlSessionFactory 被视为一种代码“坏习惯”。
    
    因此 SqlSessionFactory 的最佳作用域是应用作用域。 有很多方法可以做到，最简单的就是使用单例模式或者静态单例模式。
    
    
    
    **SqlSession：**
    
    每个线程都应该有它自己的 SqlSession 实例。
    
    SqlSession 的实例不是线程安全的，因此是不能被共享的，所以它的最佳的作用域是请求或方法作用域。
    
    绝对不能将 SqlSession 实例的引用放在一个类的静态域，甚至一个类的实例变量也不行。 
    
    也绝不能将 SqlSession 实例的引用放在任何类型的托管作用域中，比如 Servlet 框架中的 HttpSession。 
    
    如果你现在正在使用一种 Web 框架，考虑将 SqlSession 放在一个和 HTTP 请求相似的作用域中。 换句话说，每次收到 HTTP 请求，就可以打开一个 SqlSession，返回一个响应后，就关闭它。
    
    
    
    
    
5. 编写DAO接口

    ```java
    package com.my.mybatis01.dao;
    
    import com.my.mybatis01.pojo.User;
    
    import java.util.List;
    
    public interface UserMapper {
    
        List<User> selectAllUsers();
    }
    ```

6. 接口实现类

   接口实现类，就是用来执行SQL语句的，而这些SQL语句既可以通过 XML 定义，也可以通过注解定义。

   先看XML定义

   ```xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <!DOCTYPE mapper
           PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
           "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
   
   <mapper namespace="com.my.mybatis01.dao.UserMapper">
       <select id="selectAllUsers" resultType="com.my.mybatis01.pojo.User">
           select * from user
       </select>
   </mapper>
   ```

   - namespace：命名空间，映射接口类
   - id：映射接口类中的方法

   

   再看注解定义

   这个就是直接在接口方法名上加注解

   ```java
   package com.my.mybatis01.dao;
   
   import com.my.mybatis01.pojo.User;
   import org.apache.ibatis.annotations.Select;
   
   import java.util.List;
   
   public interface UserMapper {
       
       @Select("select * from user")
       List<User> selectAllUsers();
   }
   
   ```



7. 测试

   ```java
   package com.my.mybatis01.dao;
   
   import com.my.mybatis01.pojo.User;
   import com.my.mybatis01.utils.MybatisUtils;
   import org.apache.ibatis.session.SqlSession;
   import org.junit.Test;
   
   import java.util.List;
   
   public class UserMapperTest {
   
       @Test
       public void test(){
           //获得sqlSession对象
           SqlSession sqlSession= MybatisUtils.getSqlSession();
           //获取UserMapper
           UserMapper userMapper=sqlSession.getMapper(UserMapper.class);
           //执行UserMapper中的方法
           List<User> users = userMapper.selectAllUsers();
   
           for(User user:users){
               System.out.println(user);
           }
   
           //关闭sqlSession
           sqlSession.close();
       }
   }
   
   ```

   在这里需要注意的是，mybatis的增删改是需要提交事务的，也就是最后需要执行`sqlSession.commit()`语句，查不用

# XML 映射器

xml映射器文件就是用来映射Dao类的

其有以下几个标签：

- `mapper` ：映射标签，在mapper内，又有以下几个标签
- `cache` ：
- `cache-ref` ：
- `sql` ：可被其它语句引用的可重用语句块
- `insert` ： 映射插入语句
- `update` ：映射更新语句
- `delete` ：映射删除语句
- `select`：映射查询语句



## mapper

在mapper标签中，有一个属性：`namespace`，命名空间，用于映射Dao接口类

如：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.my.mybatis01.dao.UserMapper">

</mapper>
```



## select

select标签属性：

| 属性          | 作用                                                         |
| ------------- | ------------------------------------------------------------ |
| id            | 在命名空间中的唯一标识符，用于映射dao类中的方法              |
| parameterType | 传入这条语句的参数的类全限定名或别名                         |
| resultType    | 这条语句中返回结果的类全限定名或别名，若返回的是集合，那应该设置为集合包含的类型，而不是集合本身的类型 |
| resultMap     | 对外部 resultMap 的命名引用，resultType 和 resultMap 之间只能同时使用一个 |
| flushCache    | 将其设置为 true 后，只要语句被调用，都会导致本地缓存和二级缓存被清空，默认值：false |
| useCache      | 将其设置为 true 后，将会导致本条语句的结果被二级缓存缓存起来，对select 标签默认为 true |
| timeout       |                                                              |
| fetchSize     |                                                              |
| statementType |                                                              |
| resultSetType |                                                              |
| databaseId    |                                                              |
| resultOrdered |                                                              |
| resultSets    |                                                              |



## insert，update，delete

这3个标签的使用很接近

标签属性：

- **id：** 

  在命名空间中的唯一标识符，用于映射dao类中的方法

- **parameterType：** 

  传入这条语句的参数的类全限定名或别名

- **flushCache：** 

  设置为 true 后，只要语句被调用，本地缓存和二级缓存都会被清空

  默认值：（对 insert、update 和 delete 语句）true

- **timeout：** 

  这个设置是在抛出异常之前，驱动程序等待数据库返回请求结果的秒数。

  默认值为未设置（unset）

  这个设置依赖数据库驱动

- **statementType：** 

  可选 STATEMENT，PREPARED 或 CALLABLE

  这会让 MyBatis 分别使用 Statement，PreparedStatement 或 CallableStatement

  默认值：PREPARED

- **useGeneratedKeys：** 

  仅适用于 insert 和 update

  这会令 MyBatis 使用 JDBC 的 getGeneratedKeys 方法来取出由数据库内部生成的主键

- **keyProperty：** 

  仅适用于 insert 和 update

  设置生成键值在表中的列名，在某些数据库（像 PostgreSQL）中，当主键列不是表中的第一列的时候，是必须设置的

  如果生成列不止一个，可以用逗号分隔多个属性名称

- **databaseId：** 

  如果配置了数据库厂商标识（databaseIdProvider），MyBatis 会加载所有不带 databaseId 或匹配当前 databaseId 的语句；如果带和不带的语句都有，则不带的会被忽略

  





