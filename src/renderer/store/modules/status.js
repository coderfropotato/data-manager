/*
 * 文件状态
 */
import fetchData from '@/api';
import * as types from '@/store/mutation-types';
// import treeData from '@/utils/tree';
import file from '@/store/modules/files';
import bus from '@/utils/bus';
import unique from '@/utils/tools'

/* 
1最近新增add
2最近移动move	
3已打标签lable
4最近删除delete
5最近修改modified 
*/
function loop(arr) {
    var files = [];
    function loop(child) {
        var temp = [];
        if (!child.length) return;
        for (var i = 0; i < child.length; i++) {
            if (child[i].children) {
                temp = temp.concat(child[i].children)
            } else {
                files.push(child[i]);
            }
        }
        loop(temp)
    }
    loop(arr);
    return files;
}
const subParams = (type)=>{
    let dirs = [];
    for(var i=0;i<file.state.fileList.length;i++){
        let obj = {};
        obj.root_path = file.state.fileList[i].path;
        obj.serial_number = file.state.fileList[i].serial_number;
        dirs.push(obj);
    }
    let all = getters.treeCat(state);
    let files = all[type];
    return {files,dirs};
}

const state = {
    //状态树数据
    treeData: [],
    checkedData: [],
    modifiedNumber: 0,
    curStatus: 0,
    curData: [],
    curIndex: 0
}

//树的侧边栏列表 信息从treeData获取 ->getter
const getters = {
    curIndex: state => state.curIndex,
    curData: state => state.curData,
    curStatus: state => state.curStatus,
    modifiedNumber: state => state.modifiedNumber,
    treeData: state => state.treeData,
    treeSideBar: (state) => {
        let temp = [];
        for (let i = 0; i < state.treeData.length; i++) {
            let item = {};
            for (let key in state.treeData[i]) {
                if (key !== 'children') item[key] = state.treeData[i][key];
            }
            temp.push(item);
        }
        return temp
    },
    checkedData: state => state.checkedData,
    checkedDataLen: state => state.checkedData.length,
    treeCat: state => {
        let obj = { "add": [], "move": [], "label": [], "delete": [], "modified": [] };
        for (let j = 0; j < state.checkedData.length; j++) {
            let cur = state.checkedData[j];
            switch (Number(cur.status)) {
                case 1: obj.add.push(cur); break;
                case 2: obj.move.push(cur); break;
                case 3: obj.label.push(cur); break;
                case 4: obj.delete.push(cur); break;
                case 5: obj.modified.push(cur); break;
            }
        }
        return obj;
    }
}

const actions = {
    //获取文件状态树
    getModifiedFiles({ commit }) {
        let params = {};
        let serialNumber = [];
        if (!file.state.fileList.length) return;
        params.dirs = [];
        for (var i = 0; i < file.state.fileList.length; i++) {
            let obj = {};
            obj.serial_number = file.state.fileList[i].serial_number;
            obj.root_path = file.state.fileList[i].path;
            params.dirs.push(obj);
        }
        return new Promise((resolve, reject) => {
            fetchData('getModifiedFiles', params).then((res) => {
                let rootMarkArr = [];
                for (var i = 0; i < res.length; i++) {
                    rootMarkArr.push(res[i].mark);
                }
                // status side clicked
                bus.$emit('statueSideBarClick', rootMarkArr);
                //按状态分类
                let list = loop(res);
                //默认全选的length
                commit(types.SET_CHECKED_DATA, list);
                //修改的总数
                commit(types.SET_MODIFIED_NUM, list.length)
                //tree data
                commit(types.GET_TREE_DATA, res);
                // done
                resolve('success');
            })
        })
    },
    setCheckedData({ commit }, arr) {
        commit(types.SET_CHECKED_DATA, arr);
    },
    deleteSatatus({ commit }, { serialNumber, path }) {
        let temp = state.treeData;
        temp.forEach((val, index) => {
            if (val.serialNumber === serialNumber && val.root_path === path) {
                temp.splice(index, 1);
            }
        })
        commit(types.GET_TREE_DATA, temp);
        //重新设置选中数据
        let list = loop(temp);
        commit(types.SET_CHECKED_DATA, list);
        //设置modifiedNumber
        commit(types.SET_MODIFIED_NUM, list.length)
    },
    setCurStatus({ commit }, status) {
        new Promise((resolve, reject) => {
            commit(types.SET_CUR_STATUS, status);
            resolve('success');
        })
    },
    setCurIndex({ commit }, mark) {
        let treeCat = getters.treeCat(state);
        let temp = [];
        let index;
        switch (state.curStatus) {
            case 1: temp = treeCat.add; break;
            case 2: temp = treeCat.move; break;
            case 3: temp = treeCat.label; break;
            case 4: temp = treeCat.delete; break;
            case 5: temp = treeCat.modified; break;
        }
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].mark === mark) {
                index = i;
                break;
            }
        }
        // 设置当前状态为 curStatus 的数据 用来上一步下一步
        commit(types.SET_CUR_DATA, temp);
        // 设置点击项在当前 所属状态数据的索引
        commit(types.SET_CUR_INDEX, index);
    },
    getPreInfo({ commit }) {
        let serialNumber = curData[curIndex - 1].serialNumber;
        let rootPath = curData[curIndex - 1].root_path;
        let filepath = curData[curIndex - 1].path;
        return new Prmose((resolve, reject) => {
            fetchData('geiFileInfo', { serialNumber, rootPath, filepath }).then(res => {
                commit('setFileInfo', res);
            })
        })
    },
    addCurIndex({ commit }) {
        commit(types.ADD_CUR_INDEX);
    },
    reduceCurIndex({ commit }) {
        commit(types.REDUCE_CUR_INDEX);
    },
    //接受所有文件
    reciveAll({ commit }) {
        return new Promise((resolve, reject) => {
            let treeCat = getters.treeCat(state);
            let add_files = treeCat.add;
            let modify_files = treeCat.modified;
            let del_files = treeCat.delete;
            let move_files = treeCat.move;
            let tag_files = treeCat.label;
            // console.log({add_files,modify_files,del_files,move_files,tag_files});
            fetchData('submitAllFileInfo', {add_files,modify_files,del_files,move_files,tag_files}).then(res => {
                let rootMarkArr = [];
                for (var i = 0; i < res.length; i++) {
                    rootMarkArr.push(res[i].mark);
                }
                bus.$emit('statueSideBarClick', rootMarkArr);
                let list = loop(res);
                commit(types.SET_CHECKED_DATA, list);
                commit(types.SET_MODIFIED_NUM, list.length)
                commit(types.GET_TREE_DATA, res);
                resolve('success');
            })
        })
    },
    
    /**
     * 最近新增
     * 
     * @param {any} {commit} 
     * @returns 
     */
    submitAddFileInfo({commit}){
        return new Promise((resolve, reject) => {
            let params = subParams('add');
            // console.log(params)
            fetchData('submitAddFileInfo', params).then(res => {
                let rootMarkArr = [];
                for (var i = 0; i < res.length; i++) {
                    rootMarkArr.push(res[i].mark);
                }
                bus.$emit('statueSideBarClick', rootMarkArr);
                let list = loop(res);
                commit(types.SET_CHECKED_DATA, list);
                commit(types.SET_MODIFIED_NUM, list.length)
                commit(types.GET_TREE_DATA, res);
                resolve('success');
            })
        })
    },
    
    /**
     * 最近删除 (差处理完毕)
     * 
     * @param {any} { commit } 
     * @returns 
     */
    //保留标签信息
    saveDelFileAttr({ commit }) {
        return new Promise((resolve, reject) => {
            let params = subParams('delete')
            fetchData('saveDelFileAttr', params).then(res => {
                let rootMarkArr = [];
                for (var i = 0; i < res.length; i++) {
                    rootMarkArr.push(res[i].mark);
                }
                bus.$emit('statueSideBarClick', rootMarkArr);
                let list = loop(res);
                commit(types.SET_CHECKED_DATA, list);
                commit(types.SET_MODIFIED_NUM, list.length)
                commit(types.GET_TREE_DATA, res);
                resolve('success');
            })
        })
    },
    //彻底删除
    delDelFileAttr({ commit }) {
        return new Promise((resolve, reject) => {
            let params = subParams('delete')
            fetchData('delDelFileAttr', params).then(res => {
                let rootMarkArr = [];
                for (var i = 0; i < res.length; i++) {
                    rootMarkArr.push(res[i].mark);
                }
                bus.$emit('statueSideBarClick', rootMarkArr);
                let list = loop(res);
                commit(types.SET_CHECKED_DATA, list);
                commit(types.SET_MODIFIED_NUM, list.length)
                commit(types.GET_TREE_DATA, res);
                resolve('success');
            })
        })
    },
    
    /**
     * 最近修改
     * 
     * @param {any} { commit } 
     * @returns 
     */
    submitModifyFileInfo({ commit }) {
        return new Promise((resolve, reject) => {
            let params = subParams('modified')
            fetchData('delDelFileAttr', params).then(res => {
                let rootMarkArr = [];
                for (var i = 0; i < res.length; i++) {
                    rootMarkArr.push(res[i].mark);
                }
                bus.$emit('statueSideBarClick', rootMarkArr);
                let list = loop(res);
                commit(types.SET_CHECKED_DATA, list);
                commit(types.SET_MODIFIED_NUM, list.length)
                commit(types.GET_TREE_DATA, res);
                resolve('success');
            })
        })
    },
    /**
     * 最近移动 (差处理完毕)
     * 
     * @param {any} { commit } 
     * @returns 
     */
    //继承移动信息
    saveMoveFileAttr({ commit }) {
        return new Promise((resolve, reject) => {
            let params = subParams('move')
            fetchData('saveMoveFileAttr', params).then(res => {
                let rootMarkArr = [];
                for (var i = 0; i < res.length; i++) {
                    rootMarkArr.push(res[i].mark);
                }
                bus.$emit('statueSideBarClick', rootMarkArr);
                let list = loop(res);
                commit(types.SET_CHECKED_DATA, list);
                commit(types.SET_MODIFIED_NUM, list.length)
                commit(types.GET_TREE_DATA, res);
                resolve('success');
            })
        })
    },
    //不继承信息
    noInheritInfo({ commit }) {
        return new Promise((resolve, reject) => {
            let params = subParams('move')
            fetchData('delMoveFileAttr', params).then(res => {
                let rootMarkArr = [];
                for (var i = 0; i < res.length; i++) {
                    rootMarkArr.push(res[i].mark);
                }
                bus.$emit('statueSideBarClick', rootMarkArr);
                let list = loop(res);
                commit(types.SET_CHECKED_DATA, list);
                commit(types.SET_MODIFIED_NUM, list.length)
                commit(types.GET_TREE_DATA, res);
                resolve('success');
            })
        })
    },
    //处理完毕


    /**
     * 已打标签
     * 
     * @param {any} { commit } 
     * @returns 
     */
    submitTaggedFileInfo({ commit }) {
        return new Promise((resolve, reject) => {
            let params = subParams('label')
            fetchData('submitTaggedFileInfo', params).then(res => {
                let rootMarkArr = [];
                for (var i = 0; i < res.length; i++) {
                    rootMarkArr.push(res[i].mark);
                }
                bus.$emit('statueSideBarClick', rootMarkArr);
                let list = loop(res);
                commit(types.SET_CHECKED_DATA, list);
                commit(types.SET_MODIFIED_NUM, list.length)
                commit(types.GET_TREE_DATA, res);
                resolve('success');
            })
        })
    },
    
}

const mutations = {
    [types.GET_TREE_DATA](state, res) {
        state.treeData = res;
    },
    [types.SET_CHECKED_DATA](state, arr) {
        state.checkedData = arr;
    },
    [types.SET_MODIFIED_NUM](state, len) {
        state.modifiedNumber = len;
    },
    [types.SET_CUR_STATUS](state, status) {
        state.curStatus = status;
    },
    [types.SET_CUR_INDEX](state, index) {
        state.curIndex = index;
    },
    [types.SET_CUR_DATA](state, arr) {
        state.curData = arr;
    },
    [types.ADD_CUR_INDEX](state) {
        state.curIndex++;
    },
    [types.REDUCE_CUR_INDEX](state) {
        state.curIndex--;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
