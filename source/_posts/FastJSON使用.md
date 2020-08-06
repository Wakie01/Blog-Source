---
title: FastJSON使用
comment: true
date: 2020-07-28 10:44:35
tags:
- Java
- Json
categories: 
- Java
addrlink: 1045
---

## 前言

用了一段时间阿里的FastJSON后，感觉挺好用的，特此记录一下，其实也很简单

## 上手

**1. Maven**

```xml

  <dependency>
    <groupId>com.alibaba </groupId>
    <artifactId>fastjson </artifactId>
    <version>1.2.31 </version>
  </dependency>

```

**2. 常见用法**


- 对String能否转成JSONObject进行判断

```java

    String str=new String("111");
    JSONObject jsonObject;
    try {
        jsonObject= JSON.parseObject(str);
    }catch (JSONException e1){
        return false;
    }catch (ClassCastException e2){
        return false;
    }
    return true;

```

- 将String转成JSONObject 

```java

    JSONObject jsonObject=JSON.parseObject(str);
    //JSONObject jsonObject=JSONObject.parseObject(str);     效果一样
    jsonObject.getInteger("year"); 
    jsonObject.containsKey("month");
    jsonObject.put("date","07/28");
    jsonObject.getJSONObject("time");

```
