---
title: >-
  论文阅读-Deep recursive super resolution network with Laplacian Pyramid for better
  agricultural pest surveillance and detection
comment: true
date: 2021-10-26 14:47:51
tags:
categories:
addrlink:
---

# 标题

**Deep recursive super resolution network with Laplacian Pyramid for better agricultural pest surveillance and detection**

具有拉普拉斯金字塔的深度递归超分辨率网络，用于更好地监测和检测农业害虫





# 动机

1. 更好地检测图片中的农业害虫，而检测农业害虫属于小目标检测，所以要改善现有的小目标检测方法
2. 目前大目标检测比较成熟，所以就想把小目标放大为大目标。



# 贡献





## 模型结构





![image-20211026153822801](D:\blog\source\_drafts\论文阅读-Deep-recursive-super-resolution-network-with-Laplacian-Pyramid-for-better-agricultural-pest-surveillance-and-detection\1.png)

该模型使用局部剩余学习和全局剩余学习。

作者为了避免梯度消失或梯度爆炸，构建了具有密集连接结构的模型。

作者使用反卷积方法对图像进行方法。

在损失函数上，作者使用了Charbonnier损失函数。

