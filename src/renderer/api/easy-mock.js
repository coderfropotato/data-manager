let baseURL = 'https://easy-mock.com/mock/59a91558e0dc6633419898c9/mock'

function mockData (url, params) {
  url = baseURL + '/' + url
  for (let item in params) {
    url = url + '?' + item + '=' + params.item
  }
  // 创建 ajax 异步请求
  let xhr = new XMLHttpRequest()
  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 & xhr.status < 300) {
          //  status：响应的HTTP状态码，以2开头的都是成功
          let response = JSON.parse(xhr.responseText)
          resolve(response)
        }
      }
    }
    xhr.open('GET', url, true)
    xhr.send()
  })
}
export default mockData
