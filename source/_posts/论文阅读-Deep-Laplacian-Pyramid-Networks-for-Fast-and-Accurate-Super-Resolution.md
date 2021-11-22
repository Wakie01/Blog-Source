---
title: 论文阅读-Deep Laplacian Pyramid Networks for Fast and Accurate Super-Resolution
tags: SR
categories: Paper
comment: true
addrlink: 1130
date: 2021-11-09 10:20:08
---


# 论文介绍

W. Lai, J. Huang, N. Ahuja and M. Yang, "Deep Laplacian Pyramid Networks for Fast and Accurate Super-Resolution," 2017 IEEE Conference on Computer Vision and Pattern Recognition (CVPR), 2017, pp. 5835-5843, doi: 10.1109/CVPR.2017.618.

引用量：1485



# 动机

1. 以往的上采样方法是双三次插值，计算复杂度较大，且常会导致可见的重建伪影。还有的上采样方法是亚像素卷积、转置卷积，这些方法使用相对较小的网络，无法很好地学习复杂的映射。
2. 以往的使用MSE ${\mathcal{L}}_2$ 损失函数，${\mathcal{L}}_2$ 会产生模糊的预测， 且无法捕捉HR图像片段的多模态分布（即：一个LR图像片段可能对应着多个HR图像片段），还有重建的图像通常会过于光滑，视觉感知较低。
3. 以往模型的上采样都只有一步，这增加了训练大比例因子的难度。
4. 目前没有模型会逐步生成SR预测图像，因此，对于不同的放大比例，就要训练不同的模型。
5. 以往的网络模型层数较小，所以重建质量不太行。





# 贡献

1. 提出了LapSRN（Laplacian Pyramid Super-Resolution Network）模型

   



## LapSRN模型

<img src=".\论文阅读-Deep-Laplacian-Pyramid-Networks-for-Fast-and-Accurate-Super-Resolution\1.png" alt="image-20211109111436021" style="zoom:80%;" />



### 网络结构

LapSRN的网络结构基于拉普拉斯金字塔网络。

其并采用逐层放大图像，每层子网络只对图像放大两倍（比如，若要对LR图像超分放大8倍，就要3层子网络）。

设LapSRN的比例因子为S，则LapSRN有 $log_2 S$ 层子网络，设 $s$ 为LapSRN里的其中一层子网络。

此外，LapSRN采用二分支网络结构，分别是：特征提取和图像重建。



<img src=".\论文阅读-Deep-Laplacian-Pyramid-Networks-for-Fast-and-Accurate-Super-Resolution\2.png" alt="image-20211111150720075" style="zoom: 67%;" />

红色箭头表示卷积，蓝色箭头表示转置卷积，绿色箭头表示元素加法操作





**特征提取分支：**

在 $s$ 子网络中，特征提取分支内有 $d$ 个卷积层和一个转置卷积层，分别用作特征提取和对特征进行上采样放大2倍。

最后该子网络会向图像重建分支输出一个特征图。



此外，较低级别的特征表示与较高级别共享，藉此增加网络的非线性，以便在更精细的级别学习复杂的映射。



**图像重建分支：**

在 $s$ 子网络中，图像重建分支内有一个转置卷积层，用于将输入图像上采样放大2倍。

接着该子网络会对完成上采样的图像和特征提取分支输出的特征图进行元素相加，得到该子网络最终超分2倍的图像。

最后将该图像输出到特征提取分支上，继续做特征提取；而在图像重建分支上则继续做图像重建。



此外，该分支的转置卷积层，使用双线性内核初始化，并允许它与所有其他层一起进行联合优化。

> 双线性内核初始化：





### 损失函数

作者的目标是学习一个超分函数：
$$
\hat{y}=f(x;\theta)
$$
其中：

- $x$ ：输入的LR图像
- $\theta$ ：网络参数
- $\hat{y}$ ：生成的HR图像



作者使用鲁棒性更高的Charbonnier损失函数。公式：
$$
\begin{align}
	 {\scr{L}}(\hat{y},y; \theta) & =\frac 1 N \sum_{i=1}^N \sum_{s=1}^L \rho \left( \hat{y}_s^{(i)} - y_s^{(i)} \right)  \\
    & \\
    & =\frac 1 N \sum_{i=1}^N \sum_{s=1}^L \rho \left( (\hat{y}_s^{(i)} - x_s^{(i)}) - r_s^{(i)} \right)  \\
\end{align}
$$

其中：

- $s$ ：第 $s$ 层子网络

- $x_s$ ：第s层子网络中的图像重建分支中上采样生成图像
- $r_s$ ：第s层子网络生成的残差图像（即：图像特征）
-  $\hat{y}_s$ ：第 $s$ 层子网络生成的HR图像，即： $\hat{y}_s=x_s+r_s$ 
- $y_s$ ：第s层子网络对应的真实HR图像，作者是对真实HR图像进行双三次下采样得到 $y_s$ 
- $\rho$ ：Charbonnier惩罚函数， $\rho(x)=\sqrt{x^2 + \epsilon^2}$ ，$\epsilon$ 是一个偏差值，常取0.001
- $L$ ：金字塔的层数，即子网络的个数
- $N$ ：每一层中的训练样本的个数



其实，Charbonnier损失函数就是一个变异版的RMSE损失函数。





### 实现细节

1. 每一个卷积层都是由64个 $3 \times 3$ 的卷积核组成，对卷积核的初始化采用下面文献中的权重初始化策略

   > [1] He K ,  Zhang X ,  Ren S , et al. Delving Deep into Rectifiers: Surpassing Human-Level Performance on ImageNet Classification[J]. IEEE Computer Society, 2015.
   >
   > 该文献中的权重初始化策略：

2. 转置卷积层由一个 $4 \times 4$ 的卷积核组成，并通过双线性滤波器进行初始化

3. 所有的卷积层和转置卷积层都采用LReLUs（Leaky Rectified Linear Units）激活函数，斜率为0.2

4. 为了保持特征图像与输入图像大小相同，在卷积前，先在边界周围填充0

5. 采用291张图片作为训练集

6. 在每个训练批中，随机抽取64张 $128 \times 128$ 的图片，然后一个epoch有1000个反向传播的迭代

7.  通过以下三种方式对训练样本作数据增强：

   - 缩放：在[0.5，1.0]之间随机向下缩放
   - 旋转：随机旋转图像90度、180度，或 270度
   - 翻转：以0.5的概率水平或垂直翻转图像

8. 通过双三次下采样训练样本来生成对应的LR图像

9. 设置动量参数（momentum）为0.9，权重衰减（weight decay）为0.001

10. 所有层的学习率（learning rate）初始化为0.0001，然后每50epoch减少2倍





## 实验结果

**pyramid、residual、Charbonnier分析：**

LapSRN与LapSRN分别去掉金字塔结构、残差学习、Charbonnier损失函数，以及SRCNN、FSRCNN的结果分析（训练集：SET14；比例因子：4）：

<img src=".\论文阅读-Deep-Laplacian-Pyramid-Networks-for-Fast-and-Accurate-Super-Resolution\3.png" alt="image-20211112105350786" style="zoom:80%;" />

<img src=".\论文阅读-Deep-Laplacian-Pyramid-Networks-for-Fast-and-Accurate-Super-Resolution\4.png" alt="image-20211112110022289" style="zoom:80%;" />

<img src=".\论文阅读-Deep-Laplacian-Pyramid-Networks-for-Fast-and-Accurate-Super-Resolution\5.png" alt="image-20211112110227115" style="zoom:80%;" />



**深度分析：**

深度与时间的分析：

<img src=".\论文阅读-Deep-Laplacian-Pyramid-Networks-for-Fast-and-Accurate-Super-Resolution\6.png" alt="11" style="zoom:80%;" />

关于深度与时间的平衡，作者认为：

- 对于 $2 \times {\rm{SR}}$ 和 $4 \times {\rm{SR}}$ ，每一子网络深度为10是最好的
- 对于 $8 \times {\rm{SR}}$ ，每一子网络深度为5是最好的



![image-20211112111624950](.\论文阅读-Deep-Laplacian-Pyramid-Networks-for-Fast-and-Accurate-Super-Resolution\7.png)



**伪影分析：**

与FSRCNN、VDSR比较，LapSRN重建的HR图像没有环形伪影的轨道：

![image-20211112112232800](.\论文阅读-Deep-Laplacian-Pyramid-Networks-for-Fast-and-Accurate-Super-Resolution\8.png)




# 不足

1. LapSRN产生的HR图像不够精细：

   ![image-20211112112423400](.\论文阅读-Deep-Laplacian-Pyramid-Networks-for-Fast-and-Accurate-Super-Resolution\9.png)

2. 模型相对较大，参数数量较大，对此，作者建议用递归层代替每一层的深度卷积层。



# 想法

1. 在每一个子网络中卷积是否采用残差（是的）
2. 在得到相应比例因子的真实HR图像上，作者采用的是双三次下采样方法，有没有更好的
3. 上采样用更好的方法，如亚像素上采样

