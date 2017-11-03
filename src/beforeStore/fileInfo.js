/*
 * 管理单个文件的基本信息，用于右侧文件详情显示
 */

import fetchData from '@/api'
import * as types from '@/store/mutation-types'

const state = {
  show:false,
  categorys:[],
  //是否移除right view
  removeRightView: false,
  //info data
  count: 1,
  filename: "",
  size: "",
  createTime: "",
  attrs: [],
  bz: "",
}

const getters = {
  show:state=>state.show,
  categorys:state=>state.categorys,
  count:state=>state.count,
  filename:state=>state.filename,
  size:state=>state.size,
  createTime:state=>state.createTime,
  attrs:state=>state.attrs,
  bz:state=>state.bz,
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

  // 设置文件的所属分类
  [types.SET_FILE_SORTS](state, categorys) {
    state.categorys = categorys
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
