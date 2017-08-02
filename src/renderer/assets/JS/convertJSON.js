/*
 * 转换原始的修改文件JSON为Element-UI可读取的格式
 */

function packup (files, res, path) {
  for (let item in files) {
    // 忽略__info__
    if (item === '__info__') {
      continue
    }
    // 文件
    if (files[item].hasOwnProperty('__info__') && Object.keys(files[item]).length === 1) {
      res.push({label: item, path: path + '/' + item, status: files[item]['__info__']['status']})
    } else { // 文件夹
      res.push({label: item, path: path + '/' + item, children: []})
      if (files[item].hasOwnProperty('__info__')) {
        res[res.length - 1].status = files[item]['__info__']['status']
      }

      packup(files[item], res[res.length - 1].children, path + '/' + item)
    }
  }
}

export default packup
