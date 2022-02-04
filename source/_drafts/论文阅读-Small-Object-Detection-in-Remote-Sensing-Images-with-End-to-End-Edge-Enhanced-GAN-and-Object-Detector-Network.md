---
title: >-
  论文阅读-Small-Object Detection in Remote Sensing Images with End-to-End
  Edge-Enhanced GAN and Object Detector Network
comment: true
date: 2021-11-20 10:29:38
tags:
categories:
addrlink:
---


# 论文简介

Rabbi J, Ray N, Schubert M, et al. Small-object detection in remote sensing images with end-to-end edge-enhanced GAN and object detector network[J]. Remote Sensing, 2020, 12(9): 1432.

引用量：42


# 动机




# 贡献

1. 提出了一个小目标检测架构，由EESRGAN网络和一个检测器网络组成。



## EESRGAN

EESRGAN由三个子网络组成：

1. 生成器网络，使用Residual-In-Residual Dense Blocks（RRDB）
2. 鉴别器网络，使用Relativistic Discriminator
3. 边缘增强网络，使用Residual-In-Residual Dense Blocks（RRDB）



### 生成器网络

生成器网络，Generator Network G

借鉴ESRGAN生成器的架构，其网络架构如下：

![image-20211120105357066](D:\blog\source\_drafts\论文阅读-Small-Object-Detection-in-Remote-Sensing-Images-with-End-to-End-Edge-Enhanced-GAN-and-Object-Detector-Network\1.png)

其中RRDB的网络架构如下：

<img src="D:\blog\source\_drafts\论文阅读-Small-Object-Detection-in-Remote-Sensing-Images-with-End-to-End-Edge-Enhanced-GAN-and-Object-Detector-Network\3.png" alt="image-20211120111814043" style="zoom:80%;" />



> ESRGAN生成器架构：
>
> ![image-20211120111520967](D:\blog\source\_drafts\论文阅读-Small-Object-Detection-in-Remote-Sensing-Images-with-End-to-End-Edge-Enhanced-GAN-and-Object-Detector-Network\2.png)
>
> RRDB架构：
>
> ![image-20211120111914647](D:\blog\source\_drafts\论文阅读-Small-Object-Detection-in-Remote-Sensing-Images-with-End-to-End-Edge-Enhanced-GAN-and-Object-Detector-Network\4.png)
>
> 相关论文：Wang X, Yu K, Wu S, et al. Esrgan: Enhanced super-resolution generative adversarial networks[C]//Proceedings of the European conference on computer vision (ECCV) workshops. 2018: 0-0.





### 鉴别器网络

鉴别器网络 $D_{Ra}$ ，使用Relativistic Discriminator，

其也是借鉴ESRGAN的鉴别器，



### 边缘增强网络

边缘增强网络，Edge-Enhancement Network，EEN

借鉴EEGAN的边缘增强网络，其网络架构如下：

![image-20211120171404210](D:\blog\source\_drafts\论文阅读-Small-Object-Detection-in-Remote-Sensing-Images-with-End-to-End-Edge-Enhanced-GAN-and-Object-Detector-Network\5.png)



> EEGAN网络架构：
>
> ![image-20211120172015704](D:\blog\source\_drafts\论文阅读-Small-Object-Detection-in-Remote-Sensing-Images-with-End-to-End-Edge-Enhanced-GAN-and-Object-Detector-Network\6.png)
>
> 论文：[Jiang K, Wang Z, Yi P, et al. Edge-enhanced GAN for remote sensing image superresolution[J]. IEEE Transactions on Geoscience and Remote Sensing, 2019, 57(8): 5799-5812.](https://ieeexplore.ieee.org/document/8677274)







整个生成器的损失函数：
$$
L_{G\_een}=\lambda_1 L_{percep}+\lambda_2 L_G ^{Ra} +\lambda_3 L_1 +\lambda_4 L_{een}
$$
其中：

- $\lambda_1,\lambda_2,\lambda_3,\lambda_4$ ：各个损失函数的权值
- $L_{percep}$ ：感知损失函数
- $L_G ^{Ra}$ ：
- $L_1$ ：关于PSNR的损失函数
- $L_{een}$ ：边缘增强网络的损失函数







# 想法

1. 将RRDB中的LReLU换成ELU
2. 修改RRDB，将Dense Block内部之间的密集连接改为Dense Block与Dense Block之间的密集连接，或许还可以同时减少一次卷积与激活
3. 跟ESRGAN比较时间
4. 对比实验参考论文：Pest24: A large-scale very small object data set of agricultural pests for multi-target detection
5. 用筛选过的ip102_v1.1训练图像超分网络
6. 改进后的SR网络与SRGAN、SRCNN等网络进行对比实验

参考论文：

[RBDN: Residual Bottleneck Dense Network for Image Super-Resolution](https://ieeexplore.ieee.org/document/9481260)

[Jiang K, Wang Z, Yi P, et al. Edge-enhanced GAN for remote sensing image superresolution[J]. IEEE Transactions on Geoscience and Remote Sensing, 2019, 57(8): 5799-5812.](https://ieeexplore.ieee.org/document/8677274)

[Wang X, Yu K, Wu S, et al. Esrgan: Enhanced super-resolution generative adversarial networks[C]//Proceedings of the European conference on computer vision (ECCV) workshops. 2018: 0-0.]()

