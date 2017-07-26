# 数据管理系统前端模块


## 项目说明
本项目是[数据管理系统](http://54.223.70.246:9000/WoMang/Data-Manager)的前端部分，基于 Vue，Electron，Element—UI等框架构建而成。使用 `zeromq` 和后台进行数据交互。
v
## zeromq 交互模式

### req/rep (request/reply)

```javascript
const baseURL = 'tcp://127.0.0.1'
const PORT = 3000v
const URL = baseURL + ':' +PORT
let zmq = require('zeromq')
// 定义交互方法 req-rep
let request = zmq.socket('req')

// 监听消息响应
request.on('message', function (msg) {
    console.log(msg.toString())
})
// 连接服务器
request.connect(URL)
request.subscribe('')

let Obj = {
    name: 'Test',
    value: 'JSON'
}
let jsonText = JSON.stringify(Obj)
// 发送数据
request.send(jsonText)
```

### sub/pub(subscriber/publisher)

```javascript
const baseURL = 'tcp://127.0.0.1'
const PORT = 3000
const URL = baseURL + ':' +PORT
let zmq = require('zeromq')
// 定义交互方法 sub-pub
let request = zmq.socket('sub')

// 监听消息响应
request.on('message', function (msg) {
    console.log(msg.toString())
})
// 连接服务器
request.connect(URL)
// 订阅消息
request.subscribe('')
```

### pull/push


```javascript
const baseURL = 'tcp://127.0.0.1'
const PORT = 3000
const URL = baseURL + ':' +PORT
let zmq = require('zeromq')
// 定义交互方法 pull-push
let request = zmq.socket('pull')

// 监听消息响应
request.on('message', function (msg) {
    console.log(msg.toString())
})
// 连接服务器
request.connect(URL)
```

## 使用 Sentry 进行错误监控
Sentry 是一个开源的实时错误报告工具，支持 web 前后端、移动应用以及游戏，支持 Python、OC、Java、Go、Node、Django、RoR 等主流编程语言和框架 ，还提供了 GitHub、Slack、Trello 等常见开发工具的集成

在本项目中，我们集成了 Sentry 服务，用于上线后监控用户软件出现的错误。

```bash
npm install raven-js --save
```

```javascript
import Vue from 'vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

Raven
    .config('https://f3c58ec9eb8f47b584c42bed2771ea74@sentry.io/195260')
    .addPlugin(RavenVue, Vue)
    .install();
```

### 在源码中使用 Sentry 进行错误处理
#### 1. try...catch

```javascript
try {
    doSomething(a[0])
} catch(e) {
    Raven.captureException(e)
}
```
不要抛出字符串，抛出一个正真的 `Error` 对象，如下

```javascript
throw new Error('broken')  // good
throw 'broken'  // bad
```

#### 2. context/wrap
`Raven.context` 包裹了一个立即执行的函数，在幕后，`Raven` 将代码包裹在 `try...catch` 中，记录异常。

```javascript
Raven.context(function() {
    doSomething(a[0])
})
```

`Raven.wrap` 和 `Raven.content` 十分类似，不同的是，`Raven.wrap` 返回的是一个函数，而不是执行函数，在回调函数中尤其有用。

```javascript
var doIt = function() {
    // doing cool stuff
}

setTimeout(Raven.wrap(doIt), 1000)
```
## 基本组件结构
### 1. 侧边栏（Sidebar）
侧边栏分为常用功能区导航和功能详情区两部分。

#### 1. 常用功能导航
常用功能导航区是固定的区域，所以直接集成在侧边栏组件中。

#### 2. 功能详情区
功能详情区会根据所选功能发生变化，所以需要划分单独的组件，由 `router-view` 引入。

**功能详情组件**

- 文件
- 搜索
- 最近导入
- 收藏



### 2. 内容区（Content）
内容区分为信息栏和文件列表区，信息栏内容会发生变化，但是为了方便和文件列表区进行数据交互，暂时把信息栏集成到内容区组件中，后期视具体情况而定。

#### 文件详情区
文件列表区可能会包含筛选结果的选项，组件划分需要根据数据交互而定。

### 3.文件信息（FileInfo）
文件信息主要是在右边区域显示文件的一些信息以及属性，抽象为单独的组件，信息内容在状态管理中被设定为单独的模块 `FileInfo.js`。
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
│               └── index.js
└── static # 静态资源

```

