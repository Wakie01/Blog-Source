---
title: 论文阅读-Deep Learning for Image Super-Resolution-A Survey
comment: true
date: 2021-10-29 15:00:20
tags:
categories:
addrlink:
---



基于深度学习的SR方法，从早期的基于CNN到近年来基于生成对抗网络（Generative Adversarial Nets，GAN）

|  方法   | 网络  |                             论文                             | cites |
| :-----: | :---: | :----------------------------------------------------------: | ----- |
| 基于CNN | SRCNN | [1] Chao Dong, Chen Change Loy, Kaiming He, Xiaoou Tang: Image Super-Resolution Using Deep Convolutional Networks. IEEE Trans. Pattern Anal. Mach. Intell. 38(2): 295-307 (2016) | 5360  |
| 基于GAN | SRGAN | [1] Ledig C ,  Theis L ,  F  Huszar, et al. Photo-Realistic Single Image Super-Resolution Using a Generative Adversarial Network[C]// IEEE Computer Society. IEEE Computer Society, 2016. | 6721  |



一般来说，基于深度学习的SR方法之间，主要是以下三点的不同：

1. 网络结构的不同
2. 损失函数的不同
3. 学习策略的不同



基于深度学习的SR方法的分类：

![image-20211029153316219](D:\blog\source\_drafts\论文阅读-Deep-Learning-for-Image-Super-Resolution-A-Survey\1.png)





SR方法中常用的数据集：

![image-20211029161536378](D:\blog\source\_drafts\论文阅读-Deep-Learning-for-Image-Super-Resolution-A-Survey\2.png)





# 图像质量评价

图像质量评价（Image Quality Assessment，IQA）

IQA主要分为主观类和客观类，客观类是最最最常用的。其中客观类的又分为3种类型：

1. 使用参考图像执行评估的完全参考方法
2. 基于提取特征比较的简化参考方法
3. 没有任何参考图像的无参考方法，即：盲IQA





## 峰值信噪比

峰值信噪比（Peek Signal-to-Noise Ratio，PSNR）

它常用于评价图片有损变换的质量好坏。

计算公式：
$$
PSNR=10 \times log_{10} \left( \frac {L^2} {\frac 1 N \sum _{i=1} ^N \left( I(i)- \hat{I}(i) \right) ^2} \right)
$$
其中：

- $L$ ：最大像素值
- $I$ ：真实图像
- $\hat{I}$ ：超分生成图像
- $N$ ：像素点



显然，PSNR只关注对应像素之间的差异，而不是视觉感知。





## 结构相似性

结构相似性（Structural Similarity，SSMI）

SSMI基于亮度、对比度和结构方面的独立比较，度量图像之间的结构相似性，比较好地满足了感知评估的要求，它与PSNR一样非常常用。



首先，对于 $N$ 像素的图片 $I$，亮度 $\mu_I$ 和对比度 $\sigma _I$ 的计算公式分别为：
$$
\begin{align}
	& \mu_I=\frac 1 N \sum_{i=1} ^N I(i) \\
	& \sigma_I=\left( \frac 1 {N-1} \sum_{i=1} ^N \left(I(i)-\mu_I \right)^2 \right)^{\frac 1 2}
\end{align}
$$
其中：

- $I(i)$ ：图片 $I$ 在第 $i$ 像素的亮度

- $\mu_I$ 相当于：图片 $I$ 中，所有像素点的亮度的平均值

- $\sigma_I$ 相当于：图片 $I$ 中，所有像素点的亮度与平均亮度的均值平方差。



然后，亮度的比较 $C_l(I,\hat{I})$ 和对比度的比较 $C_c(I,\hat{I})$ 的计算公式分别是：
$$
\begin{align}
	& C_l(I,\hat{I})=\frac {2 \mu_I \mu_{\hat{I}}+C_1} {\mu_I^2+ \mu_{\hat{I}}^2+C_1}  \\
	& \\ 
	& C_c(I,\hat{I})=\frac {2 \sigma_I \sigma_{\hat{I}}+C_2} {\sigma_I^2 + \sigma_{\hat{I}}^2 + C_2}
\end{align}
$$

其中，$C_1$ 和 $C_2$ 是避免不稳定的常数：
$$
\begin{align}
	& C_1=(k_1 L)^2  \\
	& \\
	& C_2=(k_2 L)^2  \\
\end{align}
$$
其中：

- $k_1 \ll 1 , \quad k_2 \ll 1$ ， $\ll$ 是远小于的意思。
- $L$ ：最大像素值



接着就是结构的比较 $C_s(I,\hat{I})$ 的计算公式：
$$
\begin{align}
	& \sigma_{I,\hat{I}}=\frac {1} {N-1} \sum_{i=1} ^{N} \left( I(i) - \mu_I \right) \left( \hat{I}(i) - \mu_{\hat{I}} \right) \\
    & \\
    & C_s(I,\hat{I})=\frac {\sigma_{I,\hat{I}}+C_3} {\sigma_I \sigma_{\hat{I}}+C_3}
\end{align}
$$
其中，

- $C_3$ ：稳定因子，常设为： $C_2/2$
- $\sigma_{I,\hat{I}}$ ：$I$ 与$\hat{I}$ 之间的协方差



最后，SSIM的计算公式：
$$
{\rm{SSIM}}(I,\hat{I})=[C_l(I,\hat{I})]^{\alpha} * [C_c(I,\hat{I})]^{\beta} * [C_s(I,\hat{I})]^{\gamma}
$$
其中：$\alpha, \beta, \gamma$ 分别是亮度比较、对比度比较、结构比较的调整因子。





## 平均意见分数

平均意见分数（Mean Opinion Score，MOS）

MOS是一种常用的主观IQA方法，要求人类评分员为测试图像分配感知质量评分。





# 图像通道

现在处理的图像通常都是RGB三通道的

而在早年，SR还常处理YCbCr的图片，它也是三通道，分别为Y、Cb、Cr，分别表示亮度、蓝差值、红差值。但那时的SR只处理Y通道。





# 基于有监督学习的SR

不同SR模型之间或许差异会很大，但它们本质上是一组组件的组合，如模型框架、上采样方法、网络设计和学习策略等等。



## SR框架

由于SR是一个不适定问题，因此，如何进行上采样是个关键的问题。

> **不适定问题（ill-posed problem）：** 
>
> 适定问题(well-posed problem)和不适定问题(ill-posed problem)都是数学领域的术语。
>
> 前者需要满足三个条件，若有一个不满足，则为不适定问题：
>
> 1. a solution exists，解必须存在
> 2. the solution is unique ，解必须唯一
> 3. the solution's behavior changes continuously with the initial conditions.   解能根据初始条件连续变化



基于所采用的上采样操作及其在模型中的位置，SR框架可归纳为四种：

1. 预上采样SR框架
2. 后上采样SR框架
3. 渐进式上采样SR框架
4. 迭代上下采样SR框架

<img src="D:\blog\source\_drafts\论文阅读-Deep-Learning-for-Image-Super-Resolution-A-Survey\3.png" alt="image-20211030154610915" style="zoom:80%;" />



### 预上采样SR框架

预上采样的SR框架，主要思路是：使用传统方法将LR图像上采样为具有所需大小的粗略HR图像，然后对这些图像应用深度CNN以重建高质量细节。

- 优点：简单
- 缺点：
  - 可能会出现噪声放大和模糊，
  - 大多数操作是在高维空间中执行的，因此时间和空间成本比其他框架高得多



|                           经典论文                           | cites |
| :----------------------------------------------------------: | ----- |
| [1] Tai Y ,  Yang J ,  Liu X , et al. MemNet: A Persistent Memory Network for Image Restoration[C]// IEEE International Conference on Computer Vision. IEEE Computer Society, 2017. | 972   |
| [1] Ying T ,  Jian Y ,  Liu X . Image Super-Resolution via Deep Recursive Residual Network[C]// IEEE Conference on Computer Vision & Pattern Recognition. IEEE, 2017. | 1307  |
| [1] Kim J ,  Lee J K ,  Lee K M . Deeply-Recursive Convolutional Network for Image Super-Resolution[C]// 2016 IEEE Conference on Computer Vision and Pattern Recognition (CVPR). IEEE, 2016. | 1856  |
| [1] Shocher A ,  Cohen N ,  Irani M . Zero-Shot Super-Resolution Using Deep Internal Learning[C]// 2018 IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR). IEEE, 2018. | 362   |





### 后上采样SR框架

后上采样SR框架，是相对预上采样来进行优化的。

该框架，先优化LR图像，再对LR图像上采样为HR图像。同时，该框架的上采样模块采用端到端可学习的上采样层。

- 优点：
  - 时间和空间成本较小
  - 上采样效果更好
- 缺点：
  - 上采样仅在一个步骤中执行，增加了大比例因子（例如，4、8）的学习难度
  - 上采样层不能满足多尺度的需求（每个比例因子都要训练一个单独的上采样层）



总的来说，后上采样SR框架是非常主流的。



|                           经典论文                           |      |
| :----------------------------------------------------------: | ---- |
| [1] Ledig C ,  Theis L ,  F  Huszar, et al. Photo-Realistic Single Image Super-Resolution Using a Generative Adversarial Network[C]// IEEE Computer Society. IEEE Computer Society, 2016. | 6721 |
| [1] Lim B ,  Son S ,  Kim H , et al. Enhanced Deep Residual Networks for Single Image Super-Resolution[C]// 2017 IEEE Conference on Computer Vision and Pattern Recognition Workshops (CVPRW). IEEE, 2017. | 2837 |
| [1] Tong T ,  Li G ,  Liu X , et al. Image Super-Resolution Using Dense Skip Connections[C]// IEEE International Conference on Computer Vision. IEEE Computer Society, 2017. | 761  |
| [1] Wei H ,  Chang S ,  Ding L , et al. Image Super-Resolution via Dual-State Recurrent Networks[C]// IEEE/CVF Conference on Computer Vision & Pattern Recognition. IEEE, 2018. | 145  |



### 渐进式上采样SR框架

渐进式上采样SR框架，就是为了优化后上采样SR框架无法满足多尺度的需求。

该框架下的模型基于CNN级联，并逐步重建更高分辨率的图像。在每个阶段，图像被上采样到更高的分辨率，并通过CNN进行细化。

该框架主要用到了拉普拉斯金字塔。



- 优点：通过将困难任务分解为简单任务，该框架下的模型极大地降低了学习难度，尤其是在大因素下，并且在不引入过多空间和时间成本的情况下处理多尺度SR。

- 缺点：多阶段模型设计复杂，训练稳定性差，需要更多的建模指导和更先进的训练策略。



| 网络      | 论文                                                         | cites |
| --------- | ------------------------------------------------------------ | ----- |
| LapSRN    | [1] Lai W S ,  Huang J B ,  Ahuja N , et al. Deep Laplacian Pyramid Networks for Fast and Accurate Super-Resolution[C]// IEEE Conference on Computer Vision & Pattern Recognition. IEEE Computer Society, 2017:5835-5843. | 1481  |
| MS-LapSRN | [1] Lai W S ,  Huang J B ,  Ahuja N , et al. Fast and Accurate Image Super-Resolution with Deep Laplacian Pyramid Networks[J]. IEEE Transactions on Pattern Analysis and Machine Intelligence, 2017. | 351   |
| ProSR     | [1] Wang Y ,  Perazzi F ,  Mcwilliams B , et al. A Fully Progressive Approach to Single-Image Super-Resolution[J]. 2018 IEEE/CVF Conference on Computer Vision and Pattern Recognition Workshops (CVPRW), 2018. | 158   |



### 迭代上下采样SR框架

为了捕捉LR-HR图像对中的相互依赖性，该框架加上了“反投影”的组件。它迭代地应用反投影细化，计算重建误差，然后将其融合回去以调整HR图像强度。

> **图像强度（Image Intensity）：** 图像每个通道中的灰度值。



该框架下的模型能更好地挖掘LR-HR图像对之间的深层关系，从而提供更高质量的重建结果。

然而，反投影模块的设计标准目前仍不清楚。由于这一机制刚刚被引入到基于深度学习的SR中，因此该框架具有很大的潜力。



| 网络  |                             论文                             | cites |
| :---: | :----------------------------------------------------------: | ----- |
| DBPN  | [1] Haris M ,  Shakhnarovich G ,  Ukita N . Deep Back-Projection Networks For Super-Resolution[J]. arXiv, 2018. | 839   |
| SRFBN | [1] Li Z ,  Yang J ,  Liu Z , et al. Feedback Network for Image Super-Resolution[C]// 2019 IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR). IEEE, 2019. | 349   |



## 上采样方法

上采样方法主要分为两大类：

1. 基于插值的上采样（Interpolation-Based Upsampling）
2. 基于学习的上采样（Learning-Based Upsampling）



其中基于插值的上采样方法，主要就三种：

1. 最近邻插值法（Nearest-Neighbor Interpolation）
2. 双线性插值（Bilinear Interpolation）
3. 双三次插值（Bicubic Interpolation）

这三种传统的插值方法在另一个笔记中有记到。

基于插值的上采样方法仅基于其自身的图像信号来提高图像分辨率，而不会带来任何更多信息。相反，它们通常会带来一些副作用，例如计算复杂度、噪声放大、结果模糊。因此，当前的趋势是用可学习的上采样层取代基于插值的方法。





### 基于学习的上采样

如今最常用的是基于学习的上采样，其思路是：克服基于插值的方法的缺点，以端到端的方式学习上采样。

它们通常用于最终上采样阶段



#### 转置卷积层

转置卷积层（Transposed Convolution Layer），也称：反卷积层（Deconvolution Layer）

> 假设卷积核尺寸为 $k \times k$ ，步长stripe为s，填充padding为p，
>
> 转置卷积运算步骤：
>
> 1. 在输入特征图元素间填充s-1行和列为0
> 2. 在输入特征图四周填充k-p-1行和列为0
> 3. 将卷积核参数上下、左右翻转
> 4. 做填充为0，步长为1的卷积运算
>
>  <table style="width:100%; table-layout:fixed;">
>   <tr>
>     <td><img width="150px" src=".\论文阅读-Deep-Learning-for-Image-Super-Resolution-A-Survey/no_padding_no_strides_transposed.gif"></td>
>     <td><img width="150px" src=".\论文阅读-Deep-Learning-for-Image-Super-Resolution-A-Survey/arbitrary_padding_no_strides_transposed.gif"></td>
>     <td><img width="150px" src=".\论文阅读-Deep-Learning-for-Image-Super-Resolution-A-Survey/same_padding_no_strides_transposed.gif"></td>
>     <td><img width="150px" src=".\论文阅读-Deep-Learning-for-Image-Super-Resolution-A-Survey/full_padding_no_strides_transposed.gif"></td>
>   </tr>
>   <tr>
>     <td>No padding, no strides, transposed</td>
>     <td>Arbitrary padding, no strides, transposed</td>
>     <td>Half padding, no strides, transposed</td>
>     <td>Full padding, no strides, transposed</td>
>   </tr>
>   <tr>
>     <td><img width="150px" src=".\论文阅读-Deep-Learning-for-Image-Super-Resolution-A-Survey/no_padding_strides_transposed.gif"></td>
>     <td><img width="150px" src=".\论文阅读-Deep-Learning-for-Image-Super-Resolution-A-Survey/padding_strides_transposed.gif"></td>
>     <td><img width="150px" src=".\论文阅读-Deep-Learning-for-Image-Super-Resolution-A-Survey/padding_strides_odd_transposed.gif"></td>
>     <td></td>
>   </tr>
>   <tr>
>     <td>No padding, strides, transposed</td>
>     <td>Padding, strides, transposed</td>
>     <td>Padding, strides, transposed (odd)</td>
>     <td></td>
>   </tr>
> </table>
> 相关论文：[A guide to convolution arithmetic for deep learning](https://arxiv.org/abs/1603.07285#)

<img src="D:\blog\source\_drafts\论文阅读-Deep-Learning-for-Image-Super-Resolution-A-Survey\5.png" alt="image-20211104161624290" style="zoom:80%;" />



缺点：该层很容易在每个轴上造成“不均匀重叠”，并且两个轴上的相乘结果进一步创建了一个大小不同的棋盘状图案，从而损害SR性能。



#### 亚像素层

亚像素指：图片中两个实际物理像素之间的更微小的像素。

> 亚像素实际上应该是存在的，只是传感器没能将其检测出来而已



亚像素卷积层（sub-pixel convolution layer）

> 相关论文：
>
> [Shi W, Caballero J, Huszár F, et al. Real-time single image and video super-resolution using an efficient sub-pixel convolutional neural network[C]//Proceedings of the IEEE conference on computer vision and pattern recognition. 2016: 1874-1883.](https://arxiv.org/abs/1609.05158)

<img src="D:\blog\source\_drafts\论文阅读-Deep-Learning-for-Image-Super-Resolution-A-Survey\6.png" alt="image-20211104161907149" style="zoom:80%;" />

其运作如下：

1. 假设输入图像尺寸： $3 \times 3$ ，缩放因子： $r$ 
2. 对输入图像进行Half Padding卷积操作，提取特征，得到 $r^2 \times 3 \times 3$ 特征矩阵
3. 对特征矩阵进行周期筛选（periodic shuffling），如上图所示排列，得到尺寸为 $r*3 \times r*3$ 的超分图像。



与转置卷积相比，亚像素卷积拥有更大的感受野。

但由于感受野的分布是不均匀的，而块状区域实际上共享同一感受野，因此可能会在不同块的边界附近产生一些伪影。此外，独立预测块状区域中的相邻像素可能导致不平滑的输出。

为此，出现了sub-pixel layer的改进版：PixelTCL，将独立预测替换为相互依赖的顺序预测，从而生成更平滑、更一致的结果。

> 相关论文：
>
> [Gao H, Yuan H, Wang Z, et al. Pixel transposed convolutional networks[J]. IEEE transactions on pattern analysis and machine intelligence, 2019, 42(5): 1218-1227.](https://ieeexplore.ieee.org/document/8618415)
>
> 引用量：31





#### 超高档模块

超高档模块（Meta Upscale Module）。

<img src="D:\blog\source\_drafts\论文阅读-Deep-Learning-for-Image-Super-Resolution-A-Survey\7.png" alt="image-20211117152323610"  />

> 相关论文：
>
> [Hu X, Mu H, Zhang X, et al. Meta-SR: A magnification-arbitrary network for super-resolution[C]//Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition. 2019: 1575-1584.](https://arxiv.org/abs/1903.00875)
>
> 引用量：157







## 网络设计

常见的网络设计策略主要有以下8种：

1. 残差学习
2. 递归学习
3. 多路径学习
4. 密集连接
5. 注意力机制
6. 高级卷积
7. 区域递归学习
8. 金字塔池化

![image-20211103094126229](D:\blog\source\_drafts\论文阅读-Deep-Learning-for-Image-Super-Resolution-A-Survey\4.png)



### 残差学习

残差学习策略主要可分为：

1. 全局残差学习
2. 局部残差学习



**全局残差学习：**

它避免了学习从一幅完整图像到另一幅图像的复杂变换，而只需要学习残差贴图来恢复丢失的高频细节。

|                             论文                             | cites |
| :----------------------------------------------------------: | ----- |
| Kim J, Lee J K, Lee K M. Accurate image super-resolution using very deep convolutional networks[C]//Proceedings of the IEEE conference on computer vision and pattern recognition. 2016: 1646-1654. | 4265  |
| Tai Y, Yang J, Liu X, et al. Memnet: A persistent memory network for image restoration[C]//Proceedings of the IEEE international conference on computer vision. 2017: 4539-4547. | 972   |
| Tai Y, Yang J, Liu X. Image super-resolution via deep recursive residual network[C]//Proceedings of the IEEE conference on computer vision and pattern recognition. 2017: 3147-3155. | 1307  |
| Hui Z, Wang X, Gao X. Fast and accurate single image super-resolution via information distillation network[C]//Proceedings of the IEEE conference on computer vision and pattern recognition. 2018: 723-731. | 372   |



**局部残差学习：**

它主要用于缓解网络深度不断增加导致的退化问题，降低训练难度，提高学习能力。

|                             论文                             | cites |
| :----------------------------------------------------------: | ----- |
| Zhang Y, Li K, Li K, et al. Image super-resolution using very deep residual channel attention networks[C]//Proceedings of the European conference on computer vision (ECCV). 2018: 286-301. | 1594  |
| Mao X, Shen C, Yang Y B. Image restoration using very deep convolutional encoder-decoder networks with symmetric skip connections[J]. Advances in neural information processing systems, 2016, 29: 2802-2810. | 1132  |
| Han W, Chang S, Liu D, et al. Image super-resolution via dual-state recurrent networks[C]//Proceedings of the IEEE conference on computer vision and pattern recognition. 2018: 1654-1663. | 145   |
| Li J, Fang F, Mei K, et al. Multi-scale residual network for image super-resolution[C]//Proceedings of the European Conference on Computer Vision (ECCV). 2018: 517-532. | 305   |





### 递归学习

为了能较轻便地学习更高级别的特征，将递归学习引入到SR

> **递归学习：** 以递归的方式，多次使用相同的模块



一般来说，递归学习可以在不引入过多参数的情况下学习更高级的特征，但仍然无法避免高昂的计算成本。而且它本身存在梯度消失或爆炸的问题，因此它通常与剩余学习、多重监督结合使用，以缓解这些问题

|                             论文                             | cites |
| :----------------------------------------------------------: | :---: |
| Kim J, Lee J K, Lee K M. Deeply-recursive convolutional network for image super-resolution[C]//Proceedings of the IEEE conference on computer vision and pattern recognition. 2016: 1637-1645. | 1856  |
| Tai Y, Yang J, Liu X. Image super-resolution via deep recursive residual network[C]//Proceedings of the IEEE conference on computer vision and pattern recognition. 2017: 3147-3155. | 1307  |
| Ahn N, Kang B, Sohn K A. Fast, accurate, and lightweight super-resolution with cascading residual network[C]//Proceedings of the European Conference on Computer Vision (ECCV). 2018: 252-268. |  455  |
| Li Z, Yang J, Liu Z, et al. Feedback network for image super-resolution[C]//Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition. 2019: 3867-3876. |  349  |
| Tai Y, Yang J, Liu X, et al. Memnet: A persistent memory network for image restoration[C]//Proceedings of the IEEE international conference on computer vision. 2017: 4539-4547. |  972  |
| Han W, Chang S, Liu D, et al. Image super-resolution via dual-state recurrent networks[C]//Proceedings of the IEEE conference on computer vision and pattern recognition. 2018: 1654-1663. |  145  |
| Lai W S, Huang J B, Ahuja N, et al. Fast and accurate image super-resolution with deep laplacian pyramid networks[J]. IEEE transactions on pattern analysis and machine intelligence, 2018, 41(11): 2599-2613. |  351  |



### 多路径学习

多路径学习，指通过执行不同操作的多条路径传递特征，并将其融合回来，以提供更好的建模能力。

它可以分为以下三种：

1. 全局多路径学习
2. 局部多路径学习
3. 特定尺度的多路径学习



**全局多路径学习：**

全局多路径学习，利用多条路径提取图像不同方面的特征。这些路径可以在传播过程中相互交叉，从而大大提高学习能力。



|                             论文                             | cites |
| :----------------------------------------------------------: | :---: |
| [1] Lai W S ,  Huang J B ,  Ahuja N , et al. Deep Laplacian Pyramid Networks for Fast and Accurate Super-Resolution[C]// IEEE Conference on Computer Vision & Pattern Recognition. IEEE Computer Society, 2017:5835-5843. | 1481  |
| [1] Wei H ,  Chang S ,  Ding L , et al. Image Super-Resolution via Dual-State Recurrent Networks[C]// IEEE/CVF Conference on Computer Vision & Pattern Recognition. IEEE, 2018. |  145  |
| Ren H, El-Khamy M, Lee J. Image super resolution based on fusing multiple convolution neural networks[C]//Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition Workshops. 2017: 54-61. |  68   |
| Dahl R, Norouzi M, Shlens J. Pixel recursive super resolution[C]//Proceedings of the IEEE international conference on computer vision. 2017: 5439-5448. |  214  |



**局部多路径学习：**

|                             论文                             | cites |
| :----------------------------------------------------------: | :---: |
| Li J, Fang F, Mei K, et al. Multi-scale residual network for image super-resolution[C]//Proceedings of the European Conference on Computer Vision (ECCV). 2018: 517-532. |  305  |



**特定尺度的多路径学习：**

由于不同尺度的SR模型需要经过相似的特征提取，所以就出现了特定尺度的多路径学习。

|                             论文                             | cites |
| :----------------------------------------------------------: | :---: |
| [1] Lim B ,  Son S ,  Kim H , et al. Enhanced Deep Residual Networks for Single Image Super-Resolution[C]// 2017 IEEE Conference on Computer Vision and Pattern Recognition Workshops (CVPRW). IEEE, 2017. | 2837  |
| Ahn N, Kang B, Sohn K A. Fast, accurate, and lightweight super-resolution with cascading residual network[C]//Proceedings of the European Conference on Computer Vision (ECCV). 2018: 252-268. |  455  |
| [1] Wang Y ,  Perazzi F ,  Mcwilliams B , et al. A Fully Progressive Approach to Single-Image Super-Resolution[J]. 2018 IEEE/CVF Conference on Computer Vision and Pattern Recognition Workshops (CVPRW), 2018. |  158  |



### 密集连接

该方法是基于DenseNet网络的。

> **DenseNet论文：** 
>
> Huang G, Liu Z, Van Der Maaten L, et al. Densely connected convolutional networks[C]//Proceedings of the IEEE conference on computer vision and pattern recognition. 2017: 4700-4708.



密集连接不仅有助于缓解梯度消失、增强信号传播和鼓励特征重用，而且通过采用小增长率（即密集块中的通道数）和在连接所有输入特征映射后压缩通道，大大减小了模型尺寸。

引入SR后，它能融合低级和高级特征，有助于重建高质量细节



|                             论文                             | cites |
| :----------------------------------------------------------: | :---: |
| Tong T, Li G, Liu X, et al. Image super-resolution using dense skip connections[C]//Proceedings of the IEEE international conference on computer vision. 2017: 4799-4807. |  761  |
| [1] Tai Y ,  Yang J ,  Liu X , et al. MemNet: A Persistent Memory Network for Image Restoration[C]// IEEE International Conference on Computer Vision. IEEE Computer Society, 2017. |  972  |
| Ahn N, Kang B, Sohn K A. Fast, accurate, and lightweight super-resolution with cascading residual network[C]//Proceedings of the European Conference on Computer Vision (ECCV). 2018: 252-268. |  455  |
| Zhang Y, Tian Y, Kong Y, et al. Residual dense network for image super-resolution[C]//Proceedings of the IEEE conference on computer vision and pattern recognition. 2018: 2472-2481. | 1609  |
| Wang X, Yu K, Wu S, et al. Esrgan: Enhanced super-resolution generative adversarial networks[C]//Proceedings of the European conference on computer vision (ECCV) workshops. 2018: 0-0. | 1330  |
| Haris M, Shakhnarovich G, Ukita N. Deep back-projection networks for super-resolution[C]//Proceedings of the IEEE conference on computer vision and pattern recognition. 2018: 1664-1673. |  839  |



### 注意力机制

该策略主要分为：

1. 通道注意力
2. 非局部注意力



**通道注意力：**

使用全局平均池（GAP）将每个输入通道压缩到通道描述符（即常数）中，然后将这些描述符馈入两个密集层，以产生输入通道的通道尺度因子。

|                             论文                             | cites |
| :----------------------------------------------------------: | :---: |
| Zhang Y, Li K, Li K, et al. Image super-resolution using very deep residual channel attention networks[C]//Proceedings of the European conference on computer vision (ECCV). 2018: 286-301. | 1594  |
| Dai T, Cai J, Zhang Y, et al. Second-order attention network for single image super-resolution[C]//Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition. 2019: 11065-11074. |  503  |



**非局部注意力：**

|                             论文                             | cites |
| :----------------------------------------------------------: | :---: |
| Dai T, Cai J, Zhang Y, et al. Second-order attention network for single image super-resolution[C]//Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition. 2019: 11065-11074. |  503  |
| Zhang Y, Li K, Li K, et al. Residual non-local attention networks for image restoration[J]. arXiv preprint arXiv:1903.10082, 2019. |  257  |



### 高级卷积

高级卷积是对卷积操作改进版的一个统称。

用于SR的高级卷积主要有：

1. 扩张卷积
2. 群卷积
3. 深度可分卷积



### 区域递归学习

该策略是基于PixelCNN的

> **PixelCNN：** 
>
> Oord A, Kalchbrenner N, Vinyals O, et al. Conditional image generation with pixelcnn decoders[J]. arXiv preprint arXiv:1606.05328, 2016.



虽然这些方法在一定程度上表现出更好的性能，但递归过程需要较长的传播路径，这大大增加了计算成本和训练难度，特别是对于超分辨率HR图像。





### 小波变换





## 学习策略

### 损失函数

为了更好地测量重建误差并产生更真实和更高质量的结果，SR领域陆续出现了各种损失函数：

1. 像素损失
2. 内容损失
3. 对抗性损失
4. 循环一致性损失
5. 总变化损失
6. 基于先前的损失



**像素损失：**

像素损失（Pixel Loss），思想：对比图片间的对应像素值。

其Loss Function主要有：L1(MAE)和L2(MSE)，公式分别为：
$$
\begin{align}
	& {\mathcal{L}}_{{\rm{pixel\_l1}}}(\hat{I},I)=\frac 1 {hwc} \sum _{i,j,k} |\hat{I}_{i,j,k} - I_{i,j,k}|  \\
	& \\
	& {\mathcal{L}}_{{\rm{pixel\_l2}}}(\hat{I},I)=\frac 1 {hwc} \sum _{i,j,k} (\hat{I}_{i,j,k} - I_{i,j,k})^2  \\
\end{align}
$$
其中：

- $h,w,c$ ：分别为图片高、宽、通道数
- $I$ ：HR原图
- $\hat{I}$ ：SR生成的HR图片



实践上，L1(MAE)比L2(MSE)拥有更好的收敛性。

由于像素损失没有考虑图像质量，因此结果通常缺乏高频细节，并且对过平滑纹理的感知并不理想。



**内容损失：**

内容损失（Content Loss），其目的是为了更好地评价图像的感知质量

核心思想：使用预训练好的图像分类网络，对每一层图像进行分类打分，然后进行比较。

公式：
$$
{\mathcal{L}}_{{\rm{content}}}(\hat{I},I;\phi,l)=\frac 1 {h_l w_l c_l} \sqrt{\sum_{i,j,k} \left( \phi_{i,j,k} ^{(l)} (\hat{I}) - \phi_{i,j,k} ^{(l)}(I) \right) ^2}
$$
其中：

- $\phi$ ：预训练好的图像分类网络，通常使用VGG、ResNet
- $l$ ：图像的层数



|                             论文                             | cites |
| :----------------------------------------------------------: | :---: |
| Sajjadi M S M, Scholkopf B, Hirsch M. Enhancenet: Single image super-resolution through automated texture synthesis[C]//Proceedings of the IEEE International Conference on Computer Vision. 2017: 4491-4500. |  694  |
| [1] Ledig C ,  Theis L ,  F  Huszar, et al. Photo-Realistic Single Image Super-Resolution Using a Generative Adversarial Network[C]// IEEE Computer Society. IEEE Computer Society, 2016. | 6721  |
| Johnson J, Alahi A, Fei-Fei L. Perceptual losses for real-time style transfer and super-resolution[C]//European conference on computer vision. Springer, Cham, 2016: 694-711. | 6000  |
| Bulat A, Tzimiropoulos G. Super-fan: Integrated facial landmark localization and super-resolution of real-world low resolution faces in arbitrary poses with gans[C]//Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition. 2018: 109-117. |  193  |
| Wang X, Yu K, Dong C, et al. Recovering realistic texture in image super-resolution by deep spatial feature transform[C]//Proceedings of the IEEE conference on computer vision and pattern recognition. 2018: 606-615. |  393  |
| Wang X, Yu K, Wu S, et al. Esrgan: Enhanced super-resolution generative adversarial networks[C]//Proceedings of the European conference on computer vision (ECCV) workshops. 2018: 0-0. | 1332  |



**纹理损失：**

纹理损失（Texture Loss）

考虑到重建图片间的风格相同，于是就有人提出了纹理损失

其中，图像纹理指不同特征通道之间的相关性。

公式：
$$
\begin{align}
	
	& G_{ij}^{(l)}(I)={\rm{vec}}\left(\phi_i^{(l)}(I) \right) \cdot {\rm{vec}}\left( \phi_j^{(l)}(I) \right)  \\
	& \\
	& {\mathcal{L}}_{{\rm{texture}}}(\hat{I},I;\phi,l)=\frac 1 {c_l^2} \sqrt {\sum _{i,j} \left( G_{i,j}^{(l)}(\hat{I}) - G_{i,j}^{(l)}(I)\right)^2}
\end{align}
$$

其中：

- ${\rm{vec}}(\cdot)$ ：矢量化运算
- $\phi_i^{(l)}(I)$ ：图片 $I$ 中的第 $l$ 层的特征图中的第 $i$ 个通道
- $G_{ij}^{(l)}(I)$ ：图片 $I$ 中的第 $l$ 层的第 $i$ 个特征图和第 $j$ 个特征图的内积
- $c_l$ ：第 $l$ 层的通道数

 

**对抗性损失：**

对抗性损失（Adversarial Loss），主要用于GAN模型。

其基于交叉熵损失（Cross Entropy Loss）

公式：
$$
\begin{align}
	& {\mathcal{L}}_{{\rm{gan\_ce\_g}}}(\hat{I};D)=-log\,D(\hat{I}) \\
	& \\
	& {\mathcal{L}}_{{\rm{gan\_ce\_d}}}(\hat{I},I_s;D)=-log\,D(I_s)-log\,(1-D(\hat{I})) \\
\end{align}
$$
其中：

- ${\mathcal{L}}_{{\rm{gan\_ce\_g}}}$ ：生成器的对抗性损失（即：SR模型）
- ${\mathcal{L}}_{{\rm{gan\_ce\_d}}}$ ：判别器的对抗性损失（即：二元分类器）
- $D$ ：判别器
- $I_s$ ：从真实图片中随机抽样（sample）的图片





**循环一致性损失：**

循环一致性损失（Cycle Consistency Loss），



**总变化损失：**






**基于先前的损失：**



