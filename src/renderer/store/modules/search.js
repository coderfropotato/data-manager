/*
 * 搜索模块
 */
import fetchData from '@/api'
import * as types from '@/store/mutation-types'
//引入bottom  设置bototm vuex
import bottom from '@/store/modules/bottom'
import files from '@/store/modules/files'
import bus from '@/utils/bus';
const state = {
    searchTableData: [],
    searchRange: [],
    searchValue: "",
    searchPos: "",
}

const getters = {
    searchPos: state => state.searchPos,
    searchTableData: state => state.searchTableData,
    searchValue: state => state.searchValue,
    searchRange: state => state.searchRange,
    searchRangeLength: state => {
        return state.searchRange.length;
    }
}
const actions = {
    getSearchTableData({
        commit
    }, params) {
        return new Promise((resolve, reject) => {
            fetchData('searchFile', {}).then(_ => {
                commit(types.GET_SEARCH_TABLE_DATA, _);
                resolve('success');
            })
        })
    },
    //setup default search value
    setSearchValue({
        commit
    }, val) {
        return new Promise((resolve, reject) => {
            commit(types.SET_SEARCH_VALUE, val);
            resolve('success')
        })
    },
    searchCurrentDisk({
        commit
    }, context) {
        bus.$emit('searchTableLoading', true);
        return new Promise((resolve, reject) => {
            let serialNumber = files.state.serialNumber;
            let rootPath = files.state.rootPath;
            let childPath = files.state.navList[files.state.navList.length - 1].path;
            fetchData('searchCurrentDisk', {
                context,
                serialNumber,
                rootPath,
                childPath
            }).then(res => {
                bus.$emit('searchTableLoading', false);
                let data = {},
                    list = [];
                let temp = res.fileList;
                for (let i = 0; i < temp.length; i++) {
                    let tmp = temp[i].basic;
                    tmp.isdir = temp[i].isdir;
                    tmp.rootPath = temp[i].path;
                    tmp.serialNumber = temp[i].serial_number;
                    list.push(tmp);
                }
                commit(types.GET_SEARCH_TABLE_DATA, list);
                resolve(list);
            }, err => {
                bus.$emit('searchTableLoading', false);
                reject('error')
            }).catch((err) => {
                bus.$emit('searchTableLoading', false);
                console.log(err);
            })
        })
    },
    //global search
    searchFile({
        commit
    }, params) {
        //{context,type}
        //params：context searchRange[{serialNumber,path}];
        let context = params.context;
        let isglobal = false;
        let searchRange = [];
        if (params.type === 'files') {
            //fileList
            for (let i = 0; i < files.state.fileList.length; i++) {
                let obj = {};
                obj.serialNumber = files.state.fileList[i].serial_number;
                obj.path = files.state.fileList[i].path;
                searchRange.push(obj);
            }
        } else {
            //searchRange
            for (let i = 0; i < state.searchRange.length; i++) {
                let obj = {};
                for (let j = 0; j < files.state.fileList.length; j++) {
                    if (state.searchRange[i] === files.state.fileList[j].alias) {
                        obj.serialNumber = files.state.fileList[j].serial_number;
                        obj.path = files.state.fileList[j].path;
                        break;
                    }
                }
                searchRange.push(obj);
            }
        }
        searchRange.length === files.state.fileList.length ? isglobal = true : isglobal = false;
        return new Promise((resolve, reject) => {
            bus.$emit('searchTableLoading', true);
            if (!searchRange.length) {
                bus.$emit('searchTableLoading', false);
                reject('err');
            } else {
                //console.log('searchFile'+JSON.stringify({context,searchRange,isglobal}))
                fetchData('searchFile', {
                    context,
                    searchRange,
                    isglobal
                }).then(res => {
                    let temp = res.fileList;
                    for (let i = 0; i < temp.length; i++) {
                        temp[i].rootPath = temp[i].root_path;
                        temp[i].serialNumber = temp[i].serial_number;
                        delete temp[i]['root_path'];
                        delete temp[i]['serial_number'];
                    }
                    commit(types.GET_SEARCH_TABLE_DATA, res.fileList);
                    bus.$emit('searchTableLoading', false);
                    resolve(res.fileList);
                }, err => {
                    bus.$emit('searchTableLoading', false);
                    reject('err')
                });
            }
        })

    },
    checkAllSwitch({
        commit
    }, flag) {
        flag ? commit(types.SELECTED_ALL_SEARCH_RANGE) : commit(types.REMOVE_SEARCH_RANGE);
    },
    setSearchRange({
        commit
    }, val) {
        commit(types.SET_SEARCH_RANGE, val);
    },
    setSearchRangeList({
        commit
    }, list) {
        commit(types.SET_SEARCH_RANGE_LIST, list);
    },
    setSearchPos({
        commit
    }, pos) {
        commit(types.SET_SEARCH_POS, pos);
    }
}

const mutations = {
    [types.GET_SEARCH_TABLE_DATA](state, data) {
        state.searchTableData = data;
    },
    [types.SET_SEARCH_VALUE](state, val) {
        state.searchValue = val;
    },
    [types.REMOVE_SEARCH_RANGE](state) {
        state.searchRange = [];
    },
    [types.SELECTED_ALL_SEARCH_RANGE](state) {
        state.searchRange = [];
        files.state.fileList.forEach((val, index) => {
            state.searchRange.push(val.alias);
        })
    },
    [types.SET_SEARCH_RANGE](state, str) {
        state.searchRange = [str];
    },
    [types.SET_SEARCH_RANGE_LIST](state, list) {
        state.searchRange = list;
    },
    [types.SET_SEARCH_POS](state, pos) {
        state.searchPos = pos;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}