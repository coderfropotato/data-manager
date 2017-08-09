/*
 * 管理单个文件的基本信息，用于右侧文件详情显示
 */

import sendMessage from '@/api'
// import * as types from '@/store/mutation-types'
const state = {
  newDiskDirInfo: [],
  newSortDirInfo: [],
  smartSortList: [],
  smartSort: [[]],
  searchConditions: []
}

const actions = {
  // 导入 Excel 模板文件
  importExcelTemplate ({commit}, path) {
    return new Promise((resolve, reject) => {
      sendMessage('importExcelTemplate', {path}).then()
    })
  },
  // 生成 Excel 模板文件
  generateExcelTemplate ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendMessage('generateExcelTemplate', {
        path: payload.path,
        filetype: payload.fileType
      }).then(response => {
        resolve(response)
      })
    })
  }
}

const mutations = {}

export default {
  state,
  actions,
  mutations
}
