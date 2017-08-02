/*
 * 控制列表视图区
 */
import * as types from '@/store/mutation-types'
const state = {
  Content: false,
  FileInfo: false,
  listDisplayStatus: 'Columns'
}

const mutations = {
  [types.SET_LIST_DISPLAY_STATUS] (state, status) {
    state.listDisplayStatus = status
  }
}

export default {
  state,
  mutations
}
