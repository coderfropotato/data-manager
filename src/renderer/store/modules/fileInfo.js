/*
 * 管理单个文件的基本信息，用于右侧文件详情显示
 */

import API from '@/api'
import * as types from '@/store/mutation-types'

const state = {
  // 基本信息
  basicInfo: {
    name: '',
    size: 0,
    type: '',
    createTime: ''
  },

  // 其他信息
  otherInfos: {}
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
    state.otherInfos = detail.otherInfos
  }
}

export default {
  state,
  actions,
  mutations
}
