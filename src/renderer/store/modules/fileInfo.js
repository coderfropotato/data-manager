/*
 * 管理单个文件的基本信息，用于右侧文件详情显示
 */

import sendMessage from '@/api'
import * as types from '@/store/mutation-types'

const state = {
  show: false,
  // 基本信息
  basicInfo: {},

  // 自定义信息
  customize: {},

  // 文件属性
  fileAttr: {},

  // 组织分类
  organization: {
    // 归属的分类
    fileSorts: []
  }
}

const actions = {
  // 获取文件详情
  getFileInfo ({commit}, payload) {
    let path = payload.path
    let serialNumber = payload.serialNumber
    sendMessage('getFileInfo', {path, serialNumber}).then(data => {
      commit(types.RECEIVE_FILE_DETAIL, data.info)
    })
  },

  // 获取文件的所属分类
  getFileSort ({commit}, path, volumeId) {
    sendMessage('getFileSort', {}).then(data => {
      commit(types.SET_FILE_SORTS, data)
    })
  }
}

const mutations = {
  // 获取文件信息
  [types.RECEIVE_FILE_DETAIL] (state, detail) {
    state.basicInfo = detail.basic
    state.customize = detail.customize
    state.fileAttr = detail.fileattr
  },

  // 显示文件信息区
  [types.SHOW_FILE_INFO] (state) {
    state.show = true
  },

  // 设置文件的所属分类
  [types.SET_FILE_SORTS] (state, sorts) {
    state.sorts = sorts
  }
}

export default {
  state,
  actions,
  mutations
}
