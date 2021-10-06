---
title: >Camera Distance-aware Top-down Approach for 3D Multi-person Pose Estimation from a Single RGB Image
comment: true
date: 2021-08-27 20:14:22
tags:
categories:
addrlink:
---





文章题目：基于单个RGB图像，对三维多人姿态的估计。估计方法是：摄像头距离感知自上而下的方法。



以往的，关于3D人体姿态估计的研究，专注于root-relative 3D single-persion pose。而在这篇文章中，作者提出了一种通用的3D多人姿态估计框架，这个框架考虑了很多因素，其中包括人体检测和3D human root localization。



在该文章中，作者提出了一种完全基于学习的、摄像头距离感知的、自上而下的方法，用于从单个RGB图片中估计3D多人姿态。该方法由3部分组成：

- **人体检测网络**，human detection network，`DetectNet`：用来检测图片中人体的边界框
- **三维人体根定位网络**，3D human root localization network，`RootNet`：用来估计检测到的人体根的摄像机中心坐标
- **根相关的三维单人姿态估计**，root-relative 3D single-person pose estimation network，`PoseNet`：用来估计每个检测到的人体的根相对3D姿态



该方法所实现的效果与先进的3D单人姿态估计的效果旗鼓相当，同时也比以前的3D多人姿态估计方法好得多，而且它不需要提供任何地面真相信息（边界框和根的三维位置）。



近年来，自上而下的方法对2D多人姿态估计，有不错的提升。自上而下的方法是这样的：先通过人体检测模块检测人体，然后通过2D单人人体姿态估计模块对每个人的姿态进行估计。



2D多人姿态估计，以往主要有两种方法：

- 自上而下：部署一个人体探测器，用于估计人体的边界框，然后取出边界框部分，并将其放到姿态估计网络中。
- 自下而上：先在图片中定位全部人的人体关键点，然后再用聚类算法将这些关键点进行分类，从而得出每个人的人体关键点。



3D单人姿态估计，以往的方法主要分为两大类：

- 单阶段：直接从图像中定位3D人体关键点。
- 两阶段：它利用了2D人体姿态估计的高精度，它先将人体关键点定位在2D空间中，然后再将这些关键点提升到3D空间。



3D多人姿态估计，以往的方法中，有一个叫`LCR-NET`



在3D多人姿态估计中的3D人体根定位，



本文章所提出的方法中，会解决的问题：恢复多人关键点的绝对摄像机中心坐标。



## 模型概览

文章所提出的方法概览：

- 该方法由三部分组成：`DetectNet`、`RootNet`、`PoseNet`

- `DetectNet`：用来检测图片中所有的人的人体边界框

- `RootNet`：将`DetectNet`所得来的人体边界框，从图片中裁剪出来，然后人体根进行定位，得到一个向量：
    $$
    R=（x_R,y_R,Z_R)
    $$
    其中：
    
    - $x_R$ 与$y_R$：像素坐标
    - $Z_R$ ：绝对深度
    
- `PoseNet`：将`DetectNet`所得来的人体边界框，从图片中裁剪出来，然后估计人体的根相对3D姿态，得到一个向量：
    $$
    P^{rel}_j=(x_j, y_j, Z^{rel}_j)
    $$
    其中：

    - $x_j$ 与 $y_j$ ：裁剪图片空间中的像素坐标
    - $Z^{rel}_j$ ：根相对深度值

- 然后，将 $Z^{rel}_j$ 转化为 $Z^{abs}_j$ ， $Z_j ^{abs}=Z_j ^{rel} + Z_R$ ，将 $x_i$ 与 $y_i$ 转换成原始的输入图片的值，得到$P_j ^{abs}$ 

- 最后将 $\lbrace P^{abs}_j \rbrace ^J _{j=1}$ 映射成图像。



## DetectNet

使用`Mask R-CNN`作为`DetectNet`的框架

`Mask R-CNN` 由三部分组成：

- 主干网：使用深度残差网络（ResNet），从图像中提取有用的局部和全局特征。
- 区域建议网络：用于建议人体边框候选，然后`RoIAlign`层会提取每个候选方案中的特征，然后交给第三部分。
- 分类头网络：用于判断人体边框候选是否是一个人，并估计人体边界框的优化偏移。



## RootNet

### 模型设计

RootNet用来对裁剪过的人体图片，估计人体根的相机中心坐标：$R=(x_R,y_R,Z_R)$ ，其中，$(x_R,y_R)$ 与 $Z_R$ 是分别估计的。

$(x_R,y_R)$ 是2D图像坐标，比较容易得出。难的是估计 $Z_R$ 。



为了解决裁剪的人体边框图片中没有提供摄像机和人体的相对位置信息，作者提出了一种新的距离度量：
$$
k=\sqrt{\alpha_x * \alpha_y * \frac {A_{real}}{A_{img}}}
$$

在该公式中，k近似于相机到物体的绝对深度

其中：

- $\alpha_x$ 与 $\alpha_y$ 分别是：焦距除以x轴和y轴的每像素的距离因子
- $A_{real}$ 与 $A_{img}$ 分别是：人体在实际空间中与在图像空间中的面积



此外，相机到物体的距离可由下面公式求得：
$$
d=\alpha_x * \frac {l_{x,real}} {l_{x,img}} = \alpha_y * \frac {l_{y,real}} {l_{y,img}}
$$
其中：

- $l_{x,real}$ 与 $l_{x,img}$ 分别是物体在真实空间中，与在图像空间中的x轴长度
- $l_{y,real}$ 与 $l_{y,img}$ 分别是物体在真实空间中，与在图像空间中的y轴长度



实验证明，当 $A_{real}$ 与 $A_{img}$ 值固定时，以上的深度估计方法是有意义的：

<img src="D:\blog\source\_drafts\Camera-Distance-aware-Top-down-Approach-for-3D-Multi-person-Pose-Estimation-from-a-Single-RGB-Image\2.png" alt="image-20210829214138867" style="zoom:80%;" />



但以上的深度估计方法有一个漏洞，就是：$A_{img}$ 有误差：

<img src="D:\blog\source\_drafts\Camera-Distance-aware-Top-down-Approach-for-3D-Multi-person-Pose-Estimation-from-a-Single-RGB-Image\1.png" alt="image-20210829213439831" style="zoom:80%;" />



为了解决这个问题，`RootNet` 利用图像特征来纠正 $A_{img}$ ，从而纠正k 。`RootNet` 根据图像特征来输出一个纠错因子 $\gamma$ 。最终k的求值公式变为：
$$
k=\sqrt{\alpha_x * \alpha_y * \frac {A_{real}}{A_{img}^{\gamma}}}
$$
其中：
$$
A_{img}^{\gamma}=A_{img} * \gamma
$$





### 相机归一化

相机归一化：指相机的一些固有参数数据，比如$\alpha_x$ 与 $\alpha_y$ ，可以同时用于数据训练和测试过程中。



### 体系结构

`RootNet` 的体系结构由三部分组成：

1. 主干网部分：
   - 用于从图片中提取有用的全局特征。
   - 其中这部分使用的是`ResNet`框架。
2. 2D图像坐标估计部分：
   - 这部分首先从主干网部分中获取一个特征图
   - 然后使用3个连续的反卷积层对该特征图进行再采样，其中这3个连续的反卷积层具有批量归一化层和`ReLU`激活函数。
   - 接着使用1对1卷积生成根的2D热图
   - 然后使用`soft-argmax`从2D热图中提取2D图像坐标$x_R$ 与 $y_R$
3. 深度估计部分：
   - 这部分也先从主干网中获取特征图，然后应用于全局平均池中
   - 接着将合并的特征图输入到1对1卷积中，得出一个标量值 $\gamma$
   - 然后将 $k$ 乘以 $\frac {1} {\sqrt{\gamma}}$ 得到最终的绝对深度值 $Z_R$ 

![image-20210830111143271](D:\blog\source\_drafts\Camera-Distance-aware-Top-down-Approach-for-3D-Multi-person-Pose-Estimation-from-a-Single-RGB-Image\3.png)



### 损失函数

$$
L_{root}=||R-R^* ||_1
$$

其中：

- $R$ ：估计的坐标
- $R^*$ ：地面真实坐标





## PoseNet

### 模型设计

`PoseNet` 用来从一个裁剪的人体图片中估计根相对的3D姿态：$P_j ^{rel} =(x_j , y_j , Z_j ^{rel})$ 。



这部分的模型由两部分组成：

1. 主干网部分：
   - 使用`ResNet`框架
   - 从裁剪的人体图片中提取有用的全局特征
2. 姿态估计部分：
   - 这部分首先从主干网部分中获取一个特征图
   - 然后使用3个连续的反卷积层对该特征图进行再采样，其中这3个连续的反卷积层具有批量归一化层和`ReLU`激活函数。
   - 接着使用1对1卷积对特征图进行再采样，生成每个关节的3D热图
   - 然后使用`soft-argmax`提取2D图像坐标 $(x_i,y_i)$ 和根相对深度$Z_j ^{rel}$



### 损失函数

$$
L_{pose}=\frac {1} {J} \sum _{j=1} ^J ||P_j ^{rel} - P_j ^{rel*} ||_1
$$

其中`*` 表示地面真实数据。



## 实现细节

`DetectNet` 使用`Mask R-CNN` 模型，其中`Mask R-CNN` 模型在`COCO`数据集上训练过。

`RootNet`与`PoseNet` 使用`Pytorch` 实现。其输入图片的大小为256*256。

主干网由`ResNet-50`模型初始化，其中`ResNet-50`模型在`ImageNet`数据集上训练过，然后剩余部分的权重由 $\sigma=0.001$ 的高斯分布初始化，还有该权重会由亚当优化器更新。

在训练环节上，会对数据进行数据扩充。


