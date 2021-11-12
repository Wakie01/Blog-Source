---
title: >-
  论文阅读-Fast and Accurate Image Super-Resolution with Deep Laplacian Pyramid
  Networks
comment: true
date: 2021-10-28 09:31:17
tags:
categories:
addrlink:
---


# 基本信息

- 标题：

  **Fast and Accurate Image Super-Resolution with Deep Laplacian Pyramid Networks**

  利用深拉普拉斯金字塔网络实现快速准确的图像超分辨率

- 年份：2018

- 作者团队：Wei-Sheng Lai, Jia-Bin Huang, Narendra Ahuja, and Ming-Hsuan Yang





# 动机

1. 现有的超分CNN网络，网络参数多，且运行时需要大量的计算负载
2. 现有的超分CNN网络，都使用MSE损失函数，MSE损失函数通常会导致结果过度平滑，与人类的感知不太一致。



# 贡献

1. 改善图像预处理的方法
2. 使用Charbonnier损失函数
3. 利用递归层在金字塔层之间以及金字塔层内部共享参数，从而大大减少参数的数量



对LapSRN进行了改善，提出了MS-LapSRN



## MS-LapSRN

