# 数据管理系统前端模块


## 项目说明
本项目是[数据管理系统](http://54.223.70.246:9000/WoMang/Data-Manager)的前端部分，基于 Vue，Electron，Element—UI等框架构建而成。使用 `zeromq` 和后台进行数据交互。


## 项目结构

```bash
.
├── README.md
├── build # 构建生成目录
├── dist  # web 和 electron 生成目录，为以后的 web 端准备
│   ├── electron
│   └── web
├── package-lock.json
├── package.json
├── src  # 源目录
│   ├── index.ejs 
│   ├── main  # 
│   │   ├── index.dev.js # electron 配置文件
│   │   └── index.js # electron 主进程
│   └── renderer # electron 渲染进程
│       ├── App.vue 
│       ├── api # 后台交互 api 封装
│       │   └── index.js 
│       ├── assets # 静态资源 CSS，JS，IMG
│       │   └── logo.png
│       ├── components # Vue单文件组件
│       │   └── index.vue
│       ├── main.js # 入口配置文件
│       ├── router # Vue路由，加载组件，控制导航
│       │   └── index.js
│       └── store # Vue状态管理，模块化
│           ├── index.js
│           └── modules
│               ├── Counter.js
│               └── index.js
└── static # 静态资源

```

