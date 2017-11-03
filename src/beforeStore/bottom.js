import * as types from '@/store/mutation-types'


const state={
    bottomShow:false
}

const actions ={
    hideBottom({commit}){
        commit(types.BOTTOM_HIDE)
    },
    showBottom({commit}){
        commit(types.BOTTOM_SHOW)
    }
}

const mutations = {
    [types.BOTTOM_SHOW](state){
        state.bottomShow = true;
    },
    [types.BOTTOM_HIDE](state){
        state.bottomShow = false;
    }
}

export default {
    state,
    actions,
    mutations
}