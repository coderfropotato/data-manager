/*
 * 对文件的基本信息进行格式化处理
 */

// 对时间进行格式化处理，返回 xxxx/xx/xx 的格式
export const formatDate = function (date) {
  let d = new Date(date * 1000)
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()
  let year = d.getFullYear()
  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day
  return [year, month, day].join('/')
}

/*
* @fileList Array  文件信息数组
* @maxLength Number 文件的最大长度
* @return 处理完成的文件数组
* 需要根据传入的数据类型（数组或对象）做不同处理
*/
function formatFileData (data, maxLength) {
  let rowListData = []
  let filesData = []
  let isArray = true
  // 如果是单个文件信息对象，则包装成数组
  if (Array.isArray(data)) {
    // 如果传进的数据为空的数组，则返回空的数组
    if (data.length === 0) {
      return []
    }
    isArray = true
    rowListData = data
  } else if (typeof data === 'object') {
    if (Object.keys(data).length === 0) {
      // 如果传进的数据为空的对象，则返回空的对象
      return {}
    }
    isArray = false
    rowListData.push(data)
  }

  // 添加文件路径
  for (let item in rowListData) {
    let fileInfo = {}
    // 单独的对象没有 basic 属性，要做特殊处理
    isArray ? Object.assign(fileInfo, rowListData[item].basic) : Object.assign(fileInfo, rowListData[item])
    fileInfo.serialNumber = isArray ? rowListData[item].serial_number : ''
    // 格式化创建时间
    fileInfo.ctime = formatDate(fileInfo.ctime)
    fileInfo.rowName = fileInfo.name
    // 格式化文件名，如果文件名大于某个长度，则做截断处理
    if (fileInfo.name.length > maxLength) {
      fileInfo.name = fileInfo.name.substring(0, maxLength - 1) + '...'
    }
    // 格式化文件大小
    let size = fileInfo.size
    if (size < 1024) {
      size = size + 'B'
    } else if (size >= 1024 && size < 1024 * 1024) {
      size = parseInt(size / 1024) + 'KB'
    } else if (size >= 1024 * 1024 && size < Math.pow(1024, 3)) {
      size = parseInt(size / 1024 / 1024) + 'M'
    } else {
      size = parseInt(size / Math.pow(1024, 3)) + 'G'
    }
    fileInfo.size = size
    // 将
    filesData.push(fileInfo)
  }
  if (!isArray) {
    filesData = filesData[0]
  }
  // 返回处理好的文件信息数组
  return filesData
}

export default formatFileData
