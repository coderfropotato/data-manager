/*
 * 管理后台传送的文件分类
 * 即侧边栏的所有文件夹中的文件
 */
import API from '@/api'
import * as types from '@/store/mutation-types'

const state = {
  // 记录当前选择
  currentChoose: '',
  currentFileTree: '',
  // 记录当前选中的文件夹
  currentFolder: '',
  // 所有文件，可读，不可变更
  allFiles: [],
  // 分类，用户可以自己建立多层文件夹来分类数据
  sortDir: [],
  // 缓存请求的分类
  cacheDir: [],
  // 回收站
  trash: [],
  // 忽略文件
  ignore: []

}

const actions = {
  // 打开文件选项
  openFile ({ commit }) {
    console.log('openFile')
    let response = API.openFile()
    commit(types.OPEN_FILE, response)
  },

  // 获取文件树
  getFileTree ({ commit }, folderName) {
    let response = API.getFileTree(folderName)
    commit(types.GET_FILE_TREE, folderName, response)
  },

  // 获取回收站
  getTrash ({ commit }) {
    let response = API.getTrash()
    commit(types.GET_TRASH, response)
  },

  // 获取忽略文件
  getIgnore ({ commit }) {
    let response = API.getIgnore()
    commit(types.GET_IGNORE, response)
  },

  // 设置当前的文件树
  setCurrentFileTree ({ commit }, fileTree) {
    commit(types.SET_CURRENT_FILE_TREE, fileTree)
  }

}

const mutations = {
  // 打开文件选项
  [types.OPEN_FILE] (state, response) {
    state.allFiles = response.allFiles
    state.sortDir = response.sortDir
  },

  // 获取文件树
  [types.GET_FILE_TREE] (state, folderName, response) {
    let temp = {
      folderName: folderName,
      tree: response
    }
    state.cacheDir.push(temp)
  },

  // 获取回收站
  [types.GET_TRASH] (state, response) {
    state.trash = response
  },

  // 获取忽略文件
  [types.GET_IGNORE] (state, response) {
    state.ignore = response
  },

  // 设置当前的文件树
  [types.SET_CURRENT_FILE_TREE] (state, fileTree) {
    state.currentFileTree = fileTree
  }
}

export default {
  state,
  actions,
  mutations
}
