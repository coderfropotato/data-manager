import * as types from '@/store/mutation-types'


const state={
    bottomShow:false,
    bottomInfo:{
        totalCount:0,
        selectedCount:0,
        selectedSize:0
    }
}
const getters  ={
    totalCount:state=>state.bottomInfo.totalCount,
    selectedCount:state=>state.bottomInfo.selectedCount,
    selectedSize:state=>state.bottomInfo.selectedSize
}
const actions ={
    hideBottom({commit}){
        commit(types.BOTTOM_HIDE)
    },
    showBottom({commit}){
        commit(types.BOTTOM_SHOW)
    },
    //设置项目总数
    setTotalCount({commit},num){
        commit(types.SET_TOTAL_COUTN,num)
    },
    //设置选中项和大小
    setSelected({commit},params){
        // params=> count size
        commit(types.SET_SELECTED,params);
    }
}

const mutations = {
    [types.BOTTOM_SHOW](state){
        state.bottomShow = true;
    },
    [types.BOTTOM_HIDE](state){
        state.bottomShow = false;
    },
    [types.SET_TOTAL_COUTN](state,num){
        state.bottomInfo.totalCount = num;
    },
    [types.SET_SELECTED](state,{count,size}){
        state.bottomInfo.selectedCount = count;
        state.bottomInfo.selectedSize = size;
    }
}

export default {
    getters,
    state,
    actions,
    mutations
}