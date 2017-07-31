/*
 * 200：success（成功响应）
 * 400：参数错误（传入参数少于或多于应有参数）
 * 404：没有找到（传入的参数有问题）
 * 500：服务器错误（服务器处理出现问题）
*/
// 基本配置
let zmq = require('zeromq')
const baseURL = 'tcp://127.0.0.1'
const PORT = 3000
const URL = baseURL + ':' + PORT

// 定义交互方法 req-rep
let request = zmq.socket('req')

// 连接服务器
request.connect(URL)
// 导出的 API 对象
let API = {}
// @return Object
// 发送应用打开信号，获取文件更改信息
API.sendOpenSignal = () => {
  let Param = {
    API: 'sendOpenSignal',
    params: {}
  }
  request.send(Param)
  request.on('message', function (msg) {
    return JSON.parse(msg)
  })
}
// 点击文件导航，获取文件树
API.openFile = () => {
  console.log('openFile')
  let Param = {
    API: 'openFile',
    params: {}
  }
  request.send(Param)
  request.on('message', function (msg) {
    // 进一步处理，是否存入本地数据库
  })
}
// 获取所有文件导航的文件树
// @Param folderName 文件名
API.getAllFileTree = folderName => {
  let Param = {
    API: 'getAllFileTree',
    params: {
      folderName: folderName
    }
  }
  request.send(Param)
  request.on('message', function (msg) {
    // 进一步处理，是否存入本地数据库
  })
}
// 获取回收站的文件树
API.getTrash = () => {
  let Param = {
    API: 'getTrash',
    params: {}
  }
  request.send(Param)
  request.on('message', function (msg) {
    return JSON.parse(msg)
  })
}

// 获取具体文件的信息
// @Param param 参数对象
API.getFileInfo = param => {
  let Param = {
    API: 'getFileInfo',
    params: param
  }
  request.send(Param)
  request.on('message', function (msg) {
    return JSON.parse(msg)
  })
}

export default API
