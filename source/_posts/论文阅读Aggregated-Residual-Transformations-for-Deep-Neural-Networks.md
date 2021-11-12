---
title: 论文阅读Aggregated Residual Transformations for Deep Neural Networks
comment: true
date: 2021-10-12 09:18:16
tags: Paper
categories: CNN
addrlink: 1536
---




![image-20211012094318605](.\论文阅读Aggregated-Residual-Transformations-for-Deep-Neural-Networks\1.png)

**左图：** 

1. 输入一个通道为256的特征矩阵

2. 先采用64个1*1的卷积核对特征矩阵进行降维，降维之后，特征矩阵的通道数为64，（此时的特征矩阵长宽是不变的）

   > **问题：** 卷积操作能降维？
   >
   > **答：** 其实，这里的卷积核是64个通道数为256的1*1。所以，卷积能否降维或升维，就看卷积核的数量。

3. 然后采用64个3*3的卷积核对上一层的d-64特征矩阵进行卷积处理，该层的处理不改变特征矩阵的通道数

4. 接着再采用256个1*1的卷积核对上一层的d-64特征矩阵进行升维，升维之后，特征矩阵的通道数为256

5. 将上一层的d-256特征矩阵与原输入的d-256特征矩阵相加，并输出。

> 在左图中，卷积核的维度默认与特征矩阵的维度相等。



**右图：** 

1. 输入一个通道为256的特征矩阵
2. 先将d-256特征矩阵划分为32组，每个分组的特征矩阵与原输入的特征矩阵相同
3. 然后采用4个1*1的卷积核分别对每一组的d-256特征矩阵进行卷积处理，分别得到32组d-4特征矩阵
4. 接着采用256个1*1的卷积核分别对每一组的d-4特征矩阵进行卷积操作，分别得到32组d-256特征矩阵
5. 再将32组d-256特征矩阵进行相加，得到一个d-256特征矩阵
6. 最后将d-256特征矩阵与原输入的d256特征矩阵相加，并输出



这三个图在数学计算上是等价的

![image-20211012103440438](.\论文阅读Aggregated-Residual-Transformations-for-Deep-Neural-Networks\2.png)



# 对比

**普通卷积操作：** 

![image-20211012110044366](.\论文阅读Aggregated-Residual-Transformations-for-Deep-Neural-Networks\3.png)

- 假设输入特征矩阵通道数为 $C_{in}$ ，那么卷积核的通道数也为 $C_{in}$ （默认卷积核的通道数与输入矩阵的是相等的）

- 然后假设输出的特征矩阵通道数为n，那么卷积核的个数为n

- 接着再假设每个卷积核的高和宽都是k，

- 最后，一次普通卷积所需要的参数个数：
  $$
  k \times k \times C_{in} \times n
  $$
  



**组卷积：** 

![image-20211012112641208](.\论文阅读Aggregated-Residual-Transformations-for-Deep-Neural-Networks\4.png)

- 假设输入特征矩阵通道数为 $C_{in}$ ，再假设将特征矩阵划分为 $g$ 组，那么每一组特征矩阵的通道数为$\frac {C_{in}} g $ ，所以每一组的卷积核的通道数为 $\frac {C_{in}} g $ 

- 再假设输出的特征矩阵通道数为 $n$ ，那么每一组输出的特征矩阵通道数为 $\frac n g$ ，所以每一组卷积核的个数为 $\frac n g$ 

- 接着再假设每个卷积核的高和宽都是k

- 最后，一次组卷积所需要的参数个数：
  $$
  \begin{align}
  参数个数  & = (k \times k \times \frac {C_{in}} g \times \frac n g) \times g \\
  		& = k \times k \times C_{in} \times n \times \frac 1 g
  \end{align}
  $$

>组卷积中，每一组的卷积核是相同的

----

可见，组卷积比普通卷积更轻便。



# 创新点

创新点就是提出了组卷积。











