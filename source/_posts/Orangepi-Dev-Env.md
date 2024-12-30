---
title: 【香橙派】RK3588搭建 C++ RKNN 开发环境指南
date: 2024-12-30 21:27:18
cover: index.webp
tags:
    - 香橙派
    - rk3588
categories:
    - 香橙派
---

# 基本环境搭建

## 安装 Rockchip MPP 和 Rockchip RGA

用如下脚本安装即可，脚本会自动下载源码并编译安装。如果需要使用代理，可以设置 `ALLOW_PROXY=yes`，并设置 `GITHUB_PROXY` 为代理地址。若需要在安装后清理源码，可以取消注释 `# Clean Files` 部分。

```bash
#!/bin/bash

#############################################################
# Proxy Settings
ALLOW_PROXY=yes
GITHUB_PROXY=https://gh.xmly.dev/

# Media Repository
MPP_REPOSITORY=https://github.com/nyanmisaka/mpp.git
RGA_REPOSITORY=https://github.com/nyanmisaka/rk-mirrors.git

MPP_REPOSITORY_BRANCH=jellyfin-mpp
RGA_REPOSITORY_BRANCH=jellyfin-rga

# Set Install Path
MPP_INSTALL_PATH=/usr/local/mpp
RGA_INSTALL_PATH=/usr/local/rga
#############################################################

# Update Github Repository
if [ -n "$ALLOW_PROXY" ]; then
	MPP_REPOSITORY=$GITHUB_PROXY$MPP_REPOSITORY
  RGA_REPOSITORY=$GITHUB_PROXY$RGA_REPOSITORY
fi

# Install Build Dependencies
apt install -y git cmake build-essential pkg-config meson ninja-build

# Build Rockchip MPP
cd ~
git clone -b $MPP_REPOSITORY_BRANCH --depth=1 $MPP_REPOSITORY mpp
cd mpp
mkdir rkmpp-build
cd rkmpp-build
cmake \
    -DCMAKE_INSTALL_PREFIX=$MPP_INSTALL_PATH \
    -DCMAKE_BUILD_TYPE=Release \
    -DBUILD_SHARED_LIBS=ON \
    -DBUILD_TEST=OFF \
    ..
make -j $(nproc)
make install

# Build Rockchip RGA
cd ~
git clone -b $RGA_REPOSITORY_BRANCH --depth=1 $RGA_REPOSITORY rga
cd rga
meson setup rkrga-build \
    --prefix=$RGA_INSTALL_PATH \
    --libdir=lib \
    --buildtype=release \
    --default-library=shared \
    -Dcpp_args=-fpermissive \
    -Dlibdrm=false \
    -Dlibrga_demo=false
meson configure rkrga-build
ninja -C rkrga-build install

# Set Bash Environment
echo  >> ~/.bashrc
echo '# Rockchip MPP' >> ~/.bashrc
echo export LD_LIBRARY_PATH=$MPP_INSTALL_PATH/lib:'$LD_LIBRARY_PATH' >> ~/.bashrc
echo export PKG_CONFIG_PATH=$MPP_INSTALL_PATH/lib/pkgconfig:'$PKG_CONFIG_PATH' >> ~/.bashrc

echo  >> ~/.bashrc
echo '# Rockchip RGA' >> ~/.bashrc
echo export LD_LIBRARY_PATH=$RGA_INSTALL_PATH/lib:'$LD_LIBRARY_PATH' >> ~/.bashrc
echo export PKG_CONFIG_PATH=$RGA_INSTALL_PATH/lib/pkgconfig:'$PKG_CONFIG_PATH' >> ~/.bashrc

# Clean Files
# cd ~
# rm -rf mpp rga
```

## 安装 Rockchip RKNN

用如下脚本安装即可，脚本会自动下载源码并编译安装。如果需要使用代理，可以设置 `ALLOW_PROXY=yes`，并设置 `GITHUB_PROXY` 为代理地址。若需要在安装后清理源码，可以取消注释 `# Clean Files` 部分。

```bash
#!/bin/bash

#######################################################################
# Proxy Settings
ALLOW_PROXY=yes
GITHUB_PROXY=https://gh.xmly.dev/

# Media Repository
RKNN_REPOSITORY=https://github.com/airockchip/rknn-toolkit2.git
RKNN_REPOSITORY_BRANCH=master

# Set Install Path
RKNN_INSTALL_PATH=/usr/local/rknn
#######################################################################

# Update Github Repository
if [ -n "$ALLOW_PROXY" ]; then
	RKNN_REPOSITORY=$GITHUB_PROXY$RKNN_REPOSITORY
fi

# Install Build Dependencies
apt install -y git cmake

# Build Rockchip MPP
cd ~
git clone -b $RKNN_REPOSITORY_BRANCH --depth=1 $RKNN_REPOSITORY rknn
cd rknn
mkdir -p $RKNN_INSTALL_PATH/include
mkdir -p $RKNN_INSTALL_PATH/lib
mkdir -p $RKNN_INSTALL_PATH/lib/cmake
cp -r rknpu2/runtime/Linux/librknn_api/include/* $RKNN_INSTALL_PATH/include
cp -r rknpu2/runtime/Linux/librknn_api/aarch64/* $RKNN_INSTALL_PATH/lib
cat << EOF >> $RKNN_INSTALL_PATH/lib/cmake/RKNNConfig.cmake
set(PREFIX $RKNN_INSTALL_PATH)
set(RKNN_INCLUDE_DIRS \${PREFIX}/include)
set(RKNN_LIBS \${PREFIX}/lib/librknnrt.so)
if(EXISTS "\${RKNN_INCLUDE_DIRS}" AND EXISTS "\${RKNN_LIBS}")
    set(RKNN_FOUND TRUE)
else()
    set(RKNN_FOUND FALSE)
EOF

# Set Bash Environment
echo  >> ~/.bashrc
echo '# Rockchip RKNN' >> ~/.bashrc
echo export LD_LIBRARY_PATH=$RKNN_INSTALL_PATH/lib:'$LD_LIBRARY_PATH' >> ~/.bashrc
echo export CMAKE_PREFIX_PATH=$RKNN_INSTALL_PATH/lib/cmake:'$CMAKE_PREFIX_PATH' >> ~/.bashrc

# Clean Files
# cd ~
# rm -rf rknn
```

# 高级环境搭建

## 安装 Gstreamer

用如下脚本安装即可。注意：在执行 `meson setup`时，可能会遇到下载问题。若出现下载问题，在执行完成后可以通过 `meson setup gstreamer-build --reconfigure --wipe` 重新配置。

```bash
#!/bin/bash

#####################################################################
# Repository
GST_REPOSITORY=https://gitlab.freedesktop.org/gstreamer/gstreamer.git

GST_REPOSITORY_BRANCH=main

# Set Install Path
GST_INSTALL_PATH=/usr/local/gstreamer
#####################################################################

# Install Build Dependencies
apt install -y git build-essential pkg-config meson ninja-build flex bison openssl libssl-dev libudev-dev python3-pip
pip3 install -U meson

# Build
cd ~
git clone -b $GST_REPOSITORY_BRANCH --depth=1 $GST_REPOSITORY gstreamer
cd gstreamer
meson setup gstreamer-build \
    --prefix=$GST_INSTALL_PATH \
    --libdir=lib \
    --buildtype=release \
    --default-library=shared \
    -Dcpp_args=-fpermissive \
    -Dpython=disabled \
    -Dgpl=enabled \
    -Dpackage-origin=rockchip \
    -Dpackage-name=rockchip-gstreamer \
    -Dqt5=disabled \
    -Dqt6=disabled

meson compile -C gstreamer-build
meson install -C gstreamer-build

# Set Bash Environment
echo  >> ~/.bashrc
echo '# Gstreamer' >> ~/.bashrc
echo export PATH=$GST_INSTALL_PATH/bin:'$PATH' >> ~/.bashrc
echo export LD_LIBRARY_PATH=$GST_INSTALL_PATH/lib:'$LD_LIBRARY_PATH' >> ~/.bashrc
echo export PKG_CONFIG_PATH=$GST_INSTALL_PATH/lib/pkgconfig:'$PKG_CONFIG_PATH' >> ~/.bashrc

# Clean Files
# cd ~
# rm -rf gstreamer
```

## 安装 Gstreamer Rockchip 插件

用如下脚本安装即可，脚本会自动下载源码并编译安装。如果需要使用代理，可以设置 `ALLOW_PROXY=yes`，并设置 `GITHUB_PROXY` 为代理地址。若需要在安装后清理源码，可以取消注释 `# Clean Files` 部分。

```bash
#!/bin/bash

#######################################################################
# Proxy Settings
ALLOW_PROXY=yes
GITHUB_PROXY=https://gh.xmly.dev/

# Repository
GST_PLUGIN_REPOSITORY=https://github.com/JeffyCN/mirrors.git
GST_PLUGIN_REPOSITORY_BRANCH=gstreamer-rockchip

# Set Install Path
GST_PLUGIN_INSTALL_PATH=/usr/local/gstreamer
#######################################################################

# Update Github Repository
if [ -n "$ALLOW_PROXY" ]; then
	GST_PLUGIN_REPOSITORY=$GITHUB_PROXY$GST_PLUGIN_REPOSITORY
fi

# Install Build Dependencies
apt install -y git build-essential pkg-config meson ninja-build

cd ~
git clone -b $GST_PLUGIN_REPOSITORY_BRANCH --depth=1 $GST_PLUGIN_REPOSITORY gstreamer-rockchip
cd gstreamer-rockchip
meson setup gstreamer-plugin-build \
    --prefix=$GST_PLUGIN_INSTALL_PATH \
    --libdir=lib \
    --buildtype=release \
    -Dcpp_args=-fpermissive \
    -Dpackage-name=gstreamer-rockchip \
    -Dpackage-origin=gstreamer-rockchip

meson compile -C gstreamer-plugin-build
meson install -C gstreamer-plugin-build

# Clean Files
# cd ~
# rm -rf gstreamer-rockchip
```

安装完成后，可以通过 `gst-inspect-1.0 | grep mpp` 查看是否安装成功，若显示如下内容，则安装成功。

```bash
gst-inspect-1.0 | grep mpp
rockchipmpp:  mpph264enc: Rockchip Mpp H264 Encoder
rockchipmpp:  mpph265enc: Rockchip Mpp H265 Encoder
rockchipmpp:  mppjpegdec: Rockchip's MPP JPEG image decoder
rockchipmpp:  mppjpegenc: Rockchip Mpp JPEG Encoder
rockchipmpp:  mppvideodec: Rockchip's MPP video decoder
rockchipmpp:  mppvp8enc: Rockchip Mpp VP8 Encoder
rockchipmpp:  mppvpxalphadecodebin: VP8/VP9 Alpha Decoder
typefindfunctions: audio/x-musepack: mpc, mpp, mp+
```

## 安装 OpenCL 动态库

用如下脚本安装即可。注意：仅测试过 `ubuntu rockchip` 的系统，其他系统暂未测试

```bash
#!/bin/bash

apt install -y software-properties-common clinfo
add-apt-repository -y ppa:jjriek/panfork-mesa
apt install -y libmali-g610-x11
```

安装后可以通过 `clinfo` 查看是否安装成功

## 安装 OpenCV

用如下脚本安装即可，脚本会自动下载源码并编译安装。如果需要使用代理，可以设置 `ALLOW_PROXY=yes`，并设置 `GITHUB_PROXY` 为代理地址。若需要在安装后清理源码，可以取消注释 `# Clean Files` 部分。

注意：该脚本仅仅开起了 `core highgui imgcodecs imgproc videoio` 模块，为精简版 OpenCV，若需要其他模块，可以自行添加，且视频编解码模块仅开启了 `Gstreamer` ，未使用 `FFMPEG`。

注意：该脚本使用 `Wayland` 作为显示后端，若需要使用 `GTK` 显示后端，可以将 `-DWITH_GTK=OFF` 改为 `-DWITH_GTK=ON`，并执行 `apt install libgtk-3-dev` 安装 `GTK` 依赖。

注意：该脚本启用了 `OpenCL` 支持，若不需要 `OpenCL` 支持，可以将 `-DWITH_OPENCL=ON` 改为 `-DWITH_OPENCL=OFF`。

```bash
#!/bin/bash

#######################################################################
# Proxy Settings
ALLOW_PROXY=yes
GITHUB_PROXY=https://gh.xmly.dev/

# Media Repository
OPENCV_REPOSITORY=https://github.com/opencv/opencv.git
OPENCV_REPOSITORY_BRANCH=4.10.0

# Set Install Path
OPENCV_INSTALL_PATH=/usr/local/opencv
#######################################################################

# Update Github Repository
if [ -n "$ALLOW_PROXY" ]; then
	OPENCV_REPOSITORY=$GITHUB_PROXY$OPENCV_REPOSITORY
fi

# Install Build Dependencies
apt install -y git cmake build-essential wayland-protocols libwayland-dev \
    libwayland-client0 libwayland-cursor0 libwayland-egl1

# Build OpenCV
cd ~
git clone -b $OPENCV_REPOSITORY_BRANCH --depth=1 $OPENCV_REPOSITORY opencv
cd opencv
mkdir rkopencv-build
cd rkopencv-build
cmake \
    -DBUILD_DOCS=OFF \
    -DBUILD_SHARED_LIBS=ON \
    -DBUILD_FAT_JAVA_LIB=OFF \
    -DBUILD_TESTS=OFF \
    -DBUILD_TIFF=ON \
    -DBUILD_JASPER=ON \
    -DBUILD_JPEG=ON \
    -DBUILD_PNG=ON \
    -DBUILD_ZLIB=ON \
    -DBUILD_OPENEXR=OFF \
    -DBUILD_opencv_apps=OFF \
    -DBUILD_opencv_calib3d=OFF \
    -DBUILD_opencv_contrib=OFF \
    -DBUILD_opencv_features2d=OFF \
    -DBUILD_opencv_flann=OFF \
    -DBUILD_opencv_gpu=OFF \
    -DBUILD_opencv_java=OFF \
    -DBUILD_opencv_legacy=OFF \
    -DBUILD_opencv_ml=OFF \
    -DBUILD_opencv_nonfree=OFF \
    -DBUILD_opencv_objdetect=OFF \
    -DBUILD_opencv_ocl=OFF \
    -DBUILD_opencv_photo=OFF \
    -DBUILD_opencv_python2=OFF \
    -DBUILD_opencv_python3=OFF \
    -DBUILD_opencv_gapi=OFF \
    -DBUILD_opencv_highgui=ON \
    -DBUILD_opencv_stitching=OFF \
    -DBUILD_opencv_superres=OFF \
    -DBUILD_opencv_ts=OFF \
    -DBUILD_opencv_video=OFF \
    -DBUILD_opencv_videostab=OFF \
    -DBUILD_opencv_videoio=ON \
    -DBUILD_opencv_world=OFF \
    -DBUILD_opencv_lengcy=OFF \
    -DBUILD_opencv_dnn=OFF \
    -DWITH_1394=OFF \
    -DWITH_EIGEN=OFF \
    -DWITH_FFMPEG=OFF \
    -DWITH_GIGEAPI=OFF \
    -DWITH_GSTREAMER=ON \
    -DWITH_GTK=OFF \
    -DWITH_WAYLAND=ON \
    -DWITH_PVAPI=OFF \
    -DWITH_V4L=ON \
    -DWITH_LIBV4L=OFF \
    -DWITH_CUDA=OFF \
    -DWITH_CUFFT=OFF \
    -DWITH_OPENCL=ON \
    -DWITH_OPENCLAMDBLAS=OFF \
    -DWITH_OPENCLAMDFFT=OFF \
    -DWITH_OPENMP=ON \
    -DCMAKE_BUILD_TYPE=RELEASE \
    -DCMAKE_INSTALL_PREFIX=$OPENCV_INSTALL_PATH \
    ..
make -j $(nproc)
make install

# Set Bash Environment
echo  >> ~/.bashrc
echo '# OpenCV' >> ~/.bashrc
echo export LD_LIBRARY_PATH=$OPENCV_INSTALL_PATH/lib:'$LD_LIBRARY_PATH' >> ~/.bashrc
echo export CMAKE_PREFIX_PATH=$OPENCV_INSTALL_PATH/lib/cmake:'$CMAKE_PREFIX_PATH' >> ~/.bashrc

# Clean Files
# cd ~
# rm -rf rknn

```
