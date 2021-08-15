---
title: Linux安装与卸载Python
comment: true
date: 2021-06-15 13:42:28
tags:
categories:
addrlink:
---



# 安装

1. 打开官网，选择要下载的版本，复制下载链接

   ![image-20210615134642121](D:\blog\source\_drafts\Linux安装与卸载Python\1.png)

2. 下载&安装

   ```shell
   # 打开终端，新建下载目录
   mkdir /usr/local/python3
   
   # 进入安装目录
   cd /usr/local/python3
   
   # 下载source压缩包
   wget https://www.python.org/ftp/python/3.9.0/Python-3.9.0.tgz
   
   # 解压
   tar -xzvf Python-3.9.0.tgz
   
   # 进入解压目录
   cd Python-3.9.0
   
   # 执行配置构建文件
   ./configure --enable-optimizations
   
   # 编译并安装
   make && sudo make install
   
   # 添加python3的软链接
   ```







参考：
[Python（一）- 安装与升级！](https://blog.csdn.net/weixin_41599858/article/details/101795427)