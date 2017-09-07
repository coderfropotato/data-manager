/*
 * 200：success（成功响应）
 * 400：参数错误（传入参数少于或多于应有参数）
 * 404：没有找到（传入的参数有问题）
 * 500：服务器错误（服务器处理出现问题）
*/
// 基本配置
import bus from '@/utils/bus'

let zmq = require('zeromq')
// const baseURL = 'tcp://10.139.17.101'
const baseURL = 'tcp://172.168.2.25'
// const baseURL = 'tcp://10.139.20.203'
// 端口号
const PORT = 4242
const URL = baseURL + ':' + PORT
// 设置和服务器的延时
const outTime = 5000
let request
let getData = function (API, params) {
  if (API === '') {
    console.error('请求API为空')
    return
  }
  // 定义交互方法 req-rep
  request = zmq.socket('req')
  // 连接服务器
  request.connect(URL)
  // 当参数为空的时候
  params = params || {}
  let Param = {
    API,
    params
  }
  request.send(JSON.stringify(Param))
  let flag = 0
  setTimeout(function () {
    if (flag === 0) {
      console.error('服务器无响应' + '\n API: ' + API)
      bus.$emit('error')
      flag = 0
    }
  }, outTime)
  return new Promise((resolve, reject) => {
    request.on('message', function (msg) {
      flag = 1
      let rep = JSON.parse(msg)
      if (rep.status === 200) {
        let data = rep.data
        // 输出数据
        console.log(API + ':')
        console.log(data)
        resolve(data)
        request.close()
      } else if (rep.status === 400) {
        bus.$emit('error')
        console.error('参数数目错误' + '\n API: ' + API)
      } else if (rep.status === 500) {
        bus.$emit('error')
        console.error('服务器错误' + '\n API: ' + API)
      } else {
        bus.$emit('error')
        console.error('参数格式错误' + '\n API: ' + API)
      }
    })
  })
}
export default getData
