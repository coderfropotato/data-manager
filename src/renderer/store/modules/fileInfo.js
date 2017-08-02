/*
 * 管理单个文件的基本信息，用于右侧文件详情显示
 */

import API from '@/api'
import * as types from '@/store/mutation-types'

const state = {
  show: false,
  // 基本信息
  basicInfo: {
    name: '',
    size: '',
    type: '',
    createTime: ''
  },

  // 其他信息
  otherInfo: {}
}

const actions = {
  // 获取文件详情
  getFileInfo ({commit}, path, volumeId) {
    let detail = API.getFileInfo({path, volumeId})
    commit(types.RECEIVE_FILE_DETAIL, detail)
  }
}

const mutations = {
  // 获取文件信息
  [types.RECEIVE_FILE_DETAIL] (state, detail) {
    state.basicInfo = detail.basicInfo
    state.otherInfo = detail.otherInfo
  },

  // 显示文件信息区
  [types.SHOW_FILE_INFO] (state) {
    state.show = true
  }
}

export default {
  state,
  actions,
  mutations
}
