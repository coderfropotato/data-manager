/*
 * 搜索模块
 */
import fetchData from '@/api'
import * as types from '@/store/mutation-types'
const state = {
    searchTableData:[],
    searchRange:[],
}

const getters = {
    searchTableData:state=>state.searchTableData
}

const actions = {
  setSearchTableData({commit},data){
      commit(types.SET_SEARCH_TABLE_DATA);
  },
  getSearchTableData({commit},params){
      fetchData('search',params).then(res=>{
          if(res.length===0) res=[];
          commit(types.SET_SEARCH_TABLE_DATA,res);
      })
  }
}

const mutations = {
    [types.SET_SEARCH_TABLE_DATA](state,data){
        state.searchTableData = data;
    }
}

export default {
  state,
  getters,
  actions,
  mutations
}
