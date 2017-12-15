# 数据管理系统前端模块


## 项目说明
本项目是[数据管理系统](http://54.223.70.246:9000/WoMang/Data-Manager)的前端部分，基于 Vue，Electron，Element—UI等框架构建而成。使用 `zeromq` 和后台进行数据交互。


## 运行

```bash
# 运行开发
npm run dev

# 打包（需要在具体平台下运行打包，详情见package.json）
npm run build

# 解决 electron 版本的问题
npm rebuild zeromq --runtime=electron --target=1.6.11

# 和后台连接调试（需要在同一局域网下）
# 在 api/index.js 文件中设置 IP 地址和端口号即可
```

## zeromq 交互模式
api/index 封装的为 `req/rep` 模式，暂未采用其他模式。

### req/rep (request/reply)

```javascript
const baseURL = 'tcp://127.0.0.1'
const PORT = 3000
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

### 在源码中使用 Sentry 进行错误处理（未使用）
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
常用功能导航区是固定的区域，所以直接集成在侧边栏路由加载组件中。

#### 2. 功能详情区
功能详情区会根据所选功能发生变化，需要划分单独的组件，再由侧边栏路由加载组件中的 `router-view` 引入。

**功能详情组件**

- 文件（点击文件，进行文件的浏览）
  - 所有文件
  - 分类
  - 回收站
  - 忽略 
- 搜索（完成搜索功能的引导，选择搜索引擎）
  - 搜索引擎 
- 文件状态（完成查看文件状态的引导，目前重用的是文件组件中的 `tree` 组件，需要根据具体情况进行更改或优化）
- 收藏（暂未实现）

### 2. 内容区（Content）
内容区组要有信息栏组件和文件列表组件，还有搜索的条件组件，信息栏内容会发生变化（文件和搜索的信息栏内容不同），分离成了不同的组件，文件列表组件 也会有不同的展现形式，所以把内容划分成了三块，头部，中部和底部，每个部分采用不同的命名视图进行加载，顶部主要负责搜索框，导航和切换列表显示状态的功能，中部负责加载搜索条件，底部负责加载不同的列表显示组件。

### 3.文件信息（FileInfo）
文件信息主要是在右边区域显示文件的一些信息以及属性，抽象为单独的组件，信息内容在状态管理中被设定为单独的模块 `fileInfo.js`。

## 项目结构

**基本结构**

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

**`src` 详细结构**

```bash
.
├── index.ejs
├── main # 主进程
│   ├── index.dev.js
│   └── index.js # 新建窗口，管理窗口之间的通信
└── renderer # 渲染进程
    ├── App.vue
    ├── api
    │   ├── data.js # 模拟数据
    │   ├── database.js # indexedDB 缓存优化（未实现）
    │   └── index.js # 和后台交互的 API 调用方法封装
    ├── assets # 资源文件
    │   ├── JS
    │   │   ├── bus.js # 中间通信组件，用于非父子组件之间的通信
    │   │   ├── convertJSON.js 
    │   │   ├── fileAttributesTemplates.js
    │   │   ├── handleCategoryTreeData.js # 将获得的数据提取成可用的数据
    │   │   ├── headerScrollbar.js # 控制导航面包屑滚动
    │   │   └── searchScrollbar.js # 控制导航面包屑滚动
    │   ├── SCSS
    │   │   ├── animate.scss # 动画
    │   │   ├── common.scss # 公共样式
    │   │   └── resizable.scss # 三栏可变宽样式
    │   └── logo.png
    ├── components
    │   ├── Content
    │   │   ├── content.vue # 加载具体组件的路由
    │   │   ├── contentBottom.vue # 加载List或uploadFile组件的路由
    │   │   ├── diskDirectory.vue # 所有文件目录浏览
    │   │   ├── fileListHeader.vue # 文件列表导航，搜索
    │   │   ├── fileStatus.vue # 展示文件状态
    │   │   ├── ignore.vue # 展示忽略文件
    │   │   ├── importFile.vue # 导入文件
    │   │   ├── list.vue # 展示文件列表
    │   │   ├── searchHeader.vue # 搜索功能
    │   │   └── smartCategory.vue # 智能视图
    │   ├── FileAside
    │   │   ├── fileAside.vue # 加载具体组件的路由
    │   │   ├── fileInfo.vue # 展示文件详情
    │   │   └── fileStatusAside.vue # 文件状态编辑 
    │   ├── NewDirectory
    │   │   ├── excelImport.vue # 导入Excel
    │   │   ├── newDirectory.vue # 加载具体组件的路由
    │   │   ├── newDiskDirectory.vue # 新增所有文件目录 
    │   │   └── newSmartCategory.vue # 新增智能视图
    │   ├── Sidebar
    │   │   ├── Files.vue # 文件
    │   │   ├── collection.vue # 收藏
    │   │   ├── fileStatus.vue # 文件状态
    │   │   ├── search.vue # 搜索
    │   │   └── sidebar.vue # 加载具体组件的路由
    │   └── index.vue
    ├── main.js
    ├── router
    │   ├── index.js 
    │   ├── loadContent.js # 加载内容区的具体组件
    │   └── newDirectory.js # 加载各种新增目录的组件（打开新的窗口）
    └── store
        ├── index.js
        ├── modules
        │   ├── authors.js # 处理智能视图的部分数据
        │   ├── excel.js # 处理 Excel 导入导出的数据和 API 交互
        │   ├── fileInfo.js # 处理文件详情的数据和 API 交互
        │   ├── files.js # 处理文件的数据和 API 交互
        │   ├── index.js
        │   ├── modified.js # 处理文件状态的数据和 API 交互
        │   ├── newDirectory.js # 处理新建目录的数据和 API 交互
        │   ├── search.js # 处理搜索功能的数据和 API 交互
        │   └── showControl.js # 控制某些组件是否显示（文件详情）
        └── mutation-types.js
```


pack command
依赖于：`git`, `virtualenv`
```shell
# clean workspace
cd data-manager-front-end
rm -rf .backend

# init backend
git clone git@54.223.70.246:data-management/data-manager-back-end.git .backend
virtualenv .backend/venv
source .backend/venv/bin/activate
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r .backend/requirements.txt

# pack backend
cd .backend && venv/bin/pyinstaller --add-data 'config/*:config' --distpath '../dist' -y -n backend  ./run.py

# run backend(test)
../dist/backend/backend

# pack frontend
cd -
npm run build:darwin
```