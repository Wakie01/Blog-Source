---
title: pytorch多gpu训练
comment: true
date: 2021-10-19 09:43:23
tags: pytorch
categories: DL
addrlink: 1534
---



pytorch多gpu训练的方法主要有2个：`DataParallel` 与 `DistributedDataParallel`

都说`DistributedDataParallel` 比 `DataParallel` 好，所以这里只整理前者。



# 运行流程

## 单卡训练

1. 初始化模型
2. 配置训练的GPU
3. 将模型及其相关参数转移到GPU上
4. 配置损失函数和优化器
5. 加载数据集
6. 配置训练代码
7. 训练





## 多卡训练

1. 配置使用的GPU，节点数，以及每个节点的GPU数，然后计算world_size

2. 配置rank

3. 初始化进程组

   ```python
   torch.distributed.init_process_group(backend=dist_backend,  init_method="env://", world_size=world_size, rank=rank)
   ```

   参数说明：

   - dist_backend：GPU环境默认值nccl, NPU环境默认值hccl
   - world_size：取值1,2,4,8。8p训练参数配置为8
   - rank：进程id，每个进程对应一个id

4. 初始化模型

5. 将模型及其相关参数转移到GPU上

   ```python
   model.cuda(gpu)
   ```

6. 配置损失函数和优化器

7. 将模型封装成一个torch.nn.parallel.DistributedDataParallel模型，把模型复制到GPU上进行处理

   ```python
   model = nn.parallel.DistributedDataParallel(model, device_ids=[gpu])
   ```

8. 加载数据集

9. 将数据集分配到各个GPU上

   ```python
   train_sampler = torch.utils.data.distributed.DistributedSampler(
       train_dataset,
       num_replicas=args.world_size,
       rank=rank
   )
   ```

10. 修改DataLoader

    ```python
    train_loader = torch.utils.data.DataLoader(
        dataset=train_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=0,
        pin_memory=True,
        sampler=train_sampler
    )
    ```

11. 配置训练代码

12. 配置进程间通信所需的环境变量

    ```python
    os.environ['MASTER_ADDR'] = '127.0.0.1'
    os.environ['MASTER_PORT'] = '8888'
    ```

13. 多GPU训练

    ```python
    torch.multiprocessing.spawn(fn=train, nprocs=args.gpus, args=(args,))
    ```

    该函数会生成args.gpus个进程，每个进程都运行train(i,args)，其中i从0到args.gpus-1

    参数说明：

    - fn：需要多进程运行的函数，函数格式：`fn(i,*args)` ，其中i是进程索引
    - nprocs：总的进程数
    - args：传给fn函数的参数



## 使用Apex进行混合混合精度训练



1. 配置使用的GPU，节点数，以及每个节点的GPU数，然后计算world_size

2. 配置rank。rank：进程在所有进程中的阶序

3. 初始化进程组

   ```python
   torch.distributed.init_process_group(backend=dist_backend,  init_method="env://", world_size=world_size, rank=rank)
   ```

   参数说明：

   - dist_backend：GPU环境默认值nccl, NPU环境默认值hccl
   - world_size：总的进程数，等于总的gpu数，取值1,2,4,8。8p训练参数配置为8
   - rank：进程id，每个进程对应一个id

4. 初始化模型

5. 将模型及其相关参数转移到GPU上

   ```python
   model.cuda(gpu)
   ```

6. 配置损失函数和优化器

7. 将模型和优化器为了进行后续混合精度训练而进行封装

   ```python
   # 注意，amp.initialize必须在DDP(DistributedDataParallel)之前，否则多卡时会有报错提示
   # 还有，在调用 amp.initialize 之前，模型必须已经部署在GPU上
   model, optimizer = amp.initialize(
       model, 
       optimizer,
       opt_level='O2',
       loss_scale=128.0
   )
   ```

   > 推荐优先使用 ```opt_level='O2', loss_scale=128.0``` 的配置进行amp.initialize
   > 若无法收敛推荐使用 ```opt_level='O1', loss_scale=128.0``` 的配置进行amp.initialize
   > 若依然无法收敛推荐使用 ```opt_level='O1', loss_scale=None``` 的配置进行amp.initialize

   

8. 将模型封装成一个apex.parallel.DistributedDataParallel模型，把模型复制到GPU上进行处理

   ```python
   model = apex.parallel.DistributedDataParallel(model)
   ```

   apex.parallel.DistributedDataParallel是一个nn.DistributedDataParallel的替换版本，不需要指定GPU，因为Apex在一个进程中只允许用一个GPU

9. 加载数据集

10. 将数据集分配到各个GPU上

    ```python
    train_sampler = torch.utils.data.distributed.DistributedSampler(
        dataset=train_dataset,
        num_replicas=args.world_size,
        rank=rank
    )
    ```

    参数说明：

    - dataset：用于采样的数据集
    - num_replicas：将数据集划分多少份
    - rank：当前进程的索引号

11. 修改DataLoader

    ```python
    train_loader = torch.utils.data.DataLoader(
        dataset=train_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=0,
        pin_memory=True,
        sampler=train_sampler
    )
    ```

12. 配置训练代码

    在训练代码中，需要修改：

    ```python
    ...
    # loss.backward() becomes:
    with amp.scale_loss(loss, optimizer) as scaled_loss:
        scaled_loss.backward()
    ...
    ```

    

13. 配置进程间通信所需的环境变量

    ```python
    os.environ['MASTER_ADDR'] = '127.0.0.1'
    os.environ['MASTER_PORT'] = '8888'
    ```

14. 多GPU训练

    ```python
    torch.multiprocessing.spawn(fn=train, nprocs=args.gpus, args=(args,))
    ```

    该函数会生成args.gpus个进程，每个进程都运行train(i,args)，其中i从0到args.gpus-1

    一般来说，一个gpu就一个进程。

    参数说明：

    - fn：需要多进程运行的函数，函数格式：`fn(i,*args)` ，其中i是进程索引
    - nprocs：总的进程数
    - args：传给fn函数的参数













参考：

[Pytorch中的Distributed Data Parallel与混合精度训练(Apex)](https://zhuanlan.zhihu.com/p/105755472)





