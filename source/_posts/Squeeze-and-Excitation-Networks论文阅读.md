---
title: Squeeze-and-Excitation Networks论文阅读
comment: true
date: 2021-10-05 09:59:26
tags: CV
categories: Paper
addrlink: 1514
---


# 创新点

模仿人眼的注意力机制。

人眼在识别某样物体时，往往只会关注突出的部分，然后从突出的部分中识别出该物体是什么。



然后，作者在`ResNet`的基础上，增加了`Squeeze`操作和`Excitation`操作，简称：`SE`操作。





# SE模块

`SE-Net`整体的框架图如下：

![image-20211005100435169](.\Squeeze-and-Excitation-Networks论文阅读\1.png)

1. 输入${\bf{X}}$，${\bf{X}}$ 是一个三维向量：$H^{\\'} \times W^{\\'} \times C^{\\'}$ ，$C^{\\'}$ 相当于图片的通道channel，或者是层数。

2. ${\bf{F}}_{tr}$ 是卷积操作，其中卷积核是：${\bf{V}}=[{\bf{v}}_1,{\bf{v}}_2,...,{\bf{v_C}}]$ ，分别对输入的每一层进行卷积操作，提取特征，然后得到特征向量： ${\bf{U}}=H \times W \times C=[{\bf{u}}_1,...,{\bf{u}}_C]$ 。

3. 接着就是${\bf{F}}_{sq}(\cdot)$  `Squeeze`操作。

   这里作者采用全局平均池化操作，对每一层的特征进行压缩，得到最显著的特征，最后得到一个特征向量：${\bf{z}}=1 \times 1 \times C=[{\bf{z}}_1,{\bf{z}}_2,...,{\bf{z}}_C]$ 
   
   其中，全局平均池化操作计算公式：
   $$
   z_c={\bf{F}}_{sq}({\bf{u}}_c)= \frac 1 {H \times W} \sum _{i=1} ^H \sum _{j=1} ^W u_c (i,j)
   $$
   
   就是将每一层的所有特征值加起来，然后求平均。
   
4. 然后就是${\bf{F}}_{ex}(\cdot , {\bf{W}})$ `Excitation`操作。其主要作用是将每一通道的显著特征与通道本身关联起来，得到一个权值向量： ${\bf{s}}=1 \times 1 \times C=[{\bf{s}}_1,{\bf{s}}_2,...,{\bf{s}}_C]$ 。

   `Excitation`操作的具体步骤：
   $$
       {\bf{s}}={\bf{F}}_{ex}({\bf{z}},{\bf{W}})=\sigma (g({\bf{z}},{\bf{W}}))=\sigma ({\bf{W}}_2 \delta({\bf{W}}_1 {\bf{z}}))
   $$
   其中：

   - $\sigma$ ：`Sigmoid`操作
   - $\delta$ ： `ReLU`操作
   - ${\bf{W}}_2$ ：${\bf{W}}_2 \in {\mathbb{R}}^{C \times \frac C r}$
   - ${\bf{W}}_1$ ：${\bf{W}}_1 \in {\mathbb{R}}^{\frac C r \times   C}$
   - FC：`fully connected`，其中第一个FC是： ${\bf{W}}_1 {\bf{z}}$ ，第二个FC是 ${\bf{W}}_2 \delta({\bf{W}}_1 {\bf{z}})$ 

   <img src=".\Squeeze-and-Excitation-Networks论文阅读\2.png" alt="image-20211005111757760" style="zoom: 50%;" />

   

5. 最后是 ${\bf{F}}_{scale}(\cdot,\cdot)$ 融合操作。其主要作用是对每一通道的原始特征进行重新标定。最后会输出 $\tilde{{\bf{X}}}=[ \tilde{{\bf{x}}_1},\tilde{{\bf{x}}_2},...,\tilde{{\bf{x}}_C}] \in \mathbb{R}^{H \times W \times C}$

   计算公式：
   $$
   \tilde{{\bf{x}}_C}={\bf{F}}_{scale}({\bf{u}}_c , s_c)=s_c \cdot {\bf{u}}_c
   $$
   就是将 ${\bf{U}}$ 中的每一层的数都乘以对应层数的 ${\bf{s}}$ 。





# 训练策略

每个普通网络及其对应的SE网络都使用相同的优化方案进行训练。

**训练：**

- 将随机大小的图片裁剪到224*224的像素（对于Inception-ResNet-v2和SE-Inception-ResNet-v2，则为299×299） 

- 然后又对图片进行随机水平翻转，以此来进行数据增强。 

- 接着通过平均通道减法（mean channel subtraction）对输入图像进行归一化

- 此外，对于小批量采样，采用下面论文中的数据平衡策略

    > [1] L. Shen, Z. Lin, and Q. Huang. Relay backpropagation for effective learning of deep convolutional neural networks. In ECCV, 2016. 4
    >
    > 该论文中的数据平衡策略：`class-aware sampling`，类感知采样。在该方法中，
    >
    > - 使用两种类型的列表，一种是类列表，另一种是每类图像列表。
    > - 在迭代中获取训练小批量时
    > - 首先在类列表中采样一个类X
    > - 然后在类X的每类图像列表中采样一个图像
    > - 当到达类X的每类图像列表的末尾时，执行洗牌操作以重新排序类X的图像。
    > - 当到达类列表的末尾时，执行洗牌操作以对类重新排序。
    >
    > 原文：
    >
    > we use two types of lists, one is **class list**, and the other is **per-class image list**. 
    >
    > When getting a training mini-batch in an iteration, we first sample a class X in  the class list, then sample an image in the per-class image list of class X.  
    >
    > When reaching the end of the per-class image list of class X, a shuffle  operation is performed to reorder the images of class X. 
    >
    > When reaching the end  of class list, a shuffle operation is performed to reorder the classes.

- 作者在分布式学习系统“ROCS”上对网络进行训练

- 优化器使用`SGD` ，`momentum=0.9`， `mini-batch size=1024`   

- 学习率初始化为0.6，之后每30个epoch下降10倍。  

    > 原文：Optimisation is performed using **synchronous SGD** with **momentum 0.9** and a **mini-batch size of 1024**. The initial **learning rate** is set to **0.6** and **decreased by a factor of 10 every 30 epochs**.

- 所有模型都使用下面文献中的权重初始化策略，从零开始训练100个epoch

    > [1] He K ,  Zhang X ,  Ren S , et al. Delving Deep into Rectifiers: Surpassing Human-Level Performance on ImageNet Classification[J]. IEEE Computer Society, 2015.
    >
    > 该文献中的权重初始化策略：











**测试：**

- 在验证集上采用中心裁剪评估，其中将较短边缘调整为256的每个图像裁剪成224×224像素（对于Inception-ResNet-v2和SE-Inception-ResNet-v2，从首先将较短边缘调整为352的每个图像裁剪299×299像素）





