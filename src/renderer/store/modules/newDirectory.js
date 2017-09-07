/*
 * 管理单个文件的基本信息，用于右侧文件详情显示
 */

import fetchData from '@/api'
import * as types from '@/store/mutation-types'
import {Message} from 'element-ui'
// import * as object from '@/api/data'
const state = {
  newDiskDirInfo: [],
  newCategoryDirInfo: [],
  smartSort: [[]],
  sortOrder: [],
  tableName: ''
}

const getters = {
  newDiskDirInfo: state => state.newDiskDirInfo,
  newCategoryDirInfo: state => state.newCategoryDirInfo,
  smartSort: state => state.smartSort,
  sortOrder: state => state.sortOrder,
  tableName: state => state.tableName
}

const actions = {
  // 判断磁盘目录能否被管理
  judgeNewDiskDir ({commit}, payload) {
    return new Promise((resolve, reject) => {
      fetchData('judgeNewDiskDir', {
        path: payload.path,
        ip: payload.host
      }).then(data => {
        resolve(data.status)
      })
    })
  },

  addNewDiskDir ({commit}, dirInfo) {
    return new Promise((resolve, reject) => {
      let data = {
        path: dirInfo.path,
        alias: dirInfo.alias,
        attr: {
          // 数组
          projectInfo: dirInfo.projectInfo,
          // 数组
          customAttr: dirInfo.customAttr
        }
      }
      // 如果是远程服务器
      if (dirInfo.dataSource === 'remoteServer') {
        Object.assign(data, {
          source: dirInfo.remoteServer
        })
      } else {
        Object.assign(data, {
          source: {}
        })
      }
      fetchData('addDiskDir', data).then(data => {
        resolve(data.status)
      })
    })
  },

  sendNewSortInfo ({commit}, path) {
    fetchData('', {path}).then(status => {
    })
  },

  // 将新添加的智能视图添加到智能视图列表中去
  // temp 包含着名称，限制条件(是一个对象数组)，选择条件 (选择条件是一个数组）
  addNewSmartSort ({commit}, temp) {
    return new Promise((resolve, reject) => {
      let tableName = temp.name
      let context = temp.context
      let limitedCondition = temp.limitedCondition
      let selectedCondition = temp.selectedCondition
      // 这里应该返回一个true或者false
      fetchData('setNewSmartSort', {tableName, context, limitedCondition, selectedCondition}).then(data => {
        resolve(1)
        commit(types.ADD_SMART_SORT, data)
      })
    })
  },

  // 获取智能视图列表显示在文件树上面
  // showSmartSortList ({commit}) {
  //   // 这里返回的data应该是所有智能视图的名字的数组
  //   return new Promise((resolve, reject) => {
  //     fetchData('showSmartSortList', {}).then(data => {
  //       resolve()
  //       commit(types.SHOW_SMART_SORT_LIST, data)
  //     })
  //   })
  // },

  // 点击智能视图名称，将名称发送给后台，后台根据智能视图的名称发送具体的数据
  showSmartSort ({commit}, payload) {
    let tableName = payload.tableName
    let select = payload.select
    fetchData('showSmartSort', {tableName, select}).then(data => {
      commit(types.SHOW_SMART_SORT, data)
    })
    // commit(types.SHOW_SMART_SORT)
  }
}

const mutations = {
  // 新增磁盘文件夹信息
  [types.SET_NEW_DISK_DIR_INFO] (state, newDirInfo) {
    state.newDiskDirInfo.push(newDirInfo)
  },

  // 新增分类文件信息
  [types.SET_NEW_SORT_DIR_INFO] (state, newDirInfo) {
    state.newCategoryDirInfo.push(newDirInfo)
  },

  // 新增智能视图
  [types.ADD_SMART_SORT] (state, response) {
    if (response.status) {
      Message.success({
        message: '创建成功',
        showClose: true
      })
    } else {
      Message.warning({
        message: '创建失败',
        showClose: true
      })
    }
  },

  // 在sidebar展示所有的智能视图
  // [types.SHOW_SMART_SORT_LIST] (state, smartSortList) {
  //   state.smartSortList = smartSortList.allSmartView
  // },

  [types.SHOW_SMART_SORT] (state, response) {
    // state.smartSort = object.smartSort
    let smartView = response.smartView
    state.smartSort.push(smartView.data)
    state.sortOrder = smartView.tabs
    state.tableName = smartView.table
    // console.log(object.smartSort)
    // console.log(state.smartSort)
  },
  // smartSort置空
  [types.SET_SMART_SORT] (state) {
    state.smartSort = [[]]
  },

  [types.DELETE_LIST] (state, payload) {
    let from = payload.from
    let deleteLength = payload.deleteLength
    state.smartSort.splice(from, deleteLength)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
