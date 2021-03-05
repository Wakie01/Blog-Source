---
title: java获取当前时间的前n天
comment: true
date: 2021-01-12 10:34:48
tags: Time
categories: BackEnd
addrlink: 1118
---

```java
public class DateLearn {
    public static void main(String[] args) {
        SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        Date date=new Date();

        System.out.println("当前时间: "+dateFormat.format(date));

        Calendar calendar=Calendar.getInstance();
        calendar.setTime(date);
        
        //获取当前时间的后1个钟
        calendar.add(Calendar.HOUR,1);
        date=calendar.getTime();
        System.out.println("后1个钟: "+dateFormat.format(date));
        
        //获取当前时间的前7天
        calendar.add(Calendar.DATE,-7);
        date=calendar.getTime();
        System.out.println("前7天: "+dateFormat.format(date));

        //获取当前时间的前1个月
        calendar.add(Calendar.MONTH,-1);
        date=calendar.getTime();
        System.out.println("前1个月: "+dateFormat.format(date));
        
    }

}

```

结果：

![img1](D:\blog\source\_posts\java获取当前时间的前n天\1.png)



注意：这个calendar是连着来加减时间