---
abbrlink: ''
categories:
- Termux
cover: termux.png
date: '2022-12-26 23:45:15'
tags:
- 手机搭建服务器
- Termux
title: 【Termux】第1期：在手机中安装Linux系统
updated: Mon, 27 Mar 2023 11:25:04 GMT
---
# 什么是 Termux

Termux 是一个 **Android 终端仿真应用程序**，用于在 **Android 手机上搭建 Linux 环境**， **不需要 root 权限** Termux 就可以正常运行。Termux 可以实现 Linux 下的许多基本操作，可以使用 Termux 安装 python，并实现 python 编程。最重要的是，可以在 Termux 中安装容器，实现**完整的 Linux 系统**。

# Termux 安装

## Termux下载

Termux 可以在[github中下载](https://github.com/termux/termux-app/releases/download/v0.118.0/termux-app_v0.118.0+github-debug_universal.apk)
如果无法访问github，也可以通过[清华镜像源下载](https://mirrors.tuna.tsinghua.edu.cn/fdroid/repo/com.termux_118.apk)

# 开始部署 Linux 环境

对于新手而言，推荐使用别人开发好的脚本。这里推荐使用 **天萌 tmoe** 脚本，里面集成了很多的功能，对新手比较友好。缺点是安装好的环境有一些冗余，大家可以在用熟后自己部署 Linux 环境。
打开 Termux ，界面如下：
<img src="pic1.jpg">
如果可以访问github，使用以下指令：

```bash
curl -LO --compressed https://raw.githubusercontent.com/2moe/tmoe/2/2.awk; awk -f 2.awk
```

如果无法访问github，使用以下指令，从gitee仓库中克隆：

```bash
curl -LO https://gitee.com/mo2/linux/raw/2/2.awk; awk -f 2.awk
```

在执行指令后，会自动下载脚本，选择通过gitee下载
<img src="pic2.jpg">

可以看到选择语言界面，语言选择中文
<img src="pic3.jpg">

这里选择proot容器,选择后会自动安装相关依赖。安装过程中会提示换源，按回车选择北外源
<img src="pic4.jpg" width='400px'>

执行过程中会遇到这样的选项，直接按回车即可
<img src="pic5.jpg" width='400px'>

继续选择proot容器
<img src="pic6.jpg" width='400px'>

终端配色看个人喜好，这里选择了neon
<img src="pic7.jpg" width='400px'>

字体选择Inconsolata-go(粗)
<img src="pic8.jpg" width='400px'>

修改小键选择 Yes
<img src="pic9.jpg" width='400px'>

DNS选择第一个即可
<img src="pic10.jpg" width='400px'>

一言看个人喜好，这里没有开启一言功能
<img src="pic11.jpg" width='400px'>

时区根据个人所在地选择
<img src="pic12.jpg" width='400px'>

挂载目录推荐选择挂载部分目录，这里只挂载了手机中Download目录，即Termux只可以读取手机中Download目录下的内容
<img src="pic13.jpg" width='400px'>

目录挂载的位置，这里挂载到了/home中
<img src="pic14.jpg" width='400px'>

选择proot容器中安装的系统，这里安装Ubuntu 22.04系统
<img src="pic15.jpg" width='400px'>
<img src="pic16.jpg" width='400px'>
<img src="pic17.jpg" width='400px'>

选择启动即可
<img src="pic18.jpg" width='400px'>

接下来需要等待一段时间，安装完成后，出现如下界面，选择 **否**
<img src="pic19.jpg" width='400px'>

这里选择不配置zsh
<img src="pic20.jpg" width='400px'>

选择删除zsh.sh
<img src="pic21.jpg" width='400px'>

选择不启动 tmoe tools
<img src="pic22.jpg" width='400px'>

配置完成后，即可进入Ubuntu 22.04系统
<img src="pic23.jpg" width='400px'>

# 在proot容器中安装 tmoe tools

先前已经在Termux中安装了tmoe tools，这里在容器中同样安装 tmoe tools，方便后续对系统进行软件安装和配置
输入如下指令后，进行 tmoe tools 自动安装

```bash
tmoe
```

安装完成后出现如下界面，选择退出即可
<img src="pic24.jpg" width='400px'>

# 退出容器，返回 Termux

输入如下指令，直至出现 **按回车键返回**

```bash
exit
```

<img src="pic25.jpg" width='400px'>

按下回车，按 ——> 选择cancel
<img src="pic26.jpg" width='400px'>
<img src="pic27.jpg" width='400px'>
<img src="pic28.jpg" width='400px'>
<img src="pic29.jpg" width='400px'>

当出现如下界面时，说明已经返回到了 Termux
<img src="pic30.jpg" width='400px'>
输入如下指令，清理屏幕

```bash
clear
```

<img src="pic31.jpg" width='400px'>

至此，安装完成

# 如何使用？

退出Termux后，想要重新进入容器，可以输入如下指令，进入容器（即刚刚安装的Ubuntu系统）

```bash
debian
```

在进入容器后，即可按照正常的Linux系统进行使用

进入容器后，想要退出容器返回 Termux ，可以输入如下指令

```bash
logout
```

在容器中想要退出程序的时候，最好**先退出容器再关闭app**，防止丢失数据
