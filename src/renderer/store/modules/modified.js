/*
 * 管理后台传送的文件分类
 * 即侧边栏的所有文件夹中的文件
 */
import fetchData from '@/api'
import * as types from '@/store/mutation-types'

const state = {
    //文件状态
    modifiedNum: 12,
}

const getters = {
    modifiedNum: state => state.modifiedNum,
}

const actions = {
    
}

const mutations = {
}

export default {
    state,
    getters,
    actions,
    mutations
}
