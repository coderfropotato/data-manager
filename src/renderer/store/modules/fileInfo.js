/*
 * 管理单个文件的基本信息，用于右侧文件详情显示
 */

import fetchData from '@/api'
import * as types from '@/store/mutation-types'

const state = {
  show:false,
  //是否移除right view
  removeRightView: false,
}

const getters = {
  show:state=>state.show,
  removeRightView: state => state.removeRightView
}

const actions = {

  //隐藏右侧文件详情
  hideFileInfo({ commit }) {
    commit(types.HIDE_FILE_INFO)
  },
  //显示右侧文件详情
  showFileInfo({ commit }) {
    commit(types.SHOW_FILE_INFO)
  },
  //移除右侧view
  removeRightView({ commit }, status) {
    commit(types.REMOVE_RIGHT_VIEW, status)
  }
}

const mutations = {
  // 显示文件信息区
  [types.SHOW_FILE_INFO](state) {
    state.show = true
  },
  //隐藏文件信息区
  [types.HIDE_FILE_INFO](state) {
    state.show = false
  },
  [types.REMOVE_RIGHT_VIEW](state, status) {
    state.removeRightView = status;
  }

}

export default {
  state,
  getters,
  actions,
  mutations
}
