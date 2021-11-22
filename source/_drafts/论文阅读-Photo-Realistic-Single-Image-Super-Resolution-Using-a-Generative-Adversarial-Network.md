---

title: >-
  论文阅读-Photo-Realistic Single Image Super-Resolution Using a Generative
  Adversarial Network
comment: true
date: 2021-11-19 10:28:24
tags:
categories:
addrlink:
---


# 论文简介

Ledig C ,  Theis L ,  F  Huszar, et al. Photo-Realistic Single Image Super-Resolution Using a Generative Adversarial Network[C]// IEEE Computer Society. IEEE Computer Society, 2016.



引用量：6721



# 动机

1. 现有的基于CNN的SR网络，在较大的放大因子下，无法恢复较细的纹理细节
2. 现有的损失函数是基于像素级别差异的PSNR，它虽然能取得较高的峰值信噪比，但它通常缺乏高频细节，在感知上不令人满意
3. 





# 贡献

1. 基于生成对抗网络（GAN），提出SRGAN

   > 生成对抗网络（GAN）论文：
   >
   > [Goodfellow I, Pouget-Abadie J, Mirza M, et al. Generative adversarial nets[J]. Advances in neural information processing systems, 2014, 27.](https://proceedings.neurips.cc/paper/2014/hash/5ca3e9b122f61f8f06494c97b1afccf3-Abstract.html)
   >
   > 引用量：36870

2. 提出感知损失函数





## SRGAN

![image-20211119150855229](./论文阅读-Photo-Realistic-Single-Image-Super-Resolution-Using-a-Generative-Adversarial-Network/1.png)



### 生成器

生成器网络如下图所示：

![image-20211119153017205](D:\blog\source\_drafts\论文阅读-Photo-Realistic-Single-Image-Super-Resolution-Using-a-Generative-Adversarial-Network\2.png)



**B残差块：**

B残差块由5个相同的小模块组成，其中每个小模块间都具有了残差的思想。

每个小模块又由以下6层组成：

1. 卷积层，尺寸： $64 \times 3 \times 3$

2. 批量归一化层（BN），

   > 关于BN的论文：
   >
   > [Ioffe S, Szegedy C. Batch normalization: Accelerating deep network training by reducing internal covariate shift[C]//International conference on machine learning. PMLR, 2015: 448-456.](https://arxiv.org/abs/1502.03167)
   >
   > 引用量：31685

3. ParametricReLU激活函数

   > ParametricReLU（PReLU）激活函数，ReLU的改进版，公式：
   > $$
   > PReLU(x)=
   > 	\begin{cases}
   > 		x \;, &  x>0 \\
   > 		\alpha \, x \; , & x \leq 0
   > 	\end{cases}
   > $$
   > 其中， $\alpha$ 为可学习的，0到1之间的数。
   >
   > 值得注意的是：
   >
   > - 若 $\alpha=0$ ，则 $PReLU$ 就变为 $ReLU$ 了
   > - 若 $\alpha > 0$ ，则 $PReLU$ 就变为 $Leaky \; ReLU$ 了

4. 卷积层，尺寸： $64 \times 3 \times 3$ 

5. 批量归一化层（BN），

6. Elementwise Sum，求和









## 实践细节

1. 对高分辨率图像 $I^{HR}$ 进行高斯滤波器下采样，得到低分辨率图像 $I^{LR}$ ，缩放因子为 $r$ 
2. 







# 结论



# 想法

1. 尽管生成的图像看起来逼真，但补偿的高频细节（如图像边缘）可能会导致与HR地面真实图像不一致