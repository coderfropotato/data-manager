/*
 * 设置全局导航参数 区分路由参数
 */
import * as types from '@/store/mutation-types'
const state = {
    // file search status database
    globalRouteStatus:'file',
    //save file info search or file 
    globalType:"file"
}

const getters = {
    globalRouteStatus:state=>state.globalRouteStatus,
    globalType:state=>state.globalType
}

const actions = {
  setRouteStatus({commit},type){
      commit(types.SET_ROUTE_STATUS,type)
  },
  setGlobalType({commit},type){
      commit(types.SET_GLOBAL_TYPE,type);
  }
}

const mutations = {
    [types.SET_ROUTE_STATUS](state,type){
        state.globalRouteStatus = type;
    },
    [types.SET_GLOBAL_TYPE](state,type){
        state.globalType = type;
    }
}

export default {
  state,
  getters,
  actions,
  mutations
}
