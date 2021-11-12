---
title: K均值聚类算法
comment: true
date: 2021-03-17 15:45:36
tags:
categories:
addrlink:
---



# K均值聚类算法

K均值聚类算法（K-means算法），是一种聚类分析的算法，其主要是用来计算数据聚集的。



## 算法思想

```
选择K个点作为初始质心
repeat
	将每个点指派到最近的质心，形成K个簇
	重新计算每个簇的质心
until 簇不发生变化 or 达到最大迭代次数
```

例子：对下图进行计算数据聚集

![1](D:\blog\source\_drafts\K均值聚类算法\1.jpg)

A，B，C，D，E是待聚集的点，灰色的点是初始质心，即K=2

然后算法过程：

1. 随机在图中取K个质心（这里K=2）
2. 对图中的所有点求到这K个质心的距离，假如Pi点离质心Si最近，那么Pi属于Si点群（上图中，A、B属于上面的质心，C、D、E属于下面的质心
3. 移动质心到它的点群的中心（图中第三步）
4. 重复2、3步，直到质心没有移动，或者达到最大迭代次数（图中第4、5步）



## 距离公式

求点到质心的距离公式，常见的有：

- 欧氏距离（Euclidean Distance）

  ![image-20210323193329354](D:\blog\source\_drafts\K均值聚类算法\2.png)

  

- 余弦



求质心公式：

![image-20210323194142703](D:\blog\source\_drafts\K均值聚类算法\3.png)



## 算法步骤

![image-20210323195014165](D:\blog\source\_drafts\K均值聚类算法\4.png)



## 聚类结果评价

使用k-means算法对数据进行聚类之后，通常需要验证一下聚类的效果。常用的验证方法有聚类结果的纯度、归一化的互信息、F1值、RI值



### 纯度

纯度（Purity），相当于准确率

直接看例子：下表是对取自洛杉矶时报的3204篇文章进行的k-means划分的结果，共分为6个cluster。这些文章取自娱乐、金融等六个类别

![img](D:\blog\source\_drafts\K均值聚类算法\5.png)



对每个簇进行计算，

Purity1=506/（3+5+40+506+96+27）=0.747415

Purity2=280/（4+7+280+29+39+2）=0.775623

Purity3=671/（1+1+1+7+4+671）=0.979562

Purity4=162/（）

Purity5=331/（）

Purity6=358/（）

然后求平均值得纯度

Purity=（Purity1+Purity2+Purity3+Purity4+Purity5+Purity6）/6=0.72035



### 归一化的互信息

归一化的互信息，Normalized Mutual Information，NMI

用来度量2个聚类结果的相近程度，



归一化的互信息，包含两个概念，归一化与互信息

**归一化** 

将结果压缩成 $[0,1]$ 之间



**互信息（Mutual Information，MI）**

是用来评价两个随机变量之间的关联程度的一个度量，即：给定一个随机变量后，另一个随机变量不确定性的削弱程度，比如，x=今天下雨与y=今天阴天，显然在已知y的情况下, 发生x的概率会更大

> 互信息百度百科：
>
> 互信息(Mutual Information)是信息论里一种有用的信息度量，它可以看成是一个随机变量中包含的关于另一个随机变量的信息量，或者说是一个随机变量由于已知另一个随机变量而减少的不肯定性

互信息，最小取值为0，这意味着给定的一个随机变量对确定另一个随机变量没有关系；最大取值为随机变量的熵，这意味着给定一个随机变量，能完全消除另一个随机变量的不确定性

所以，互信息可以看成是，一个随机变量中，包含的关于另一个随机变量的信息量

互信息计算公式：
$$
\begin{align}
I(X;Y) &= H(X)-H(X|Y) \\
&=H(Y)-H(Y|X) \\
&=H(X)+H(Y)-H(X,Y)
\end{align}
$$




什么是 **熵** 呢？

熵常用来衡量一个系统的信息量，所以在了解熵之前，得要了解信息量



什么是**信息量**呢？

**信息量**

- 定义：信息多少的量度。

- 计算方法：香农的衡量信息量的公式：
  $$
  \begin{align}
  A的信息量 &=log _2 \frac {1}{P(A)}\\ 
  &= -log _2 P(A)
  \end{align}
  $$
  
- $P(A)$ ：事件A发生的概率
- $P(A)$ 越大，A的信息量越小；$P(A)$ 越小，A的信息量就越大。
  
- 案例：如果我说，太阳从东方升起。那么这个事件发生的概率几乎为1，那么这个事情的反应的信息量就会很小。但如果我说，太阳从西方升起。那么这就反应的信息量就很大了，这有可能是因为地球的自转变成了自东向西，或者别的原因，然后随之引起各种变化



**熵（Entropy）** ，也叫信息熵

- 定义：离散随机事件的出现概率。一个系统越是有序，信息熵就越低；反之，一个系统越是混乱，信息熵就越高。

- 作用：描述的一个事件的不确定性。

  此外，它还常被用来作为一个系统，或者一维的信息含量的量化指标，从而可以进一步用来作为系统方程优化的目标或者参数选择的判据。

- 公式：
  $$
  \begin{align}
  H(X) &= \sum _{i=1} ^n P(i)*log_2 \frac {1}{P(i)} \\
  &=- \sum _{i=1} ^n P(i)*log_2 P(i)
  \end{align}
  $$
  

  - $H(X)$ ：系统X的信息含量，系统X有n个事件
  - $P(i)$ ：事件i的发生概率

- 理解：信息熵就相当于：对所有可能发生的事件，所产生的信息量的期望。





此外还有**联合熵**、**条件熵** 、**交叉熵** 、

**联合熵（Joint Entropy）**

- 刚刚的信息熵，可以看成是一维的： $P(i)$ ，随机变量只有一个：$X$ 。

- 联合熵就是对信息熵的升级：将一维变成多维： $P(i,j)$ ，将一个随机变量变成多个： $X,Y$ 。

- 公式：
  $$
  H(X,Y)=-\sum _{i=1} ^n \sum _{j=1} ^m P(x_i,y_j) * log_2 P(x_i,y_j)
  $$
  三维就继续往上加就是了：
  $$
  H(X,Y,Z)=-\sum _{i=1} ^n \sum _{j=1} ^m \sum _{k=1} ^l P(x_i,y_j,z_k) * log_2 P(x_i,y_j,z_k)
  $$
  



**条件熵（Conditional Entropy）**

- 条件熵：$H(Y|X)$ ，表示，在随机变量X的条件下，随机变量Y的信息熵。

- 公式：
  $$
  H(Y|X)=
  $$
  





**交叉熵（Cross Entropy）**









### RI值与F measure值

RI值是Rand Index的缩写，中文名叫兰德系数，它是用来评价聚类结果中的错误划分，F measure也是，只不过F measure在评价时加了权重

> The *Rand index* penalizes both false positive and false negative decisions during clustering. The *F measure* in addition supports differential weighting of these two types of errors.



在介绍F measure值与RI值前，先看一种评价方式：

假如在一堆数据聚类成三个簇，我们准备从中抽2个样本，其中有以下2种抽法，4种情况：

1. 从任意一个簇中，抽两个样本，如果这两个样本都是同一类别，则认为这个簇中的所有样本都聚类正确；相反，则认为这个簇中存在聚类错误的情况
2. 从任意两个簇中，各抽一个样本，如果这两个样本是不同类别，则认为这两个簇中的所有样本都聚类正确；相反，则认为这两个簇中存在聚类错误的情况

为了描述这4种情况，出现了`TP`，`FP`，`TN`，`FN`

- **TP（True Positive，正确的肯定）：** 两个同类的样本点在同一个簇中的情况数量
- **FP（False Positive，错误的肯定）：** 两个非同类的样本点在同一个簇中的情况数量
- **TN（True Negative，正确的否定）：** 两个非同类的样本点分别在两个簇中的情况数量
- **FN（False Negative，错误的否定）：** 两个同类的样本点分别在两个簇中的情况数量

 然后，为了更好地让数学家看这4种情况，就出现了`混淆矩阵（Pair Confusion Matrix）`，如下图：

![image-20210409105004137](D:\blog\source\_drafts\K均值聚类算法\6.png)

其实，在实际中，

- **TP：** 实际为正，被预测也为正，的样本数量

- **FP：** 实际为负，但被预测为正，的样本数量

- **TN：** 实际为负，被预测也为负，的样本数量

- **FN：** 实际为正，但被预测为负，的样本数量

  

好了，RI与F meassure就是在这种评价方式下诞生的

RI计算公式：
$$
RI=\frac {TP+TN} {TP+FP+FN+TN}
$$
其实，RI值就是变形的纯度

F measure计算公式，它的值用 $F_\beta$ 表示，
$$
Precision=\frac {TP} {TP+FP}
$$

$$
Recall=\frac {TP} {TP+FN}
$$

$$
F_\beta=(1+\beta^2) \frac{Precision * Recall}{\beta^2 * Precision + Recall}
$$

在这个公式中， $\beta$ 就是一个权值



RI与F measure的比较：

> The Rand index gives equal weight to false positives and false negatives. Separating similar documents is sometimes worse than putting pairs of dissimilar documents in the same cluster. We can use the *F measure* measuresperf to penalize false negatives more strongly than false positives by selecting a value $\beta > 1$, thus giving more weight to recall.

就是，RI不适用于数据集不平衡的时候，比如，若数据集中本来就有97%的数据属于X，只有另外3%不属于X，当所有示例都被分类成X时，RI值为97%，而这并不代表分类效果很好

还有，在这里 $RI$ 和 $F_\beta$ 的取值范围均为 $[0,1]$，越大表示聚类效果越好



# 文本聚类

怎么将K-means算法应用于文本聚类呢？其中一个方法就是首先将文本转化为TF-IDF特性矩阵

## TF-IDF

TF-IDF，Term Frequency - Inverse Document Frequency，词频-逆文本频率。它由两部分组成，TF和IDF

TF用来表示词频

IDF用来表示逆文档频率，逆文档频率其实是用来反映一个词在所有文档中出现的频率，当一个词在很多文档中出现的时候，其所对应的IDF值也应该变低，当一个词在很少的文档中出现的时候，其所对应的IDF值就会变高

- TF：某个词在文章中出现的总次数/文章的总词数
- IDF：log(语料库中的文档总数/(包含该词的文档数+1)）
- TF-IDF：TF*IDF





参考：

[机器学习之K均值算法（K-means）聚类](https://www.cnblogs.com/qsxbc/p/13833764.html)

[机器学习算法之K-means算法](https://baijiahao.baidu.com/s?id=1622412414004300046&wfr=spider&for=pc)

[基本Kmeans算法介绍及其实现](https://blog.csdn.net/qll125596718/article/details/8243404/)

[Kmeans聚类算法详解](https://blog.csdn.net/qq_32892383/article/details/80107795)

[聚类效果评价指标：MI, NMI, AMI（互信息，标准化互信息，调整互信息）](https://blog.csdn.net/qq_42122496/article/details/106193859)

[Evaluation of clustering](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-clustering-1.html)

[几种常见的聚类评价指标](https://zhuanlan.zhihu.com/p/343667804)

[分类/聚类结果评判指标： TP, TN, FP, FN,purity(纯度),F-scroe(F分数) python实现](https://blog.csdn.net/SAM2un/article/details/85013340)

[归一化互信息(NMI)评价指标](https://blog.csdn.net/hang916/article/details/88783931)

[互信息（Mutual Information）的介绍](https://www.cnblogs.com/emanlee/p/12492561.html)

[猪逻辑公园的互信息（Mutual Information）的介绍](https://blog.csdn.net/qq_15111861/article/details/80724278)

[互信息(Mutual Information)浅尝辄止（一）：基础概念](https://zhuanlan.zhihu.com/p/240676850)

[信息熵的简单理解](https://www.cnblogs.com/daguonice/p/11179662.html)

