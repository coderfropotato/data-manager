/*
 * 控制列表视图区
 */
import * as types from '@/store/mutation-types'

const state = {
  Content: false,
  FileInfo: false,
  listDisplayStatus: 'Column',
  // 切换展示状态的选项
  displayOptions: [
    {
      value: 'Grid',
      label: 'Grid'
    }
  ],
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
  },
  [types.CHANGE_DISPLAY_OPTIONS] (state, options) {
    state.displayOptions = options
  }
}

export default {
  state,
  getters,
  mutations
}
