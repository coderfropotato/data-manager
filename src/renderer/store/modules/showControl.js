/*
 * 控制列表视图区
 */
import * as types from '@/store/mutation-types'
const state = {
  Content: false,
  FileInfo: false,
  listDisplayStatus: 'Columns',
  dragShow: false
}

const mutations = {
  [types.SET_LIST_DISPLAY_STATUS] (state, status) {
    state.listDisplayStatus = status
  },
  [types.TOGGLE_DRAG_SHOW] (state, status) {
    state.dragShow = status
  }
}

export default {
  state,
  mutations
}
