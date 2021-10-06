---
title: Deep Spatio-Temporal Residual Networks for Citywide Crowd Flows Prediction
comment: true
date: 2021-09-15 14:35:09
tags:
categories:
addrlink:
---

题目：基于深度时空残差网络的城市人群流量预测



# 摘要

城市人群流量受很多方面因素的影响，比如：区域间的交通、事件、天气等等……

作者提出了一个基于深度学习的方法：`ST-ResNet`，集中预测城市每个区域的人群==流入量==和==流出量==。

由于时空数据的特殊性，`ST-ResNet`采用端到端的结构。

总的来说，作者使用==残差神经网络==框架来对人群交通时间的==接近性==、==周期性==和==趋势性==进行建模。对于每个特性，作者都设计一个==剩余卷积单元==的分支，每个剩余卷积单元模拟人群流量的空间特性。`ST-ResNet`会根据数据的特性，学习为不同的分支和区域分配不同的权重，动态地聚合3个残差神经网络的输出。





# 介绍

城市人群流量的预测对交通管理和公共安全有很大的帮助。



在本篇文章中，作者对两种人群流量进行了预测：

1. 流入量：指在给定时间间隔内从其他地方进入某一区域的人群的总流量。
2. 流出量：指在给定的时间间隔内，离开一个地区前往其他地方的人群的总流量。

其中，流入/流出量可通过测量区域内的行人数量、汽车数量、公共交通的乘客数量来获取。



**挑战**

预测一个城市的每个区域的流入/流出量是很有挑战的，并受以下3个因素影响：

1. 空间依赖
2. 时间依赖
3. 外部影响

为了处理这三个因素的影响，作者提出了`ST-ResNet`。



**贡献点：**

1. 提出基于卷积的残差神经网络的`ST-ResNet`，对一个城市中的任意两个区域的远近空间依赖进行建模，同时确保模型的预测精度不受神经网络深层结构的影响。

2. 对人群流动的时间特性归纳为三个方面：

   - 时间接近性
   - 周期性
   - 趋势性

   `ST-ResNet`使用3个剩余网络分别对该三个特性进行建模。

3. `ST-ResNet`动态地聚合上述三个网络的输出，为不同的分支和区域分配不同的权重。

4. 作者使用北京出租车的轨迹数据和气象数据，以及纽约的自行车轨迹数据来评估`ST-ResNet`，结果显示比6种方法好。其中这6种方法是：

   - HA
   - ARIMA
   - SARIMA
   - VAR
   - ST-ANN
   - DeepST



# 准备工作

## 区域

根据不同的粒度和语义，区域的定义也会有所不同。

在本篇文章中，作者根据经纬度将一个城市划分为一个I×J的栅格地图，其中栅格表示一个区域。

![image-20210916102524379](D:\blog\source\_drafts\Deep-Spatio-Temporal-Residual-Networks-for-Citywide-Crowd-Flows-Prediction\1.png)





## 输入/出流

在第t个时间间隔中，区域 $(i,j)$ 的人群流入量：
$$
x_t ^{in,i,j}=\sum _{Tr \in \mathbb{P}} \lvert \lbrace k>1 | g_{k-1} \notin (i,j) \wedge g_k \in (i,j) \rbrace \rvert
$$


在第t个时间间隔中，区域 $(i,j)$ 的人群流出量：
$$
x_t ^{out,i,j}=\sum _{Tr \in \mathbb{P}} \lvert \lbrace k \geq 1 | g_k \in (i,j) \wedge g_{k+1} \notin (i,j) \rbrace \rvert
$$

其中：

- $\mathbb {P}$ ：在第t个时间间隔的轨迹集合
- $Tr$ ：一个轨迹的下标，$k$ 也是，$k$ 相对于 $Tr$ 
- $g_k$ ：$\mathbb{P}$ 中的第k个轨迹
- 区域栅格表示：$(i,j)$ ，其中 $i$ 与 $j$ 分别表示行与列
- $\lvert \cdot \rvert$ ：表示集合的基数



为了更好的数据化，作者将第 $t$ 个时间间隔中的 $I \times J$ 区域中的流入量、流出量整合为一个张量： ${\bf{X}} \in \mathbb{R} ^{2 \times I \times J}$  ，如：

- $( {\bf{X}} _t ) _{0,i,j} = x_t ^{in,i,j}$ 
- $( {\bf{X}} _t ) _{1,i,j} = x_t ^{out,i,j}$ 



## 深度剩余学习

在[He, K.; Zhang, X.; Ren, S.; and Sun, J. 2016. Identity mappings in deep residual networks. In ECCV.]() 中，一个具有身份映射的剩余单元定义为：
$$
{\bf{X}} ^{(l+1)} ={\bf{X}} ^{(l)} + {\mathcal{F}} ({\bf{X}}^{(l)})
$$
其中：

- ${\bf{X}} ^{(l)}$ 和 ${\bf{X}} ^{(l+1)}$ 分别是第 $l$ 个剩余单元的输入和输出
- $\mathcal{F}$ ：剩余函数



剩余学习的中心思想就是学习剩余函数 $\mathcal{F}$ 





# 深度时空剩余网络

![image-20210916150615667](D:\blog\source\_drafts\Deep-Spatio-Temporal-Residual-Networks-for-Citywide-Crowd-Flows-Prediction\2.png)

上图为`ST-ResNet`的结构。

`ST-ResNet` 由4部分组成，这4部分分别对时间接近性、周期性、趋势性和外部影响进行建模，

