/*
 * 文件状态功能
 */
import API from '@/api'
import * as types from '@/store/mutation-types'

const state = {
  modifiedFiles: [],  // 最近变更的文件(树)
  modifiedNum: 0 // 变更文件的数目
}

const actions = {
  // 获取变更文件
  getModifiedFiles ({ commit }) {
    let files = API.getModifiedFiles()
    commit(types.RECEIVE_MODIFIED_FILES, files)
  }
}

const mutations = {
  // 获取所有最近文件
  [types.RECEIVE_MODIFIED_FILES] (state, files) {
    state.modifiedFiles = files
    state.modifiedNum = files.length
  }
}

export default {
  state,
  actions,
  mutations
}
