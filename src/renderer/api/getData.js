/*
 * 200：success（成功响应）
 * 400：参数错误（传入参数少于或多于应有参数）
 * 404：没有找到（传入的参数有问题）
 * 500：服务器错误（服务器处理出现问题）
 */
// 基本配置
import bus from '@/utils/bus'

// let zmq = require('zeromq')
const baseURL = 'http://127.0.0.1'
// const baseURL = 'tcp://192.168.0.217'
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
  request = new XMLHttpRequest();
  request.responseType = "text";
  // request = zmq.socket('req')
  // 连接服务器
  params = params || {}
  let Param = {
    API,
    params
  }
  request.open('POST', URL + '/' + Param.API, true);
  //request.connect(URL)
  // 当参数为空的时候
  request.send(JSON.stringify(Param.params));
  return new Promise((resolve, reject) => {
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status === 200 || request.status === 304) {
          resolve(JSON.parse(request.responseText));
        }else{
          reject(request.responseText)
        }
      }
    }
  })
}
export default getData