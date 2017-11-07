/*
 * 设置全局导航参数 区分路由参数
 */
import * as types from '@/store/mutation-types'
const state = {
    // file search status database
    globalRouteStatus:'file'
}

const getters = {
    globalRouteStatus:state=>state.globalRouteStatus
}

const actions = {
  setRouteStatus({commit},type){
      commit(types.SET_ROUTE_STATUS,type)
  }
}

const mutations = {
    [types.SET_ROUTE_STATUS](state,type){
        state.globalRouteStatus = type;
    }
}

export default {
  state,
  getters,
  actions,
  mutations
}
