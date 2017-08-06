/*
 * 文件状态功能
 */
import sendMessage from '@/api'
import * as types from '@/store/mutation-types'
import packUpModified from '@/assets/JS/convertJSON'

const state = {}

const actions = {
  getSearchResult ({commit}, value) {
    return new Promise((resolve, reject) => {
      sendMessage('getModifiedFiles', value).then((data) => {
        console.log(data)
      })
    })
  }
}

const mutations = {
  // 获取所有的修改文件并转换成合适的格式
  [types.RECEIVE_MODIFIED_FILES] (state, files) {
    state.modifiedFilesTree = files
    let result = packUpModified(files)
    state.modifiedFiles = result.res
    state.modifiedNum = result.count
  }
}

export default {
  state,
  actions,
  mutations
}
