/*
 * 管理单个文件的基本信息，用于右侧文件详情显示
 */

// import sendMessage from '@/api'
import * as types from '@/store/mutation-types'
import * as object from '@/api/data'

const state = {
  newDiskDirInfo: [],
  newSortDirInfo: [],
  smartSortList: []
}

const actions = {
  // 获取文件详情
  // setNewSmartSort ({commit}, payload) {
  //   sendMessage('setNewSmartSort', {payload}).then(data => {
  //     // SmartSortList是要展示的智能视图名称列表
  //     let SmartSortList = data
  //     commit(types.SET_NEW_SMART_SORT_INFO, SmartSortList)
  //   })
  // }
  setNewSmartSort ({commit}, data) {
    commit(types.SET_NEW_SMART_SORT_INFO, data)
  }
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
  [types.SET_NEW_SMART_SORT_INFO] (state, data) {
    state.smartSortList = object.smartSortList
    state.smartSortList.push(data.name)
  }
}

export default {
  state,
  actions,
  mutations
}
