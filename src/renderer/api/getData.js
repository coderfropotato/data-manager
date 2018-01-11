/*
 * 200：success（成功响应）
 * 400：参数错误（传入参数少于或多于应有参数）
 * 404：没有找到（传入的参数有问题）
 * 500：服务器错误（服务器处理出现问题）
 */
import bus from "@/utils/bus";
const baseURL = 'http://127.0.0.1'
const PORT = 4242
const URL = baseURL + ':' + PORT
let request
let getData = function (API, params) {
  if (API === '') {
    console.error('请求API为空')
    return
  }
  request = new XMLHttpRequest();
  request.responseType = "text";
  params = params || {}
  let Param = {
    API,
    params
  }
  request.open('POST', URL + '/' + Param.API, true);
  request.send(JSON.stringify(Param.params));
  return new Promise((resolve, reject) => {
    request.onreadystatechange = () => {
      console.log(1);
      if (request.readyState === 4) {
        if (request.status === 200 || request.status === 304) {
          resolve(JSON.parse(request.responseText));
        } else {
          bus.$emit('Error');
          reject(request.responseText)
        }
      }
    }
  })
}
export default getData