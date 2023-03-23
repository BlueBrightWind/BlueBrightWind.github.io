---
title: 【香橙派5】RK3588s部署yolov5 - 训练部分
date: 2023-03-18 01:31:27
cover: index.png
tags:
 - 香橙派5
 - yolov5
 - rk3588s
categories:
 - 香橙派5
---
# 克隆yolov5仓库
yolov5有很多个版本，这里我们采用官方修改过的yolov5进行训练，[github仓库](https://github.com/airockchip/yolov5)

根据官方介绍，此仓库有如下特性：
 - 基于 https://github.com/ultralytics/yolov5 代码修改，设配 rknpu 设备的部署优化

 - maxpool/ focus 优化，输出改为个branch分支的输出。以上优化代码使用插入宏实现，不影响原来的训练逻辑，这个优化兼容修改前的权重，故支持官方给的预训练权重。

 - 修改激活函数 silu 为 relu

 - 训练的相关内容请参考 README.md 说明

 - 导出模型时 python export.py --rknpu {rk_platform} 即可导出优化模型 
   (rk_platform支持 rk1808, rv1109, rv1126, rk3399pro, rk3566, rk3568, rk3588, rv1103, rv1106)

# 准备数据集
如果只是为了适配rknn框架，可以忽略此步骤，使用官方的模型部署，[官方模型链接](https://github.com/ultralytics/yolov5/releases/download/v6.0/yolov5s.pt)

## 数据集标注
 一般使用labelImg工具进行标注，[github仓库](https://github.com/heartexlabs/labelImg)

## 数据集整理
将数据集整理为如下格式，在yolov5根目录下新建myData文件夹，并做如下处理：
```TEXT
├─ yolov5根目录
│    ├─ xxxxxx
│    ├─ xxxxxx
······
│    ├─ myData
│    │    ├─ (你的数据集名称)
│    │    |    ├─ data.yaml
│    │    │    ├─ train
│    │    │    |    ├─ images
│    │    │    |    └─ labels
│    │    |    ├─ valid
│    │    │    |    ├─ images
│    │    │    |    └─ labels
│    │    ├─ (你的数据集2)
│    │    ├─ (你的数据集3)
│    │    ├─ (xxxxxxxxxx)
······
```
将标注好的数据集按比例分别放入train和valid中的images、labels中，同时每份数据集的data.yaml写入如下内容：
```
nc: (你的数据集类别个数)  
names: ['(你的类别名称1)', '(你的类别名称2)', ......]
train: myData/(你的数据集名称)/train/images
val：myData/(你的数据集名称)/valid/images
```
最后，在 yolov5根目录/models/yolov5s.yaml 文件中，将 nc 更改为你的数据集类别个数，比如，你的数据集有2个类别，分别检测人和车，那么将nc改为2
# 模型训练
将yolov5s.pt模型文件放在yolov5根目录下，输入以下指令
```BASH
python train.py --data myData/(你的数据集名称)/data.yaml --cfg yolov5s.yaml --weights yolov5s.pt
```
# 模型导出
输入以下指令，可以得到onnx模型文件，以及模型对应的anchor，这里保留anchor文件，在后处理部分会用到
```BASH
python export.py --weights (训练得到的模型) --include onnx --rknpu rk3588
```
