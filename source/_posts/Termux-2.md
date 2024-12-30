---
title: 【Termux】第2期：通过 ssh 连接手机 Termux 服务器
date: 2022-12-28 21:21:42
cover: termux.png
tags:
    - 手机搭建服务器
    - Termux
    - 开启 SSH 服务
categories:
    - Termux
---

# 上期回顾

在上一期中，在 Termux 软件中通过 proot 容器安装了 Ubuntu 22.04 系统。这个是完整的 Linux 系统，可以像操作远程服务器一样对容器进行操作。但由于是手机软件模拟的容器，在开启一些服务的时候并不能像一般的 Linux 系统一样操作，需要一些特殊的方式。本期主要讲述开启 ssh 服务，可以通过电脑端使用 VS Code 对手机服务器进行操作。

# 进入 Termux proot 容器

```bash
debian
```

<img src="pic2.jpg" width='400px'>

# 通过 apt 方式安装 openssh-server

执行以下指令，安装 openssh-server

```bash
apt update
apt install openssh-server
```

<img src="pic3.jpg" width='400px'>
安装完成后显示如下：
<img src="pic4.jpg" width='400px'>

# 修改 openssh 默认启动端口

由于通过 proot 容器的方式安装系统，在这种方式下 Android 系统会对软件做出限制，使得软件无法启用 1024 以下的端口号。openssh 默认端口号为 22，需要将端口号更改为 1024 以上的端口，端口号可以随意指定，这里我们将端口号改为 8022 端口。

## 进入 openssh-server 配置文件夹

```bash
cd /etc/ssh
```

## 通过 vim 编辑器修改配置

```bash
vim sshd_config
```

<img src="pic5.jpg" width='400px'>
<ol>
<li>进入编辑器后，输入 i 进入编辑模式</li>
<li>找到 Port ，删除前面的 # ，将22修改为8022</li>
<li>按 ↓ ，找到 PermitRootLogin ，删除前面的 #，将后面的内容修改为 yes</li>
<li>修改完成后，按 Esc 退出编辑模式</li>
<li>输入 :wq ,回车保存退出</li>
</ol>
如图所示，进入编辑器后可以看到如下界面：
<img src="pic6.jpg" width='400px'>
需要修改 Port 和 PermitRootLogin 两个属性
<img src="pic7.jpg" width='400px'>
<img src="pic8.jpg" width='400px'>

# 开启 ssh 服务

配置完成后，执行以下指令，开启 ssh 服务

```bash
service ssh start
```

执行以下指令，检查 ssh 状态

```bash
service ssh status
```

若显示 sshd is running，则启动成功，如图所示：
<img src="pic9.jpg" width='400px'>

# 开机自动启动 ssh 服务

对于 tmoe 工具，可以通过修改配置文件实现启动容器的同时自动开启服务
执行如下指令，进入配置文件夹：

```bash
cd /usr/local/etc/tmoe-linux/environment
```

编辑 entrypoint 文件

```bash
vim entrypoint
```

写入如下指令，编辑方式同上

```bash
echo 开启 ssh 服务
service ssh start
```

保存退出，方式同上
如图所示：
<img src="pic10.jpg" width='400px'>
<img src="pic11.jpg" width='400px'>

# 验证 ssh 服务是否自启

输入如下指令，退出容器

```bash
logout
```

输入如下指令，重新启动容器

```bash
debian
```

如果看到以下语句，则自启成功
<img src="pic12.jpg" width='400px'>
