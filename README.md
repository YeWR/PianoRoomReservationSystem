# PianoRoomReservationSystem
[![Build Status](https://travis-ci.com/YeWR/PianoRoomReservationSystem.svg?token=uJujS3v93YqFPXfQnm9M&branch=master)](https://travis-ci.com/YeWR/PianoRoomReservationSystem)
[![](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/YeWR/PianoRoomReservationSystem/blob/master/LICENSE)
[![](https://img.shields.io/badge/vue-v2.5.7-green.svg)](https://github.com/vuejs/vue)
[![](https://img.shields.io/badge/vue_element_admin-v3.10.0-blue.svg)](https://github.com/PanJiaChen/vue-element-admin)


清华大学艺教中心琴房预约系统

开发者：THU琴房预约小组

## 代码结构

* `front_end`: "用户端前端 (微信小程序) 代码"
* `front_end_manage`: "管理端前端代码"
* `back_end`: "后端代码"

## 技术选型

* 后端 Web 框架: Koa
* 数据库: Mysql + Redis
* 用户端前端: 微信小程序
* 管理端前端: Vue (在 [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin) 的基础上二次开发)


## 相关说明文档

* `interface.md`：接口的设计规范以及所有接口
* `codePattern.md`：变量、函数以及类的命名规范；注释的设计规范等
* `architecture.md`：类的继承关系，设计框架图，思维导图，使用流程等图表以及相关说明
  * `architecture/`：放置相关图片
* `database.md`：数据库设计

## 部署方法

* 管理端前端:
    * `npm install`: 安装依赖包
    * `npm run build:prod`: 构建项目
* 后端:
    * `npm install`: 安装依赖包
    * `node app.js`: 启动服务





