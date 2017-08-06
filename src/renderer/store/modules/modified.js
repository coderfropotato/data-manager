/*
 * 文件状态功能
 */
import sendMessage from '@/api'
import * as types from '@/store/mutation-types'
import packup from '@/assets/JS/convertJSON'

const state = {
  modifiedFiles: [],  // 最近变更的文件
  modifiedFilesTree: {},  // 最近变更文件树
  activeModifiedFilesSet: new Set(), // 当前选中的变更文件集合
  modifiedNum: 0 // 变更文件的数目
}

const actions = {
  // 获取变更文件
  getModifiedFiles ({commit}) {
    // 获取更改文件后返回
    return new Promise((resolve, reject) => {
      sendMessage('getModifiedFiles', {}).then((data) => {
        if (data.isModified) {
          resolve(true)
          commit(types.RECEIVE_MODIFIED_FILES, data.tree)
        } else {
          // 获取更改信息完成，通知执行 then
          resolve(false)
        }
      })
    })
  }
}

const mutations = {
  // 获取所有的修改文件并转换成合适的格式
  [types.RECEIVE_MODIFIED_FILES] (state, files) {
    state.modifiedFilesTree = files
    state.modifiedFiles = []
    packup(files, state.modifiedFiles, '')
  }
}

export default {
  state,
  actions,
  mutations
}
