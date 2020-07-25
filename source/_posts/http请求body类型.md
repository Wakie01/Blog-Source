---
title: Http请求body类型
comment: true
date: 2020-07-24 11:57:07
tags: Http
categories: Http
addrlink: 1158
---


## body类型

常见的有：

  1. none 

  2. form-data 

  3. x-www-urlencoded

  4. raw

  5. binary


![img1](./Http请求body类型/1.png)


### none

不传送数据

### form-data

传送表单数据，Headers的`Content-Type`为`multipart/form-data`

比如前台传送


![img3](./Http请求body类型/3.png)


那么后台要这样接收 (以spring boot为例)


![img4](./Http请求body类型/4.png)


### x-www-urlencoded

urlencode，顾名思义，就是url编码，将表单数据以url编码后传送，具体编码后的样子是，比如，传送

![img2](./Http请求body类型/2.png)


那么后台收到的数据形式就会是：<i><b>msg=hello world&status=success</b></i>

即表单内的数据转换为键值对

此时Headers的`Content-Type`为`application/x-www-form-urlencoded`


> form-data与x-www-urlencoded有什么不同？ (以spring boot为例)
> <b>form-data:</b>  不能用`@RequestBody`直接接收，而是得用`@RequestParam`来一个一个接收,而且接收数据的名字要对应，不然会出错
> <b>x-www-urlencoded: </b> 可以直接用`@RequestBody`接收



### raw

Raw(原始),可以传送任意格式的文本，比如text、json、xml、html等

最常见就是传送json数据，而此时Headers的`Content-Type`为`application/json`


### binary

上传二进制数据，常用来传送文件数据，一次只能上传一个文件

不同文件类型，http Headers的`Content-Type`也会不同，比如：

<br>

| 文件类型 | Content-Type |
| :--: | :--: |
| .text | text/plain |
| .json | application/json |
| .sql  | application/x-sql |
| .doc | application/msword |
| .xls | application/vnd.ms-excel |
| .mp3 | audio/mpeg |
