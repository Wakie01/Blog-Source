---
title: git&github使用
comment: true
date: 2020-06-18 10:31:39
tags: 
- git
- github
categories:
- git
addrlink: 1032
---

## 前言

记录一下这段时间关于Git&GitHub的学习

## 常用命令

- 本地库初始化

```bash
$ git init
```

- 查看工作区、暂存区状态

```bash
$ git status
```

- 将工作区中新建/修改的文件添加到暂存区

```bash
$ git add [file_name] 
```

​	常用`git add .`来将所有修改或新建的文件添加到暂存区

- 将暂存区的内容提交到本地库

```bash
$ git commit -m "message" [file_name]
```

#### 查看commit的历史记录

HEAD是一个指针，表示当前版本

- 比较详细的

```bash
$ git log
```

`空格` 向下翻页 ； `b`  向上翻页 ； `q`  退出

- 比较简洁

```bash
$ git log --pretty=oneline
```

- 更简洁（将Hash值，也叫索引值缩短显示）

```bash
$ git log --oneline 
```

- 比较简洁

```bash
$ git log --oneline 
```

HEAD@{移动到该版本需要多少步数}


#### commit版本的前进后退

reset命令在  --hard参数 下，工作区、暂存库和本地库会同时发生改变。

- 基于索引值操作

```bash
$ git reset --hard [索引值] 
```

可前可后

- 使用^符号

```bash
$ git reset --hard HEAD^
```

只能后退，一个`^`表示后退一步，n个`^`表示后退n步

- 使用~符号

```bash
$ git reset --hard HEAD~n
```

只能后退，`~n`表示后退n步


#### 比较文件差异

- 将工作区的文件与暂存区的进行比较

```bash
$ git diff [file_name]
```

- 将工作区的文件与本地库中某历史版本的进行比较

```bash
$ git diff [历史版本索引值] [file_name]
```

#### 分支管理

- 创建分支

```bash
$ git branch [分支名]
```

- 查看分支

```bash
$ git branch -v
```

- 切换分支

```bash
$ git checkout [分支名]
```

- 合并分支

  1. 切换到接收修改的分支

   ```bash
   $ git checkout [被合并分支名]
   ```

  2. 合并

   ```bash
   $ git merge [要合并分支名]
   ```

  3. 解决冲突（若有）

     1. 编辑文件，删除特殊符号

     2. 修改文件，保存退出

     3. 添加到暂存区

        ```bash
        $ git add [文件名]
        ```

     4. 提交到本地库

        ```bash
        $ git commit -m "message"
        ```


#### 远程库(Github)

- 添加远程库

```bash
$ git remote add [别名] [远程地址]
```

- 查看远程库

```bash
$ git remote -v
```

- 删除远程库

```bash
$ git remote rm [别名]
```

- 将本地库推送到远程库

```bash
$ git push [别名] [分支名]
```

- 将远程库克隆到本地库

```bash
$ git clone [远程地址]
```

> 注意：克隆时会将别人的本地库也克隆下来


- 拉取

```bash
## pull=fetch+merge
$ git fetch [别名] [远程分支名]
$ git merge [别名] [远程分支名]
$ git pull [别名] [远程分支名]
```

## 结言

了解一下，虽然现在都是图形化界面