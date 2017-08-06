/*
 * 管理单个文件的基本信息，用于右侧文件详情显示
 */

// import sendMessage from '@/api'
import * as types from '@/store/mutation-types'

const state = {
  newDiskDirInfo: [],
  newSortDirInfo: [],
  newSmartSortInfo: []
}

const actions = {
  // 获取文件详情
}

const mutations = {
  // 新增磁盘文件夹信息
  [types.SET_NEW_DISK_DIR_INFO] (state, newDirInfo) {
    state.newDiskDirInfo.push(newDirInfo)
  },

  // 新增分类文件信息
  [types.SET_NEW_SORT_DIR_INFO] (state, newDirInfo) {
    state.newSortDirInfo.push(newDirInfo)
  },

  // 新增智能视图
  [types.SET_NEW_SMART_SORT_INFO] (state, newDirInfo) {
    state.newSmartSortInfo.push(newDirInfo)
  }
}

export default {
  state,
  actions,
  mutations
}
