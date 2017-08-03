/*
 * 文件状态功能
 */
import API from '@/api'
import * as types from '@/store/mutation-types'
import packup from '@/assets/JS/convertJSON'

const state = {
  modifiedFiles: [],  // 最近变更的文件
  modifiedFilesTree: {},  // 最近变更文件树
  activeModifiedFilesSet: new Set(), // 当前选中的变更文件集合
  modifiedNum: 0 // 变更文件的数目
}

const actions = {
  // 获取变更文件
  getModifiedFiles ({ commit }) {
    // 未来统一采用getFileTreeAPI
    // let files = API.getFileTree('modified')
    // 如今测试用getModifiedFiles
    let files = API.getModifiedFiles('modified')
    commit(types.RECEIVE_MODIFIED_FILES, files)
  }
}

const mutations = {
  // 获取所有的修改文件并转换成合适的格式
  [types.RECEIVE_MODIFIED_FILES] (state, files) {
    state.modifiedFilesTree = files
    state.modifiedFiles = []
    packup(files, state.modifiedFiles, '')
  }
}

export default {
  state,
  actions,
  mutations
}
