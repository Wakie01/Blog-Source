---
title: JWT学习
comment: true
date: 2021-08-13 21:12:04
tags: Security
categories: BackEnd
addrlink: 2018
---


JWT：Json Web Token，它是一种基于JSON的开放标准。它常用于身份认证。



# JWT结构

JWT由三段信息组成：

1. 头部（Header）
2. 载荷（Payload）
3. 签名（Signature）

这三段信息用`.`连接。比如：

```tex
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2Mjg5NDYxMDYsInVzZXJuYW1lIjoiMTU1MTMwNzkwNzEifQ.avx6OqyeCcganSICqy4KdGsMJ1_0YjUN5m2mSgUONPs
```

 

## Header

Header通常由两部分组成：

1. 令牌类型（即：JWT）
2. 签名算法，如HS256

比如：

```json
{
    "typ": "JWT",
    "alg": "HS256"
}
```

然后它对Header信息进行Base64编码，最后就成了：

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9
```



## Payload

Payload中的内容由声明（Claim）组成。

Claim是由用户自定义的一些数据，如：

```json
{
    "exp":1628946106,
    "username":"15513079071"
}
```

然后对Payload进行Base64编码，就成了：

```
eyJleHAiOjE2Mjg5NDYxMDYsInVzZXJuYW1lIjoiMTU1MTMwNzkwNzEifQ
```



## Signature

Signature的部分是：对前两个部分的内容进行加密后得到的密文。

加密算法为第一部分中的`alg`，比如这里为HS256。

当然还有密钥，这是服务端提供的。



这部分的作用就是：保证JWT没有被纂改过。



这里的Signature为：

```
avx6OqyeCcganSICqy4KdGsMJ1_0YjUN5m2mSgUONPs
```



## 总结

由于Base64只是一种编码，是可逆的，所以在JWT中，不应该在Claim中加入任何敏感的数据。

其实JWT的作用主要就是：认证来源。





# 使用

## 使用原理

![img](.\JWT学习\1.png)



## Java使用

1. 导入依赖

   ```xml
   <dependency>
       <groupId>com.auth0</groupId>
       <artifactId>java-jwt</artifactId>
       <version>3.4.0</version>
   </dependency>
   ```

2. 编写工具类

   ```java
   package com.my.ourapp.service.impl;
   
   import com.auth0.jwt.JWT;
   import com.auth0.jwt.JWTCreator;
   import com.auth0.jwt.JWTVerifier;
   import com.auth0.jwt.algorithms.Algorithm;
   import com.auth0.jwt.exceptions.*;
   import com.auth0.jwt.interfaces.Claim;
   import com.auth0.jwt.interfaces.DecodedJWT;
   import com.my.ourapp.common.Result;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.data.redis.core.StringRedisTemplate;
   import org.springframework.stereotype.Service;
   
   import java.io.UnsupportedEncodingException;
   import java.util.Calendar;
   import java.util.Date;
   import java.util.Map;
   
   /**
    * JWT工具类,其主要作用：
    * 定义token过期时间，创建token的密钥（自定义）,自定义存放token的请求头的名称
    * 1. 签发token
    * 2. 判断过期时间
    * 3. 刷新token
    */
   @Service
   public class JwtServiceImpl {
   
       /**
        * 过期时间，以毫秒为单位，一天
        */
       private static final long EXPIRE_TIME=1000*60*60*24;
   
       /**
        * 自定义密钥
        */
       public static final String SECRET="SECRET_VALUE";
   
       /**
        * 请求头
        */
       public static final String AUTH_HEADER="X-Authorization-With";
   
       /**
        * 存储在Redis中的Key
        */
       public static final String redisKey="token";
   
       @Autowired
       private StringRedisTemplate stringRedisTemplate;
   
       /**
        * 生成token
        * @param username
        * @param secret 密钥
        * @return
        */
       public String sign(String username,String secret) throws UnsupportedEncodingException,JWTCreationException{
           //过期时间
           Date date=new Date(System.currentTimeMillis()+EXPIRE_TIME);
           //使用HMAC-SHA256算法对secret进行加密
           Algorithm algorithm=Algorithm.HMAC256(secret);
           //附带username信息,过期信息,然后生成token
           String token = JWT.create().withClaim("username", username).withExpiresAt(date).sign(algorithm);
           //保存到Redis中
           stringRedisTemplate.opsForSet().add(redisKey,token);
           return token;
       }
   
   
       /**
        * 验证token是否正确
        * @param token JWT Token
        * @param username
        * @param secret 用户提供来解析token的密钥
        * @return
        */
       public boolean verify(String token,String username,String secret) {
           //判断Redis中是否存在该Token，若不存在，则直接返回False
           if(Boolean.FALSE.equals(stringRedisTemplate.opsForSet().isMember(redisKey, token))){
               System.out.println("Redis不存在此Token");
               return false;
           }
   
           //删除Redis中的Token
           stringRedisTemplate.opsForSet().remove(redisKey,token);
   
           if(isTokenExpired(token)) {
               System.out.println("Jwt Token时间过期了");
               return false;
           }
   
           try {
               Algorithm algorithm=Algorithm.HMAC256(secret);
               JWTVerifier verifier=JWT.require(algorithm).withClaim("username",username).build();
               //当验证失败时，会抛出JWTVerificationException异常
               verifier.verify(token);
               return true;
           } catch (UnsupportedEncodingException| JWTVerificationException e) {
               e.printStackTrace();
               return false;
           }
       }
   
   
       /**
        * 获得token中的自定义信息,无需secret解密也能获得
        * @param field
        * @return
        */
       public static String getClaimField(String token,String field){
           DecodedJWT decodedJWT=JWT.decode(token);
           return decodedJWT.getClaim(field).asString();
       }
   
   
       /**
        * 获取token的签发时间
        * @param token
        * @return 当解析token失败时，返回 null，否则返回token签发时间
        */
       public static Date getIssueTime(String token){
           DecodedJWT decodedJWT=JWT.decode(token);
           return decodedJWT.getIssuedAt();
       }
   
       /**
        * 验证token是否过期
        * @param token
        * @return 过期：true    未过期：false
        */
       public static boolean isTokenExpired(String token){
           try{
               Date now= Calendar.getInstance().getTime();
               DecodedJWT decodedJWT=JWT.decode(token);
               return decodedJWT.getExpiresAt().before(now);
           }catch (Exception e){
               e.printStackTrace();
               return true;
           }
       }
   
       /**
        * 刷新token的有效期
        * @param token
        * @param secret 密钥
        * @return
        */
       public String refreshTokenExpired(String token,String secret) throws UnsupportedEncodingException, JWTCreationException {
           //解析token
           DecodedJWT decodedJWT=JWT.decode(token);
           //获取token的参数信息
           Map<String, Claim> claims = decodedJWT.getClaims();
   
           Date date=new Date(System.currentTimeMillis()+EXPIRE_TIME);
           Algorithm algorithm=Algorithm.HMAC256(secret);
           JWTCreator.Builder builder = JWT.create();
           for (Map.Entry<String, Claim> entry : claims.entrySet()) {
               builder.withClaim(entry.getKey(), entry.getValue().asString());
           }
           token = builder.withExpiresAt(date).sign(algorithm);
           //对Redis的Token进行更新
           stringRedisTemplate.opsForSet().add(redisKey,token);
           return token;
       }
   
   }
   ```

   