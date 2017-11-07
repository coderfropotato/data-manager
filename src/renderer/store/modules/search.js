/*
 * 搜索模块
 */
import fetchData from '@/api'
import * as types from '@/store/mutation-types'
//引入bottom  设置bototm vuex
import bottom from '@/store/modules/bottom'
const state = {
    searchTableData:[],
    searchRange:[],
}

const getters = {
    searchTableData:state=>state.searchTableData
}

const actions = {
  getSearchTableData({commit},params){
      return new Promise((ersolve,reject)=>{
          fetchData('',{}).then(res=>{
              commit(types.GET_SEARCH_TABLE_DATA,res);
          })
      })
  }
}

const mutations = {
    [types.GET_SEARCH_TABLE_DATA](state,data){
        state.searchTableData = data;
    }
}

export default {
  state,
  getters,
  actions,
  mutations
}
