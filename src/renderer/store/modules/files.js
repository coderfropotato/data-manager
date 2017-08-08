/*
 * 管理后台传送的文件分类
 * 即侧边栏的所有文件夹中的文件
 */
import sendMessage from '@/api'
import * as types from '@/store/mutation-types'
// 引入文件树数据处理函数
import travelTree from '@/assets/JS/handleSortTreeData'

const state = {
  // 记录当前选择的文件
  currentFile: '',
  // 记录当前的文件列表
  currentFileList: [],
  // 记录当前的文件树
  currentFileTree: '',
  // 记录当前选中文件夹的路径
  currentPath: '',
  // 所有文件，可读，不可变更
  allFiles: [],
  // 分类，用户可以自己建立多层文件夹来分类数据
  // 原始数据
  sortDirRowData: [],
  // 处理后的数据
  sortFileTree: [],
  // 缓存请求的文件（所有文件选项）
  cacheDir: [],
  // 回收站
  trash: [],
  // 忽略文件
  ignore: [],
  // 导入的文件，防止文件重复
  importFilesMap: new Map()
}

const actions = {
  // 打开文件选项
  openFile ({commit}) {
    sendMessage('openFile', {}).then(data => {
      console.log(data)
      commit(types.OPEN_FILE, data)
    })
  },

  // 获取磁盘（包含我的电脑）文件树
  getDiskFileTree ({commit}, diskName) {
    sendMessage('getFileTree', {diskName}).then(data => {
      commit(types.GET_DISK_FILE_TREE, diskName, data)
    })
  },

  // 获取文件列表
  getSortFileList ({commit}, path) {
    sendMessage('getSortFileList', {path}).then(data => {
      let fileList = data.fileList
      commit(types.SET_FILE_LIST, fileList)
    })
  },

  // 获取回收站
  getTrash ({commit}) {
    sendMessage('getTrash', {}).then(data => {
      commit(types.GET_TRASH, data)
      console.log(data)
    })
  },

  // 获取忽略文件
  getIgnore ({commit}) {
    sendMessage('getIgnore', {}).then(data => {
      commit(types.GET_IGNORE, data)
    })
  },

  // 确认导入文件，向后台发送导入文件的路径
  confirmImportFiles ({commit}) {
    return new Promise((resolve, reject) => {
      if (state.importFilesMap.size === 0) {
        resolve({status: 1, fileAmount: 0})
      }
      let pathArray = []
      let fileAmount = 0
      for (let directory of state.importFilesMap.values()) {
        pathArray.push(directory.path)
        fileAmount++
      }
      // TODO 传送数据
      resolve({status: 1, fileAmount})
    })
  },

  // 设置当前的文件树
  setCurrentFileTree ({commit}, fileTree) {
    commit(types.SET_CURRENT_FILE_TREE, fileTree)
  }
}

const mutations = {
  // 打开文件选项
  [types.OPEN_FILE] (state, response) {
    state.allFiles = response.allFiles
    state.sortDirRowData = response.sortDir.sort
    // 对原始的文件树数据进行处理
    state.sortFileTree = []
    travelTree(state.sortDirRowData, state.sortFileTree, '')
  },

  // 获取文件树
  [types.GET_DISK_FILE_TREE] (state, folderName, response) {
    let temp = {
      folderName: folderName,
      tree: response
    }
    state.cacheDir.push(temp)
  },
  // 设置分类文件列表信息
  [types.SET_SORT_FILE_LIST] (state, response) {
  },

  // 设置文件列表信息
  [types.SET_FILE_LIST] (state, response) {
    state.currentFileList = response
  },

  // 获取回收站
  [types.GET_TRASH] (state, response) {
    state.trash = response
  },

  // 添加导入文件夹
  [types.ADD_IMPORT_FILES] (state, fileList) {
    // 不能使用 in 遍历，fileList 包含可枚举的属性length
    if (!fileList) {
      console.error('导入文件夹列表信息错误')
    }
    for (let i = 0; i < fileList.length; i++) {
      state.importFilesMap.set(fileList[i].path, fileList[i])
    }
  },

  // 获取忽略文件
  [types.GET_IGNORE] (state, response) {
    state.ignore = response
  },

  // 设置当前的文件树
  [types.SET_CURRENT_FILE_TREE] (state, fileTree) {
    state.currentFileTree = fileTree
  },

  // 设置当前的路径
  [types.SET_CURRENT_PATH] (state, currentPath) {
    state.currentPath = currentPath
  }
}

export default {
  state,
  actions,
  mutations
}
