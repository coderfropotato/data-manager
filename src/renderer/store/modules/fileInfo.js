/*
 * 管理单个文件的基本信息，用于右侧文件详情显示
 */

import fetchData from '@/api'
import * as types from '@/store/mutation-types'

const state = {
  show: false,

  // 是否是文件夹
  isDir: false,

  // 磁盘序列号
  serialNumber: '',

  // 基本信息
  basicInfo: {},

  // 来源信息
  sourceInfo: {},

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

const getters = {
  show: state => state.show,
  isDir: state => state.isDir,
  serialNumber: state => state.serialNumber,
  basicInfo: state => state.basicInfo,
  sourceInfo: state => state.sourceInfo,
  customize: state => state.customize,
  fileAttr: state => state.fileAttr,
  fileType: state => state.fileAttr.filetype,
  organization: state => state.organization
}

const actions = {
  // 获取文件详情
  getFileInfo ({commit}, payload) {
    let path = payload.path
    let serialNumber = payload.serialNumber
    fetchData('getFileInfo', {path, serialNumber}).then(data => {
      commit(types.RECEIVE_FILE_DETAIL, data.info)
    })
  },

  // 获取文件的所属分类
  getFileSort ({commit}, path, volumeId) {
    fetchData('getFileSort', {}).then(data => {
      commit(types.SET_FILE_SORTS, data)
    })
  }
}

const mutations = {
  // 获取文件信息
  [types.RECEIVE_FILE_DETAIL] (state, detail) {
    state.basicInfo = detail.basic
    state.sourceInfo = detail.source
    state.customize = detail.customize
    state.fileAttr = detail.fileattr
    state.serialNumber = detail.serial_number
    state.isDir = detail.isdir
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
  getters,
  actions,
  mutations
}
