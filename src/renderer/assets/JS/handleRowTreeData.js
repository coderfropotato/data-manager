/*
* 处理后台发送的原始文件树数据
* */
// 遍历原始数据，改成能被文件树组件使用的数据格式
function travelTree (obj, data) {
  for (let name in obj) {
    // 文件夹
    if (name === '__info__') {
      continue
    }
    if (Object.keys(obj[name]).length > 1) {
      let temp = {
        label: name.toString(),
        children: []
      }
      data.push(temp)
      travelTree(obj[name], data[data.length - 1].children)
    } else {
      let temp = {
        label: name.toString()
      }
      data.push(temp)
    }
  }
}

export default travelTree
