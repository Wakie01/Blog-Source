---
title: Anaconda学习
comment: true
date: 2021-08-26 20:47:47
tags:
categories:
addrlink: 
---





Anaconda，就是一个Python环境的管理工具，通过它，可以切换多个不同版本的Python环境，并在各自的Python环境中安装不同版本的依赖包。类似于VMware。



# 常用命令

1. 创建环境

   ```bash
   conda create -n [环境名] python=[环境中python的版本号]
   ```

   运行示例：

   ```bash
   conda create -n pytorch python=3.6
   ```

2. 查看环境

   ```bash
   conda info --envs
   ```

   运行示例：

   - 第一列：环境名
   - 第二列：当前处于哪个环境，`*`号
   - 第三列：环境位置

   ```bash
   (base) C:\Users\哈啰>conda info --envs
   # conda environments:
   #
   base                  *  D:\Anaconda\Anaconda3        # 当前的环境
   pytorch                  D:\Anaconda\Anaconda3\envs\pytorch
   ```

3. 切换环境

   ```bash
   conda activate 环境名
   ```

   运行示例：

   ```bash
   (base) C:\Users\哈啰>conda activate pytorch     # 切换环境为pytorch
   
   (pytorch) C:\Users\哈啰>
   ```

4. 关闭当前环境，默认切换为base环境

   ```bash
   conda deactivate
   ```

   运行示例：

   ```bash
   (pytorch) C:\Users\哈啰>conda deactivate
   
   (base) C:\Users\哈啰>
   ```

5. 查看当前环境中的工具包

   ```bash
   pip list
   # 或者
   conda list
   ```

   运行示例：

   ```bash
   (pytorch) C:\Users\哈啰>pip list
   Package      Version
   ------------ -------------------
   certifi      2021.5.30
   pip          21.0.1
   setuptools   52.0.0.post20210125
   wheel        0.37.0
   wincertstore 0.2
   
   (pytorch) C:\Users\哈啰>
   ```

6. 下载安装`.txt`文件罗列的依赖包，如`requirements.txt`

   ```bash
   # 用pip3命令下载
   # pip3 install -r, --requirement <file>    
   # Install from the given requirements file. This option can be used multiple times.
   pip3 install -r requirements.txt
   ```

7. pip3安装依赖包

   ```bash
   -i  # 指定源
   
   # 依赖包版本设置
   ==   # 指定 某个版本号
   >=   # 大于等于 某个版本号
   <=   # 小于等于 某个版本号
   >    # 大于 某个版本号
   <    # 小于 某个版本号
   
   # 指定源，下载1.61版本的numpy
   pip3 install numpy==1.61 -i https://pypi.mirrors.ustc.edu.cn/simple/
   ```

   > 常用的pip3源：
   >
   > - 清华： https://pypi.tuna.tsinghua.edu.cn/simple/
   > - 阿里云： https://mirrors.aliyun.com/pypi/simple/
   > - 中国科技大学： https://pypi.mirrors.ustc.edu.cn/simple/



8. 卸载当前环境下的某个包

   ```bash
   pip3 uninstall [包名]
   
   # 或者
   conda remove [包名]
   ```

   示例：

   ```java
   (tracking_wo_bnw) D:\python_workspace\tracking_wo_bnw>pip3 uninstall sacred
   Found existing installation: sacred 0.8.2
   Uninstalling sacred-0.8.2:
     Would remove:
       d:\anaconda\anaconda3\envs\tracking_wo_bnw\lib\site-packages\sacred-0.8.2.dist-info\*
       d:\anaconda\anaconda3\envs\tracking_wo_bnw\lib\site-packages\sacred\*
   Proceed (Y/n)? y
     Successfully uninstalled sacred-0.8.2
   
   (tracking_wo_bnw) D:\python_workspace\tracking_wo_bnw>
   ```

   `pip3 uninstall`的常用`option`：

   ```bash
   -r   删除requirement.txt文件下的所有依赖包
   -y   Don't ask for confirmation of uninstall deletions.
   ```

9. 删除环境

   ```bash
   conda remove -n [环境名] --all
   ```

10. pip导出安装包

    ```bash
    # 导出到当前目录下
    pip freeze > requirements.txt
    ```

11. 查看conda版本信息

    ```bash
    conda --version
    
    C:\Users\哈啰>conda --version
    conda 4.10.1
    ```

12. 查看cuda版本

    ```bash
    nvcc --version
    
    C:\Users\哈啰>nvcc --version
    nvcc: NVIDIA (R) Cuda compiler driver
    Copyright (c) 2005-2019 NVIDIA Corporation
    Built on Fri_Feb__8_19:08:26_Pacific_Standard_Time_2019
    Cuda compilation tools, release 10.1, V10.1.105
    ```

    















# 错误记录

1. UnicodeDecodeError: 'gbk' codec can't decode byte 0x99 in position 10856: illegal multibyte sequence

   ![image-20210911093913003](D:\blog\source\_drafts\Anaconda学习\1.png)

   按报错信息所示，是`pathlib.py`文件的1222行代码编码有问题导致的

   所以，需要修改`pathlib.py`文件1222行代码相关的编码，改为`UTF-8`。

   安装完之后改回来。

