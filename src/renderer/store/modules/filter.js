/*
 * 管理后台传送的文件分类
 * 即侧边栏的所有文件夹中的文件
 */
import getRomoteData from '@/api/getRemoteData';
import * as types from '@/store/mutation-types';
import bus from '@/utils/bus';
import global from '@/store/modules/global';

const state = {
    filter:false
}

const getters = {
    filter:state=>state.filter,
}

const actions = {
    //获取文件列表
    getImportTargetDisks({
    commit
  }) {
        return new Promise((resolve, reject) => {
            getRomoteData('getImportTargetDisks', {}).then((data) => {
                commit(types.SET_FILE_LIST, data.disks);
                resolve('success');
            })
        })
    }
}

const mutations = {
    [types.SET_DEVICE_ALIAS](state, alias) {
        state.deviceAlias = alias;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}