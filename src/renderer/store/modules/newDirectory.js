/*
 * 管理单个文件的基本信息，用于右侧文件详情显示
 */

// import sendMessage from '@/api'
import * as types from '@/store/mutation-types'
import * as object from '@/api/data'
const state = {
  newDiskDirInfo: [],
  newSortDirInfo: [],
  smartSortList: [],
  smartSort: [[]],
  searchConditions: []
}

const actions = {

  // 将新添加的智能视图添加到智能视图列表中去
  // temp 包含着名称，限制条件，选择条件 (选择条件是一个数组）
  setNewSmartSort ({commit}, temp) {
    // 这里应该返回一个true或者false
    // sendMessage('setNewSmartSort', {}).then(data => {
    //   commit(types.SET_NEW_SMART_SORT_INFO, data, temp)
    // })
    commit(types.ADD_SMART_SORT, temp)
  },

  // 获取智能视图列表显示在文件树上面
  showSmartSortList ({commit}) {
    // 这里返回的data应该是所有智能视图的名字的数组
    // sendMessage('showSmartSortList', {}).then(data => {
    //   commit(types.SHOW_SMART_SORT_LIST, data)
    // })
  },

  // 点击智能视图名称，将名称发送给后台，后台根据智能视图的名称发送具体的数据
  showSmartSort ({commit}, smartSortName) {
    // sendMessage('showSmartSort', {smartSortName}).then(data => {
    //   commit(types.SHOW_SMART_SORT, data)
    // })
    commit(types.SHOW_SMART_SORT)
  },

  getSearchConditions ({commit}) {
    // sendMessage('getSearchConditions', {}).then(data => {
    //   commit(types.GET_SEARCH_CONDITIONS, data)
    // })
    commit(types.GET_SEARCH_CONDITIONS)
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
  [types.ADD_SMART_SORT] (state, newSmartSort) {
    state.smartSortList.push(newSmartSort.name)
  },

  // 在sidebar展示所有的智能视图
  [types.SHOW_SMART_SORT_LIST] (state, smartSortList) {
    state.smartSortList = smartSortList
  },

  [types.SHOW_SMART_SORT] (state) {
    state.smartSort = object.smartSort
    console.log(object.smartSort)
    console.log(state.smartSort)
  },

  [types.GET_SEARCH_CONDITIONS] (state) {
    state.searchConditions = object.searchConditions
    console.log(state.searchConditions)
  }
}

export default {
  state,
  actions,
  mutations
}
