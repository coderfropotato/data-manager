/*
 * 管理单个文件的基本信息，用于右侧文件详情显示
 */

import fetchData from '@/api'
import * as types from '@/store/mutation-types'

const state = {
  targetPositions: []
}

const getters = {
  targetPositions: state => state.targetPositions
}

const actions = {
  // 获取导入目标磁盘
  getImportTargetDisks ({commit}) {
    return new Promise((resolve, reject) => {
      fetchData('getImportTargetDisks', {}).then(data => {
        commit('setImportTargetDisks', data.disks)
        resolve()
      })
    })
  },

  // 导入 Excel 模板文件
  importExcelTemplate ({commit}, payload) {
    return new Promise((resolve, reject) => {
      fetchData('importExcelTemplate', {
        path: payload.path,
        serialNumber: payload.serialNumber,
        filetype: payload.fileType
      }).then(data => {
        resolve(data)
      })
    })
  },
  // 生成 Excel 模板文件
  generateExcelTemplate ({commit}, payload) {
    return new Promise((resolve, reject) => {
      fetchData('generateExcelTemplate', {
        path: payload.path,
        filetype: payload.fileType
      }).then(response => {
        resolve(response)
      })
    })
  }
}

const mutations = {
  // 设置可以选择的磁盘
  [types.SET_IMPORT_TARGET_DISKS] (state, data) {
    state.targetPositions = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
