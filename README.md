通过机器人更新青龙中的环境变量
---
![GitHub License](https://img.shields.io/github/license/boris1993/qinglong-env-updater)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/boris1993/qinglong-env-updater/build.yml)
![Docker Pulls](https://img.shields.io/docker/pulls/boris1993/qinglong-env-updater)
![Docker Image Version](https://img.shields.io/docker/v/boris1993/qinglong-env-updater)
![Docker Image Size](https://img.shields.io/docker/image-size/boris1993/qinglong-env-updater)

迫于美团脚本的cookie经常过期，而想起更新的时候我通常访问不到自己服务器上的青龙面版，于是开发了这个工具来通过机器人来更新。

## 目前支持的机器人

- 钉钉群聊自定义机器人

## 使用

### 获得青龙的Client ID和Client Secret

- 前往青龙面板的`系统设置`->`应用设置`页面，创建一个新应用并赋予`环境变量`权限
  ![](/docs/qinglong-create-application.png)
- 创建成功后，分别点击Client ID列和Client Secret列的复制图标，得到青龙的Client ID和Client Secret

### 创建和添加机器人

#### 钉钉

- 进入[钉钉管理后台](https://oa.dingtalk.com/)并创建一个组织，因为默认的`淘系技术部开放平台虚拟企业`我们没有管理员权限，不能创建应用
- 使用刚创建的组织登陆[钉钉开放平台](https://open.dingtalk.com/)
- 进入开发者后台的`应用开发`页面，点击`创建应用`，填写`应用名称`和`应用描述`，点击`保存`
- 在`添加应用能力`页面添加`机器人`，打开`机器人配置`的开关并填写需要的内容，`机器人消息预览图`
  随便传个图片就行，`消息接收模式`选`Stream模式`，然后点击`发布`
- 进入`版本管理与发布`页面，点击`创建新版本`，`版本描述`随便写点什么就行，点击`保存`然后点击`直接发布`
- 进入`凭证与基础信息`页面，在`应用凭证`面版中分别点击`Client ID`和`Client Secret`的复制按钮即可得到机器人的Client
  ID和Client Secret
- 进入钉钉客户端，选择组织默认的全员群或创建一个群，点击右上角的`群设置`，点击`机器人`，然后点击`添加机器人`
  ，在搜索框中搜索刚刚创建的应用的名字，然后跟随指引添加

### 部署

如果你访问Docker
Hub有困难，那么也可以换成托管在阿里云的镜像`registry.cn-hangzhou.aliyuncs.com/boris1993/qinglong-env-updater`。

#### Docker

```shell
docker run -d --restart always \
  -e QINGLONG_URL=<青龙的URL，如http://127.0.0.1:5700> \
  -e QINGLONG_CLIENT_ID=<青龙的Client ID> \
  -e QINGLONG_CLIENT_SECRET=<青龙的Client Secret> \
  -e DINGTALK_CLIENT_ID=<钉钉机器人的Client ID> \
  -e DINGTALK_CLIENT_SECRET=<钉钉机器人的Client Secret> \
  -p 3000:3000 \
  --name qinglong-env-updater \
  boris1993/qinglong-env-updater:latest
```

#### Docker Compose

```yaml
---
version: '3'

services:
  qinglong-env-updater:
    image: boris1993/qinglong-env-updater:latest
    container_name: qinglong-env-updater
    restart: always
    environment:
      TZ: Asia/Shanghai
      QINGLONG_URL: <青龙的URL，如http://127.0.0.1:5700>
      QINGLONG_CLIENT_ID: <青龙的Client ID>
      QINGLONG_CLIENT_SECRET: <青龙的Client Secret>
      DINGTALK_CLIENT_ID: <钉钉机器人的Client ID>
      DINGTALK_CLIENT_SECRET: <钉钉机器人的Client Secret>
    ports:
      - '3000:3000'
```

### 使用

| 命令       | 用法                  |
|----------|---------------------|
| 获取所有环境变量 | 获取所有环境变量            |
| 更新环境变量   | 更新环境变量#环境变量名称=环境变量值 |

#### 钉钉

在添加好机器人后，就可以在群里通过at这个机器人的方式来操作，用法见上面的命令一览表。

## 许可协议

该软件依照[MIT](LICENSE)协议开放源代码。
