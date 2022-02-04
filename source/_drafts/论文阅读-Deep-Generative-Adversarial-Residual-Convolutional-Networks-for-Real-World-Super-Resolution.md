---
title: >-
  论文阅读-Deep Generative Adversarial Residual Convolutional Networks for
  Real-World Super-Resolution
comment: true
date: 2021-12-10 15:27:56
tags:
categories:
addrlink:
---

# 简介

Umer R M, Foresti G L, Micheloni C. Deep generative adversarial residual convolutional networks for real-world super-resolution[C]//Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition Workshops. 2020: 438-439.

引用量：19



# 动机

1. 以前的LR图像是通过双三次下采样获取的，而该方法得到的LR图像是干净的，几乎没有噪音，无法很好地概括自然图像特征，因为真实世界LR图像中的退化要复杂得多。
2. 现有的SR方法通常从大量的训练数据中训练较深\较宽的网络，存在大量的网络参数和内存占用，不容易部署在智能手机的摄像头



# 贡献

1. 提出了一种深度超分剩余卷积生成对抗网络（SRResCGAN），用于获取遵循真实世界退化设置的LR图像





## 图像退化

图像退化，即将HR图像转变为LR图像的过程。

通常，图像退化的过程可描述为以下公式：
$$
{\bf{Y}}={\bf{H}} \, \tilde{{\bf{X}}}+ \eta
$$
其中，

- ${\bf{Y}}$ ：指LR图像， ${\bf{Y}} \in {\mathbb{R}}^{\frac N s \times \frac N s}$ 
- $N$ ：图像总的像素
- $s$ ：缩放因子
- ${\bf{H}}$ ：下采样操作符， ${\bf{H}} \in {\mathbb{R}}^{\frac N s \times \frac N s}$ 
- $\tilde{{\bf{X}}}$ ：HR图像，$\tilde{{\bf{X}}} \in {\mathbb{R}}^{N \times N}$ 
- $\eta$ ：标准偏差为 $\sigma$ 的高斯白噪声（white Gaussian noise）



然而在现实世界中， $\eta$ 还可认为是图像退化过程中所遇到的所有可能的误差，如传感器噪声、随机噪声、压缩伪影等等。

因此，由于未知噪声 $\eta$ 的存在， ${\bf{H}}$ 通常是病态的。

为此，作者提出了DSGAN网络（ ${\bf{G}}_d$ ），用于下采样图像。



## 问题公式化

SISR的过程可描述为下列公式：
$$
\hat{{\bf{E}}}({\bf{X}})={\rm{arg}}_{{\bf{X}}}{\rm{min}}\frac 1 2 ||{\bf{Y}}-{\bf{H}}{\bf{X}}||_2^2+\lambda {\bf{R}}_W({\bf{X}})
$$
其中，

- $\frac 1 2 ||{\bf{Y}}-{\bf{H}}{\bf{X}}||_2^2$ ：数据保真度，用于检测 ${\bf{Y}}$ 与 ${\bf{HX}}$ 的相似度
- ${\bf{Y}}$ ：指LR图像， ${\bf{Y}} \in {\mathbb{R}}^{\frac N s \times \frac N s}$ 
- ${\bf{X}}$ ：指SR图像
- ${\bf{H}}$ ：下采样操作符
- ${\bf{R}}_W({\bf{X}})$ ：与图像优先级关联的正则化项
- $\lambda$ ：权重值，用于控制数据保真度和正则化项之间的折衷



与图像优先级关联的正则化项，其一般为：
$$
{\bf{R}}_W({\bf{X}})=\sum_{k=1}^K \rho_k({\bf{L}}_k{\bf{X}})
$$
其中，

- ${\bf{L}}$ ：一阶或更高阶微分线性算子，如梯度
- $\rho(\cdot)$ ：势函数，作用于滤波输出
- ${\bf{R}}_W({\bf{X}})$ 现在常用深度卷积神经网络实现，$W$ 是网络的参数





## 网络总览

![image-20211211111415877](D:\blog\source\_drafts\论文阅读-Deep-Generative-Adversarial-Residual-Convolutional-Networks-for-Real-World-Super-Resolution\1.png)







## 源域学习模块（DSGAN）

源域学习（学习域损坏）是用于下采样的。

**损失函数：**

作者设计了一个基于GAN的网络来学习学习域分布损坏，其损失函数如下：
$$
{\mathcal{L}}_{{\bf{G}}_d}={\mathcal{L}}_{color}+0.005 \cdot {\mathcal{L}}_{tex}+0.01 \cdot {\mathcal{L}}_{per}
$$
其中，

- ${\mathcal{L}}_{color}$ ：如 ${\mathcal{L}}_1$ ，关注图像的低频率
- ${\mathcal{L}}_{tex}$ ：纹理损失，关注图像的高频率
- ${\mathcal{L}}_{per}$ ：感知损失，基于VGG网络



**生成器网络（ ${\bf{G}}_d$ ）：**

${\bf{G}}_d$ 由8个残差块组成，

其中每个残差块均由2个卷积层和1个PReLU组成，PReLU位于两个卷积层中间

而这8个残差块又夹在2个卷积层之间

最后通过sigmod激活函数输出。

所有卷积层的卷积核都是 $3\times3$ ，并支持64层通道



**判别器网络（ ${\bf{D}}_x$ ）：**

- ${\bf{D}}_x$ 由一个运行于patch level的3层卷积网络组成，
- 所有卷积层的卷积核都为 $5\times5$ ，并支持64到256层通道
- 每次卷积过后，都应用BN（Batch Norm）层和LReLU层激活
- 最后一层卷积为256通道到1通道



**训练策略：**

- 用 $512\times512$ 的图像块来训练 ${\bf{G}}_d$ ，





## SR学习模块（SRResCGAN）

### 损失函数

作者用以下损失函数训练 ${\bf{G}}_{SR}$ ：
$$
{\mathcal{L}}_{G_{SR}}={\mathcal{L}}_{per}+{\mathcal{L}}_{GAN}+{\mathcal{L}}_{tv}+10 \cdot {\mathcal{L}}_1
$$
其中，

- ${\mathcal{L}}_{per}$ ：感知损失
- ${\mathcal{L}}_{GAN}$ ：纹理损失
- ${\mathcal{L}}_{tv}$ ：总变化（total-variation）损失
- ${\mathcal{L}}_1$ ：内容损失



**感知损失：**
$$
{\mathcal{L}}_{per}=\frac 1 N \sum_i^N {\mathcal{L}}_{VGG}=\frac 1 N \sum_i^N ||\phi \left( {\bf{G}}_{SR}(\hat{{\bf{x}}_i}) \right)-\phi({\bf{y}}_i)||_1
$$
其中，

- $\phi$ ：特征提取运算符，提取网络为VGG19，与ESRGAN相同





**纹理损失：**
$$
{\mathcal{L}}_{GAN}={\mathcal{L}}_{RaGAN}=-{\mathbb{E}}_{{\bf{y}}}[log(1-{\bf{D}}_{{\bf{y}}}({\bf{y}},{\bf{G}}_{SR}(\hat{{\bf{x}}})))]-{\mathbb{E}}_{\hat{{\bf{y}}}}[log({\bf{D}}_{{\bf{y}}}({\bf{G}}_{SR}(\hat{{\bf{x}}}),{\bf{y}}))]
$$


### 网络架构

![image-20211220110212490](D:\blog\source\_drafts\论文阅读-Deep-Generative-Adversarial-Residual-Convolutional-Networks-for-Real-World-Super-Resolution\2.png)



### 生成器

![image-20211231100738226](D:\blog\source\_drafts\论文阅读-Deep-Generative-Adversarial-Residual-Convolutional-Networks-for-Real-World-Super-Resolution\4.png)

- Upsample层的内核采用双线性内核（上采样内核的选择是任意的）
- Resnet模块由5个残差块（residual block）组成，其中每个残差块由两个预激活的卷积层组成：
  1. PReLU，
  2. Conv，$3 \times 3$ ，C=64
  3. PReLU
  4. Conv，$3 \times 3$ ，C=64
- 投射层（Proj）：



> **PReLU（ Parametrized Rectified Linear Unit）：**
> $$
> PReLU(x_i)=
> 	\begin{cases}
> 		x_i &,x_i>0 \\
>         a_ix_i &,x_i \leq 0
> 	\end{cases}
> $$
> ![image-20211231103919992](D:\blog\source\_drafts\论文阅读-Deep-Generative-Adversarial-Residual-Convolutional-Networks-for-Real-World-Super-Resolution\5.png)
>
> 在这里，$a_i$ 是可学习的。



### 判别器

![image-20211229162359228](D:\blog\source\_drafts\论文阅读-Deep-Generative-Adversarial-Residual-Convolutional-Networks-for-Real-World-Super-Resolution\3.png)

本文中所用的判别器与SRGAN相同





## 训练细节

- 输入的LR图像尺寸为 $32 \times 32$ 
- batch size为16
- 每个epoch训练51000次
- 生成器和判别器都使用Adam优化器，其中 $\beta_1=0.9$ ， $\beta_2=0.999$ ，$\epsilon=10^{-8}$ ，且不需要权值衰减
- 学习率初始化为 $10^{-4}$ ，并分别在5K、10K、20K、30K次迭代时减半
- 投射层的参数 $\sigma$ 通过输入的LR图像进行估计，其理论根据是 [Liu X, Tanaka M, Okutomi M. Single-image noise level estimation for blind denoising[J]. IEEE transactions on image processing, 2013, 22(12): 5226-5237.](http://www.ok.sc.e.titech.ac.jp/res/NLE/TIP2013-noise-level-estimation06607209.pdf) 
- 初始化投射层参数 $\alpha$ 





## 数据集

- 作者使用 [NTIRE2020 Real-World Super-resolution (RWSR) Challenge track1](https://competitions.codalab.org/competitions/22220) 数据集来训练DSGAN
- 然后用已训练的DSGAN来生成对应的HR图像与LR图像，从而训练SRResCGAN







## 评价指标

在本文中，作者用到了三个指标：

1. PSNR（Peak Signal-to-Noise Ratio）
2. SSIM（Structural Similarity）
3. LPIPS

前两个都是越大越好，第三个是越小越好

PSNR和SSIM是基于失真的度量，与实际感知的相似性相关性较差，而LPIPS与人类感知的相关性则优于基于失真/手工制作的度量。 

