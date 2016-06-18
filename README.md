思奇看板Web端解决方案。技术:nodejs+angularJS+gulp.

## 如何启动


1、下载web客户端最新源码并确认你的机器已经安装了[nodeJS](https://nodejs.org/en/);

2、在项目根目录执行`npm install`安装项目的依赖包;

3、在项目根目录执行`gulp`.如果正在开发该项目,请不要退出`gulp`,它将监视文件动态并实时合并出最新的css和js文件;

4、启动前,请确保已经启动[服务端](https://github.com/thiki-org/thiki-kanban-backend)程序;

5、执行`npm start`启动项目.


访问示例:

```
http://localhost:8008/kanban/#/boards
```

# 工具简介(TODO)

工具链大致是这样的(从底层往上看,括号里是相关配置和文件):

* js v8 engine
* node.js
* npm  (~/.npm,  ~/.npmrc, ${project}/package.json)
* bower.js (${project}/bower.json,  ${project}/bower_components)
* gulp (${project}/gulpfile.js)

## npm

nodejs下的组件管理系统
每一个项目下都要执行

``$ npm install``


## bower

类似的有

``$ bower install``

不过npm install会调用bower install

## gulp 入门

* 简介(TODO)

用自动化构建工具增强你的工作流程！

暂时先见[官网](http://www.gulpjs.com.cn/)

* 全局安装gulp

`` npm install --global gulp ``

* 运行gulp task

```
$ cd ${where_thiki-kanban-web_is}
$ gulp
//or specify a task in gulpfile.js
$ gulp watch
```


