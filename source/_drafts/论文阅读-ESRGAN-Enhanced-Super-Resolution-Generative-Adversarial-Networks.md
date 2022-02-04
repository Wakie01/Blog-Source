---
title: 论文阅读-ESRGAN_Enhanced Super-Resolution Generative Adversarial Networks
comment: true
date: 2021-11-23 10:01:01
tags:
categories:
addrlink:
---


# 论文介绍

Wang X, Yu K, Wu S, et al. Esrgan: Enhanced super-resolution generative adversarial networks[C]//Proceedings of the European conference on computer vision (ECCV) workshops. 2018: 0-0.

引用量：1374




# 动机

1. SRGAN所生成图像的纹理常常伴有伪影
2. 提高SR的整体感知质量






# 贡献

1. 提出增强型SRGAN（ESRGAN）

   



## ESRGAN

**生成器网络架构：**

![image-20211123102610669](D:\blog\source\_drafts\论文阅读-ESRGAN-Enhanced-Super-Resolution-Generative-Adversarial-Networks\1.png)

其中，Basic Block可采用residual block（RB）、dense block、RRDB

采用SRGAN中的residual block的话，则会将RB中的batch normalization（BN），实验证明，去除BN可提高性能。

在文章中，作者采用RRDB。

![image-20211123102919229](D:\blog\source\_drafts\论文阅读-ESRGAN-Enhanced-Super-Resolution-Generative-Adversarial-Networks\2.png)

值得注意的是，RRDB中的每一个稠密块（Dense Block），它是利用了DenseNet的思想，而稠密块与稠密块之间，则是利用了ResNet的思想。注意区分稠密连接与残差连接。

![img](D:\blog\source\_drafts\论文阅读-ESRGAN-Enhanced-Super-Resolution-Generative-Adversarial-Networks\6.png)





**相对判别器（Relativistic Discriminator）：** 

![image-20211123104201364](D:\blog\source\_drafts\论文阅读-ESRGAN-Enhanced-Super-Resolution-Generative-Adversarial-Networks\3.png)



SRGAN的是标准判别器（Standard Discriminator），其判断输入图片是否为真实图片。

公式：
$$
D(x)=\sigma \left( C(x) \right)
$$
其中

- $D$ ：标准判别器
- $x$ ：输入图片
- $\sigma(\cdot)$ ：sigmoid函数
- $C(\cdot)$ ：非变换判别器（non-transformed discriminator）的输出 



而在本文中，作者使用相对平均判别器（Relativistic Average Discriminator，RaD），其预测真实图像比假图像更真实的概率。

公式：


$$
\begin{align}
& D_{Ra}(x_r,x_f)=\sigma \left( C(x_r)-{\mathbb{E}}_{x_f}[C(x_f)] \right) \\
& \\
& D_{Ra}(x_f,x_r)=\sigma \left( C(x_f)-{\mathbb{E}}_{x_r}[C(x_r)] \right) \\
\end{align}
$$

其中

- $D_{Ra}$ ：相对平均判别器

- $x_r$ ：输入的真实图片，即 $x_i$ 对应的真实HR图像

- $x_f$ ：输入的假图片， $x_f=G(x_i)$ ， $x_i$ 表示输入的LR图像

- $\sigma(\cdot)$ ：sigmoid函数

  > sigmoid函数公式及图像：
  > $$
  > \sigma(x)=\frac 1 {1+e^{-x}}
  > $$
  > <img src="D:\blog\source\_drafts\论文阅读-ESRGAN-Enhanced-Super-Resolution-Generative-Adversarial-Networks\4.png" alt="img" style="zoom:80%;" />

- $C(\cdot)$ ：非变换判别器（non-transformed discriminator）的输出 

- ${\mathbb{E}}_{x_f}[\cdot]$ ：取mini-batch中所有fake data的平均。此外还有 ${\mathbb{E}}_{x_r}[\cdot]$ ，表示mini-batch中所有real data的平均

上面一式可理解为：$I^{GT}$ 的判别结果 $-$ 多个 $I^{HR}$ 的平均判别结果，并往 $1$ 方向进行优化，以此来增强判别器。

二式可理解为： $I^{HR}$ 的判别结果 $-$ 多个 $I^{GT}$ 的平均判别结果，并往 $0$ 方向进行优化，以此来增强生成器。



鉴别器的损失函数：
$$
L_D^{Ra}=-{\mathbb{E}}_{x_r}[log(D_{Ra}(x_r,x_f))]-{\mathbb{E}}_{x_f}[log(1-D_{Ra}(x_f,x_r))]
$$


生成器的对抗性损失函数：
$$
L_G^{Ra}=-{\mathbb{E}}_{x_r}[log(1-D_{Ra}(x_r,x_f))]-{\mathbb{E}}_{x_f}[log(D_{Ra}(x_f,x_r))]
$$





## 感知损失

本文中的感知损失计算与SRGAN的类似，不过作者发觉在激活前对特征进行约束会更有效，激活后会损失一些消息。且随着网络的不断深入和激活，特征消息会损失得更多。

![image-20211125100730074](D:\blog\source\_drafts\论文阅读-ESRGAN-Enhanced-Super-Resolution-Generative-Adversarial-Networks\5.png)



生成器总的损失函数：
$$
\begin{align}
& L_G=L_{percep}+\lambda L_G^{Ra} +\eta L_1 \\
& \\
& L_1={\mathbb{E}}_{x_i} ||G(x_i)-y ||_1
\end{align}
$$
其中，

- $L_1$ ：内容损失函数，评估恢复图像 $G(x_i)$ 与真实图像 $y$ 之间的像素1-范数距离，即PSNR
- $\lambda , \eta$ ：权值
- $L_{percep}$ ：感知损失，评估恢复图像与真实图像之间的特征图的差异



## 网络插值

虽然基于GAN的方法具有良好的感知质量，但它也有一些额外的噪声，为此，作者提出了以下策略：网络插值（Network Interpolation）



具体实现：

1. 先分别训练面向PSNR的网络： $G_{{\rm{PSNR}}}$ ，和基于GAN的网络： $G_{{\rm{GAN}}}$ 

2. 通过权值组合这两个网络中对应的参数，最终得到插值网络模型： $G_{{\rm{INTERP}}}$ 

   各个对应参数的计算公式：
   $$
   \theta_G^{\,{\rm{INTERP}}}=(1-\alpha) \; \theta_G^{\,{\rm{PSNR}}}+\alpha \; \theta_G^{\,{\rm{GAN}}}
   $$
   其中：

   - $\alpha$ ：权值， $\alpha \in [0,1]$ 
   - $\theta_G^{\,{\rm{INTERP}}} \;,\; \theta_G^{\,{\rm{PSNR}}} \;,\; \theta_G^{\,{\rm{GAN}}}$ ：分别为 $G_{{\rm{INTERP}}} \;,\; G_{{\rm{PSNR}}} \;,\; G_{{\rm{GAN}}}$ 网络模型中对应的参数



总的来说，该方法是用来平衡面向PSNR和基于GAN的方法的影响。





# 实验细节

**基本参数设置：**

1. 缩放因子（scaling factor）为4

2. 通过对HR图片双三次下采样来获取LR图片

3. 最小批量（mini-batch）为16

4. 裁剪的HR斑块的空间大小为 $128 \times 128$ 

   

**训练过程：**

1. 先训练面向PSNR的模型，损失函数为 $L_1$ 
2. 学习率初始化为 $2 \times 10^{-4}$ ，然后每更新 $2 \times 10^5$ 个小批量就减半
3. 训练好面向PSNR的模型后，将它作为生成器模型的初始值
4. 训练生成器时，使用 $L_G$ 损失函数，其中 $\eta=1 \times 10^{-2} \;,\; \lambda=5\times10^{-3}$ 
5. 学习率初始化为 $1 \times 10^{-4}$ ，每当迭代次数到达以下值时 $[50k,100k,200k,300k]$ ，学习率减半



**优化器：**

1. 使用Adam优化器，参数设置： $\beta_1=0.9 \,,\, \beta_2=0.999$ 
2. 交替地更新生成器和鉴别器网络，直到模型收敛



















