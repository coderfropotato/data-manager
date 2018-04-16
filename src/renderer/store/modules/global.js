/*
 * 设置全局导航参数 区分路由参数
 */
import * as types from '@/store/mutation-types'
const state = {
    // file search status database
    globalRouteStatus: 'file',/* root */
    //global nav index
    globalNavIndex: 1,/* 0 */
    // view history
    history: false,
    // 是否登录
    isLogin: false
}
const getters = {
    globalRouteStatus: state => state.globalRouteStatus,
    globalNavIndex: state => state.globalNavIndex,
    history: state => state.history,
    isLogin: state => state.isLogin
}

const actions = {
    setRouteStatus({ commit }, type) {
        commit(types.SET_ROUTE_STATUS, type)
    },
    setGlobalNavIndex({ commit }, index) {
        return new Promise((resolve, reject) => {
            commit(types.SET_GLOBAL_NAV_INDEX, index);
            resolve('success');
        })
    },
    setGlobalHistory({ commit }, boolean) {
        commit(types.SET_GLOBAL_HISTORY, boolean);
    },
    setGlobalIsLogin({ commit }, isLogin) {
        commit(types.SET_GLOBAL_IS_LOGIN, isLogin);
    }
}

const mutations = {
    [types.SET_ROUTE_STATUS](state, type) {
        state.globalRouteStatus = type;
    },
    [types.SET_GLOBAL_NAV_INDEX](state, index) {
        state.globalNavIndex = index;
    },
    [types.SET_GLOBAL_HISTORY](state, boolean) {
        state.history = boolean;
    },
    [types.SET_GLOBAL_IS_LOGIN](state, isLogin) {
        state.isLogin = isLogin;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
