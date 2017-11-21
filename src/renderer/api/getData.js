/*
 * 200：success（成功响应）
 * 400：参数错误（传入参数少于或多于应有参数）
 * 404：没有找到（传入的参数有问题）
 * 500：服务器错误（服务器处理出现问题）
*/
// 基本配置
import bus from '@/utils/bus'

let zmq = require('zeromq')
const baseURL = 'tcp://127.0.0.1'
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
  return new Promise((resolve, reject) => {
    // let flag = 0;
    // let timer = setTimeout(function(){
    //   if (flag === 0) {
    //     console.error('服务器无响应' + '\n API: ' + API)
    //     bus.$emit('error',500)
    //     flag = 0
    //   }else{
    //     clearTimeout(timer);
    //   }
    // },outTime);
    request.on('message', function (msg) {
      // flag = 1
      // clearTimeout(timer);
      let rep = JSON.parse(msg)
      if (rep.status === 200) {
        let data = rep.data;
        resolve(data)
      } else if (rep.status === 400) {
        bus.$emit('error',rep.status)
        console.error('参数数目错误' + '\n API: ' + API)
      } else if (rep.status === 500) {
        bus.$emit('error',rep.status)
        console.error('服务器错误' + '\n API: ' + API)
      } else {
        bus.$emit('error',rep.status)
        console.error('参数格式错误' + '\n API: ' + API)
      }
    })
  })
}
export default getData
