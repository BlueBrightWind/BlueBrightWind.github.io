---
title: 【香橙派】RK3588安装 watchload 负载监控工具
date: 2025-01-03 00:10:05
cover: watchload.jpg
tags:
    - 香橙派
    - rk3588
categories:
    - 香橙派
---

# watchload 负载监控工具

## 工具简介

该工具旨在方便地查看设备`(CPU/GPU/RGA/NPU/MEM)`的信息，并为设备提供在`不同工作模式之间切换`的能力。

## 工具安装

用如下脚本安装即可，脚本会自动下载源码并编译安装。如果需要使用代理，可以设置 `ALLOW_PROXY=yes`，并设置 `GITHUB_PROXY` 为代理地址。若需要在安装后清理源码，可以取消注释 `# Clean Files` 部分。

```bash
#!/bin/bash

#######################################################################
# Proxy Settings
ALLOW_PROXY=yes
GITHUB_PROXY=https://gh.xmly.dev/

# Repository
WATCHLOAD_REPOSITORY=https://github.com/BlueBrightWind/watchload-rk3588.git
WATCHLOAD_REPOSITORY_BRANCH=main

# Set Install Path
WATCHLOAD_INSTALL_PATH=/usr/local/watchload
#######################################################################

if [ -n "$ALLOW_PROXY" ]; then
    WATCHLOAD_REPOSITORY=$GITHUB_PROXY$WATCHLOAD_REPOSITORY
fi

# Install Dependencies
sudo apt install -y git

# Install Tool
cd ~
git clone -b $WATCHLOAD_REPOSITORY_BRANCH --depth=1 $WATCHLOAD_REPOSITORY watchload
cd watchload
bash install.sh

# Clean Files
# cd ~
# rm -rf watchload
```

## 工具截图

<img src="watchload.jpg" width='800px'>
