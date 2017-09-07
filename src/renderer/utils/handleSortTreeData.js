/*
* 处理后台发送的原始文件树数据
* */
// 遍历原始数据，改成能被文件树组件使用的数据格式
function travelTree (obj, data, Id) {
  for (let name in obj) {
    if (name === '__info__') {
      continue
    }
    // 文件夹
    if (Object.keys(obj[name]).length >= 1) {
      let temp = {
        id: '',
        inputShow: 'none',
        labelShow: 'inline-block',
        label: name.toString(),
        children: []
      }
      temp.id = Id
      temp.id += name + '/'
      data.push(temp)
      travelTree(obj[name], data[data.length - 1].children, temp.id)
    } else {
      let temp = {
        id: [],
        inputShow: 'none',
        labelShow: 'inline-block',
        label: name.toString()
      }
      temp.id = Id
      temp.id += name + '/'
      data.push(temp)
    }
  }
}

export default travelTree
