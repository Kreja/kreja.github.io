---
layout: post
title: John Snow 系列之在 GCP 上搭建微信机器人
category: study
tags: vps
description: 通过本文，小白 John Snow 也可以在 Google Cloud Platform 上搭建一个自动回复机器人
---

# GCP
即 [Google Cloud Platform](https://console.cloud.google.com)，现在注册免费送 300 刀可以用 12 个月，不用白不用，用了也白用，白用谁不用？

前提条件，作为 John Snow 可以什么都不知道，但至少得有个梯子来上 GCP，并且有张（据说要双币）信用卡来注册 GCP，没有的自己想办法或者自动 go die。

废话不多说，请自行完成注册~

# 创建实例
搜索 "Compute Engine" 进入“实例”。

![instance](/public/upload/study/20180502-entry.png)

点击上方“创建实例”进入创建页面。

![](/public/upload/study/20180502-create.png)

注意以下三个地方的选择，其他选默认即可。

1. 地区选择 "asia-east1-c" 好了，选其他也可以，看你在哪了，在大陆嘛就选这个好了。
![](/public/upload/study/20180502-area.png)

2. 机器类型选“微型”即可。<br />
![](/public/upload/study/20180502-type.png)

3. 防火墙“允许 HTTP 流量”、“允许 HTTPS 流量”都勾选上。
![](/public/upload/study/20180502-firewall.png)

然后点击创建。

# 准备机器人代码

这段代码（没错是 python，你不会？没关系，我也不会的，跟着做就行了。）来自于 [itchat](http://itchat.readthedocs.io/zh/latest/tutorial/tutorial0/#_5)，就是接收到来自 A 的微信消息后，发给图灵机器人，然后得到机器人的回复，再把机器人的回复发给 A。

```python
# -*- coding: utf-8 -*-

import requests
import itchat

defaultText = u'已收到您的消息'
KEY = '8edce3ce905a4c1dbb965e6b35c3834d'

def get_response(msg):
    apiUrl = 'http://www.tuling123.com/openapi/api'
    data = {
        'key'    : KEY,
        'info'   : msg,
        'userid' : 'wechat-robot',
    }
    try:
        r = requests.post(apiUrl, data=data).json()
        return r.get('text')
    except:
        return

@itchat.msg_register(itchat.content.TEXT)
def auto_reply(msg):
    return u'自动回复：' + (get_response(msg.text) or defaultText)

itchat.auto_login(hotReload=True, enableCmdQR=2)
itchat.run()
```

将以上代码保存为一个 `bot.py` 文件。

# 上传代码

点击“SSH”打开连接窗口

![](/public/upload/study/20180502-ssh.png)

![](/public/upload/study/20180502-window.png)

点击“右上角设置按钮-上传文件”，上传刚才保存的 `bot.py`。

![](/public/upload/study/20180502-upload.png)

在 ssh 窗口执行 `ls`，发现 `bot.py` 已经上传了

![](/public/upload/study/20180502-botpy.png)

# 安装环境

申请到的机器是自带 python 的

执行 `sudo apt-get install python-pip`，安装 pip

执行 `pip install itchat`，安装 itchat

# 运行

执行 `python bot.py` 先跑一遍，这一遍是为了种下登录态。

在窗口里会输出一个二维码，用微信扫描登录即可，登录后就可以自动回复别人给你发的消息了，你可以给自己发一条试试，也会有自动回复。

![](/public/upload/study/20180502-reply.png)

但是仅仅执行 `python bot.py`，一旦你关闭 ssh 窗口，进程就自杀了，所以我们要让这个代码一直在后台跑才行。

先按下 ctrl + C 手动杀掉进程，执行 `ls` 会发现多了一个 `itchat.pkl` 文件，这就是记录登录信息的文件。

![](/public/upload/study/20180502-itchatpkl.png) 

然后执行 `nohup python -u bot.py >& output.log &` 就可以在后台一直跑了，程序输出的日志记录在 `output.log` 这个文件里，你可以不用管。

至此，你可以关掉 ssh 窗口，关上电脑，你的微信也依旧会帮你进行自动回复，回复内容正不正经我就不知道了。

# 结束后台进程

如果你不想要自动回复了，按以下命令杀掉进程即可。（稍微学点 python 你可以自己写一个微信命令来控制自动回复的开关）

执行 `ps -ef |grep python` 列出进程，发现对应的 pid 是 7570。

![](/public/upload/study/20180502-ps.png)

执行 `kill -9 7570`，然后发现进程已经被杀死了，你的微信就不会再自动回复了。

![](/public/upload/study/20180502-kill.png)

