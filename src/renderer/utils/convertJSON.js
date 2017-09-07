/*
 * 转换原始的修改文件JSON为Element-UI可读取的格式
 */

function packup (files, res, path, countObj) {
  for (let item in files) {
    // 忽略__info__
    if (item === '__info__') {
      continue
    }
    // 文件
    if (files[item].hasOwnProperty('__info__') && Object.keys(files[item]).length === 1) {
      res.push({ label: item, path: path + '/' + item, status: files[item]['__info__']['status'], isDir: false })
      countObj.count++
    } else { // 文件夹
      res.push({ label: item, path: path + '/' + item, disabled: true, isDir: true, children: [] })
      // 如果该文件夹也有修改信息
      if (files[item].hasOwnProperty('__info__')) {
        res[res.length - 1].status = files[item]['__info__']['status']
        res[res.length - 1].disabled = false
        countObj.count++
      }
      packup(files[item], res[res.length - 1].children, path + '/' + item, countObj)
    }
  }
}

function packUpModified (modified) {
  let res = []
  let countObj = { count: 0 }
  // 获取各个磁盘
  for (let disk in modified) {
    let diskAlias = disk.split('*')[0]
    let serialNumber = disk.split('*')[1]
    // 添加根层信息
    // path要适配getFileInfo
    // disable该节点
    res.push({ label: diskAlias, serialNumber: serialNumber, path: serialNumber + '/' + serialNumber, disabled: true, children: [] })
    // 获取顶层文件信息
    for (let folder in modified[disk]) {
      // let folderAlias = folder.split('*')[0]
      // let rootPath = serialNumber + folder.split('*')[1]
      let rootPath = folder
      let folderAlias = modified[disk][folder]['__info__']['alias']
      // 添加顶层文件信息
      // disable该节点
      res[res.length - 1].children.push({ label: folderAlias, path: serialNumber + rootPath, disabled: true, isDir: true, children: [] })
      // 递归添加该文件树信息
      packup(modified[disk][folder], res[res.length - 1].children[res[res.length - 1].children.length - 1].children, serialNumber + rootPath, countObj)
    }
  }
  return { res: res, count: countObj.count }
}

export default packUpModified
