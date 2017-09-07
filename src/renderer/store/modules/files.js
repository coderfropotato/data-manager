/*
 * 管理后台传送的文件分类
 * 即侧边栏的所有文件夹中的文件
 */
import fetchData from '@/api'
import * as types from '@/store/mutation-types'
// 引入文件树数据处理函数
import travelTree from '@/utils/handleSortTreeData'

const state = {
  // 记录当前选择的文件
  currentFile: '',
  // 记录当前的文件列表（列表展示）
  currentFileList: [],
  // 记录当前的文件树
  currentDiskDirTree: '',
  // 记录当前选中文件夹的路径
  currentPath: '',
  smartSortList: [],
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
  importFilesMap: new Map(),
  node: {}
}

const getters = {
  currentFile: state => state.currentFile,
  allFiles: state => state.allFiles,
  currentFileList: state => state.currentFileList,
  currentDiskDirTree: state => state.currentDiskDirTree,
  currentPath: state => state.currentPath,
  smartSortList: state => state.smartSortList,
  sortDirRowData: state => state.sortDirRowData,
  sortFileTree: state => state.sortFileTree,
  cacheDir: state => state.cacheDir,
  trash: state => state.trash,
  ignore: state => state.ignore
}

const actions = {
  // 打开文件选项
  openFile ({commit}) {
    return new Promise((resolve, reject) => {
      fetchData('openFile', {}).then(data => {
        resolve(1)
        commit(types.OPEN_FILE, data)
      })
    })
  },

  // 获取磁盘（包含我的电脑）文件树
  getDiskFileTree ({commit}, serialNumber) {
    fetchData('getFileTree', {serialNumber}).then(data => {
      commit({
        type: types.SET_DISK_FILE_TREE,
        serialNumber,
        data
      })
    })
  },

  // 获取文件列表
  getSortFileList ({commit}, payload) {
    return new Promise((resolve, reject) => {
      fetchData('getSortFileList', {
        path: payload.lastPath,
        page: payload.page,
        size: payload.size
      }).then(data => {
        let fileList = data.fileList
        if (fileList.length !== 0) {
          commit(types.SET_FILE_LIST, fileList)
        }
        resolve(data.isLastPage)
      })
    })
  },

  // 获取回收站
  getTrash ({commit}) {
    fetchData('getTrash', {}).then(data => {
      commit(types.SET_TRASH, data.trash)
    })
  },

  // 获取忽略文件
  getIgnore ({commit}) {
    fetchData('getIgnore', {}).then(data => {
      commit(types.SET_IGNORE, data.ignore)
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
  }
}

const mutations = {
  // 打开文件选项
  [types.OPEN_FILE] (state, response) {
    state.allFiles = response.allFiles
    state.sortDirRowData = response.sortDir.sort
    state.smartSortList = response.smartViews

    // 对原始的文件树数据进行处理
    state.sortFileTree = []
    travelTree(state.sortDirRowData, state.sortFileTree, '')
  },

  // 设置节点信息
  [types.SET_TREE_NODE] (state, node) {
    state.node = node
  },

  [types.TOGGLE_TREE_NODE_DISPLAY] (state, payload) {
    console.log(state.node.data)
    state.node.data.inputShow = payload.inputShow
    state.node.data.labelShow = payload.labelShow
  },

  // 添加分类目录
  [types.ADD_SORT_DIRECTORY] (state, newDir) {
    state.sortFileTree.push(newDir)
  },

  // 获取文件树
  [types.SET_DISK_FILE_TREE] (state, payload) {
    let temp = {
      serialNumber: payload.serialNumber,
      tree: payload.data.tree
    }
    state.cacheDir.push(temp)
    state.currentDiskDirTree = payload.data.tree
  },

  // 设置文件列表信息
  [types.SET_FILE_LIST] (state, response) {
    // 如果传进的response数组为 0，则设置文件列表为空，否则将新获取的文件加入原数组
    if (response.length === 0) {
      state.currentFileList = []
    } else {
      state.currentFileList = state.currentFileList.concat(response)
    }
  },

  // 获取回收站
  [types.SET_TRASH] (state, response) {
    state.trash = response
    state.currentFileList = response
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
  [types.SET_IGNORE] (state, response) {
    state.ignore = response
  },

  // 设置当前的文件树
  [types.SET_CURRENT_FILE_TREE] (state, fileTree) {
    state.currentDiskDirTree = fileTree
  },

  // 设置当前的路径
  [types.SET_CURRENT_PATH] (state, currentPath) {
    state.currentPath = currentPath
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
