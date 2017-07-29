/*
 * 管理后台传送的文件分类
 * 即侧边栏的所有文件夹中的文件
 */
const state = {
  // 记录当前选择
  currentChoose: '',
  currentFileTree: '',
  // 记录当前选中的文件夹
  currentFolder: {},
  // 所有文件，可读，不可变更
  allFiles: {},
  // 分类，用户可以自己建立多层文件夹来分类数据
  sortFolder: {},
  // 其他，如回收站
  otherFile: {}
}

const mutations = {
}

export default {
  state,
  mutations
}
