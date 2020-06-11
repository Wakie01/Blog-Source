---
title: Ionic4 打包成Android APK
date: 2020-06-10 15:56:20
tags: 
- Ionic4
- Android
categories: Ionic4
comment: true
addrlink: 2139
---

## 前言
- 向学长学习，我也开始学着自己写博客。

- 之前在做毕业设计时，遇到了很多问题，现在有空我准备将这些问题一一整理下。

- 今天先写个关于Ionic4打包成Android APK的

## 步骤
这里我使用Android Studio打包Apk

### Ionic 构建

``` terminal
 ionic build
```

- 作用：ionic build will perform an Ionic build, which compiles web assets and prepares them for deployment.

之前因为没这步骤，ionic部署到安卓后运行不了，显示`net:error_connection refuse`，或`net:error_file_not_found(file:///android_asset/www/index.html)` 错误


### Android 平台构建

``` terminal
 ionic cordova platform add android
```

- 注意：如果Android platform 已存在，则需先执行下面命令将以前的platform清除

``` terminal
 ionic cordova platform rm android
```

### 修改网络安全配置文件

未修改的话会出现`ERR_ClEARTEXT_NOT_PERMITTED`错误

- 原因：Android9.0对未加密的流量不再信任，添加了新的限制。Google表示，为保证用户数据和设备的安全，针对下一代 Android 系统(Android P) 的应用程序，将要求默认使用加密连接，这意味着 Android P 将禁止 App 使用所有未加密的连接，因此运行 Android P 系统的安卓设备无论是接收或者发送流量，未来都不能明码传输，需要使用下一代(Transport Layer Security)传输层安全协议，而 Android Nougat 和 Oreo 则不受影响。

- 解决方法：在`项目名/platforms/android/app/src/main/res/xml/network_securiy_config.xml`文件中内容修改为如下

``` xml
<network-security-config>
    <base-config cleartextTrafficPermitted="true" />
</network-security-config>
```

然后在`项目名/platforms/android/app/src/main/AndroidManifest.xml`引用：

``` xml
<application
...
android:networkSecurityConfig="@xml/network_security_config"
...
/>
```

- 其它解决方法：Android版本降级、修改服务端，将http协议转换为https协议


### 打包APK

用Android Studio打开 `项目名/platforms/android` 的文件夹

在gradle sync提示框中点击OK

需要改应用名称时，可打开`res/values/string.xml`文件对`app_name`处进行修改

点击Build/Build Bundle(s) apk(s)/Build apk 即可




## 最后
会就简单，不会就满是坑🕳

