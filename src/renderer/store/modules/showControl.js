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

const getters = {
  Content: state => state.Content,
  FileInfo: state => state.FileInfo,
  listDisplayStatus: state => state.listDisplayStatus,
  dragShow: state => state.dragShow
}

const mutations = {
  [types.SET_FILE_DISPLAY_STATUS] (state, status) {
    state.listDisplayStatus = status
  },
  [types.TOGGLE_DRAG_SHOW] (state, status) {
    state.dragShow = status
  }
}

export default {
  state,
  getters,
  mutations
}
