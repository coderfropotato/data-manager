/*
 * 小工具 状态管理
 */
import fetchData from '@/api';
import * as types from '@/store/mutation-types';
import bus from '@/utils/bus';

const state = {
    // heatmap excel pathway
    toolType: ""
}

const getters = {
    toolType: state => state.toolType
}

const actions = {
    setToolType({ commit }, type) {
        return new Promise((resolve, reject) => {
            commit(types.SET_TOOL_TYPE, type);
            resolve('success');
        })
    }
}

const mutations = {
    [types.SET_TOOL_TYPE](state,type) {
        state.toolType = type;
    }

}

export default {
    state,
    getters,
    actions,
    mutations
}
