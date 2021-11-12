---
title: 论文阅读Image Super-Resolution Using Deep Convolutional Networks
comment: true
date: 2021-10-21 10:44:44
tags:
categories:
addrlink:
---


# 标题

**Image Super-Resolution Using Deep Convolutional Networks**



# 动机

1. 发现传统的基于稀疏编码的SR方法可以看作是一个深度卷积网络，所以想优化这个网络，从而优化基于稀疏编码的SR方法。
2. 以往主流的SR方法都是对单色道的图像进行图像超分，部分学者有尝试恢复RGB三通道的，如：分别解析超分各个通道，然后将各个通道的结果合并起来。虽然如此，但他们没有尝试分析每个通道的解析性能表示，和分析解析各个通道的必要性。



# 贡献

1. 证明了基于稀疏编码的SR方法可以看作是一个CNN。
2. 将DP引入SR，提出SRCNN
3. 





## SRCNN

![image-20211022112516583](D:\blog\source\_drafts\论文阅读Image-Super-Resolution-Using-Deep-Convolutional-Networks\1.png)

1. 对LR图像使用双三次插值，将其扩大到所需大小。（用Y表示扩大后的图像）

2. 通过LR→HR映射函数F，将Y恢复为HR图像F(Y)

3. 将F(Y)与X比较，学习F函数。（X为真实HR图像），其中F的学习步骤为：
   - 特征提取和表示
   - 非线性映射
   - 重构图像



### 特征提取和表示

该操作可总结为：
$$
F_1({\bf{Y}})=max(0,W_1 * {\bf{Y}} +B_1) 
$$

其中：

-  $W_1$ ： $n_1$ 个尺寸为 $c \times f_1 \times f_1$ 的卷积核， $c$ 为通道数
-  $B_1$ ：偏差，它是一个 $n_1$ 维的向量，每一维都对应一个卷积核
- $*$ ：卷积操作
- ${\bf{Y}}$ ：输入图像，输入图像尺寸： $c \times f_{sub} \times f_{sub}$ 

值得注意的是，每一次卷积操作的结果，都会经过激活函数ReLU处理

> ReLU激活函数公式：
> $$
> f(x)=max(0,x)
> $$
> ![img](D:\blog\source\_drafts\论文阅读Image-Super-Resolution-Using-Deep-Convolutional-Networks\2.jpg)

该层的输出：尺寸为 $n_1 \times (f_{sub} - f_1 + 1) \times (f_{sub} - f_1 + 1)$ 的特征矩阵 



### 非线性映射

这一层的操作可总结为：
$$
F_2({\bf{Y}})={\rm{max}}(0,W_2 * F_1({\bf{Y}})+B_2)
$$
其中：

- $W_2$ ：$n_2$ 个尺寸为 $n_1 \times f_2 \times f_2$ 的卷积核， $n_1$ 为通道数
- $*$ ： 卷积操作
- ${\rm{max}}()$ ：ReLU激活操作
- $B_2$ ：偏差，它是一个 $n_2$ 维的向量，每一维都对应一个卷积核
- $F_1({\bf{Y}})$ ：第一层的操作结果



该层的输出：尺寸为 $n_2 \times (f_{sub} - f_1 -f_2 + 2) \times (f_{sub} - f_1 - f_2 + 2)$ 的特征矩阵





### 重构图像

这一层的操作：
$$
F({\bf{Y}})=W_3 * F_2({\bf{Y}}) + B_3
$$
其中：

- $W_3$ ：$c$ 个尺寸为 $n_2 \times f_3 \times f_3$ 的卷积核， $c$ 为通道数
- $B_3$ ： 偏差，它是一个 $c$ 维的向量，每一维都对应一个卷积核



该层的输出：尺寸为 $c \times (f_{sub} - f_1 - f_2 -f_3 + 3) \times (f_{sub} - f_1 - f_2 -f_3 + 3)$ 的特征矩阵





# 训练

## 损失函数

SRCNN使用MSE(Mean Square Error)作为损失函数：
$$
L(\Theta)=\frac 1 n \sum _{i=1} ^n \lVert F({\rm{Y}}_i ; \Theta) - {\rm{X}}_i \rVert ^2
$$
其中：

- $F$ ：重构图像层中的重构函数，重构函数可简化为： $F({\rm{Y}}_i ; \Theta)$
- $\Theta$ ：SRCNN的参数向量， $\Theta=\lbrace W_1, W_2, W_3, B_1, B_2, B_3 \rbrace$ 
- ${\rm{Y}}$ ：低分辨率的图像组
- ${\rm{X}}$ ： 对应 ${\rm{Y}}$ 的高分辨率的图像组
- $n$ ：图像组的个数
- $L(\Theta)$ ：指对





## 优化函数

SRCNN在优化函数中使用随机梯度下降法（Stochastic Gradient Descent，SGD）

- 对于特征提取表示层和非线性映射层，学习率为 $10^{-4}$ ，对于重构图像层，学习率为 $10^{-5}$ 。





