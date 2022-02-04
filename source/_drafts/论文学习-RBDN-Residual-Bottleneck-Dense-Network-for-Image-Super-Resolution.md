---
title: 论文学习-RBDN-Residual Bottleneck Dense Network for Image Super-Resolution
comment: true
date: 2021-12-07 14:59:30
tags:
categories:
addrlink:
---

# 简介

An Z, Zhang J, Sheng Z, et al. RBDN: Residual Bottleneck Dense Network for Image Super-Resolution[J]. 2021.





# 动机

1. SRGAN超分效果很好，但它存在着特征利用率不高、参数过多等不足
2. 





# 贡献

1. 提出一个由Residual-in-Residual Bottleneck Block（RRBB）组成的密集网络，简称为：剩余瓶颈密集网络（residual bottleneck dense network，RBDN）
2. 各层之间采用密集的级联连接，提高各层之间的功能利用率
3. 在每一层设置瓶颈结构，降低计算量，减少网络参数的数量，加快训练过程中的收敛速度
4. 在RRBB中，使用ELU函数来降低删除BN层所带来的负影响
5. 改进整体的损失函数





## ELU激活函数

ELU激活函数公式：
$$
{\rm{ELU}}(x,\alpha)=
    \begin{cases}
		 x &, x \geq 0 \\ 
		\alpha \left( \,exp(x)-1 \right) &, x<0
    \end{cases}
$$
其中，

- $exp(x)$ ：指的是 $e^x$ 函数
- $\alpha$ ：权值，



ELU图像：

![img](D:\blog\source\_drafts\论文学习-RBDN-Residual-Bottleneck-Dense-Network-for-Image-Super-Resolution\1.png)



- 融合了sigmoid和ReLU，左侧具有软饱和性，右侧无饱和性。
- 右侧线性部分使得ELU能够缓解梯度消失，而左侧软饱能够让ELU对输入变化或噪声更鲁棒。
- ELU的输出均值接近于零，所以收敛速度更快。
- 对于较深的网络，不加BN的ReLU网络会无法收敛，PReLU网络在MSRA的Fan-in初始化下会发散，而 ELU 网络在Fan-in/Fan-out下都能收敛，所以，ELU的鲁棒性更高





## RBDN

RBDN网络结构：

![image-20211207163815657](D:\blog\source\_drafts\论文学习-RBDN-Residual-Bottleneck-Dense-Network-for-Image-Super-Resolution\2.png)



其中，RBDN block的网络结构：

![image-20211208154509003](D:\blog\source\_drafts\论文学习-RBDN-Residual-Bottleneck-Dense-Network-for-Image-Super-Resolution\3.png)

![image-20211208154630936](D:\blog\source\_drafts\论文学习-RBDN-Residual-Bottleneck-Dense-Network-for-Image-Super-Resolution\4.png)



作者在RRBB中引入了瓶颈结构，即 $1 \times 1$ 卷积，减少了参数数量和计算数量。

> 具体参考论文：[]()

## 损失函数

作者采用如下损失函数：
$$
{\mathcal{L}}_{ {\rm{RBDN}}}={\mathcal{L}}_{ {\rm{per}}}+\alpha {\mathcal{L}}_{ {\rm{GAN}}}^{ {\rm{Ra}}}+\beta {\mathcal{L}}_{ {\rm{tv}}}+\gamma{\mathcal{L}}_{ {\rm{1}}}
$$
其中，

- ${\mathcal{L}}_{ {\rm{per}}}$ ：感知损失
- ${\mathcal{L}}_{ {\rm{GAN}}}^{ {\rm{Ra}}}$ ：生成器对抗损失
- ${\mathcal{L}}_{ {\rm{1}}}$ ：内容损失
- ${\mathcal{L}}_{ {\rm{tv}}}$ ：总变化损失

除了 ${\mathcal{L}}_{ {\rm{tv}}}$ ，其他三个损失函数的公式都与ESRGAN的相同



**总变化损失（Total-variation loss）**

总变化损失，主要用于抑制生成图像中的噪声。公式：
$$
{\mathcal{L}}_{ {\rm{tv}}}=\frac 1 N \sum_{i=1}^N \left( ||\nabla_h {\bf{G}}_{ {\rm{SR}}}(\hat{ {\bf{x}}_i})-\nabla_h({\bf{y}}_i)||_1 + ||\nabla_v {\bf{G}}_{ {\rm{SR}}} (\hat{ {\bf{x}}_i}) -\nabla_v({\bf{y}}_i)||_1 \right)
$$
其中，

- $\nabla_h ,\nabla_v$ ：分别为获取图片水平方向和垂直方向的梯度
- ${\bf{y}}_i$ ：真实图片
- ${\bf{G}}_{ {\rm{SR}}}(\hat{ {\bf{x}}_i})$ ：SR图片

> 具体参考论文：[Umer R M, Foresti G L, Micheloni C. Deep generative adversarial residual convolutional networks for real-world super-resolution[C]//Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition Workshops. 2020: 438-439.](https://openaccess.thecvf.com/content_CVPRW_2020/papers/w31/Umer_Deep_Generative_Adversarial_Residual_Convolutional_Networks_for_Real-World_Super-Resolution_CVPRW_2020_paper.pdf)





# 想法

1. 可继续关注一下总变化损失、密集连接的瓶颈块、ELU激活函数。

