/*
 * 文件状态功能
 */
import sendMessage from '@/api'
import * as types from '@/store/mutation-types'

const state = {
  searchPositions: []
}

const actions = {
  getSearchResult ({commit}, value) {
    return new Promise((resolve, reject) => {
      sendMessage('searchContext', value).then((data) => {
        console.log(data)
      })
    })
  }
}

const mutations = {
  // 获取所有的修改文件并转换成合适的格式
  [types.SET_SEARCH_POSITION] (state, positions) {
    state.searchPositions = positions
  }
}

export default {
  state,
  actions,
  mutations
}
