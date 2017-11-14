/*
 * 文件状态
 */
import fetchData from '@/api';
import * as types from '@/store/mutation-types';
import treeData from '@/utils/tree';
import file from '@/store/modules/files';

const test = true;
const state = {
    //状态树数据
    treeData:treeData,
    checkedData:[],
}

//树的侧边栏列表 信息从treeData获取 ->getter
const getters = {
    treeData:state=>state.treeData,
    treeSideBar:(state)=>{
        let temp = [];
        for(let i=0;i<state.treeData.length;i++){
            let item = {};
            for(let key in state.treeData[i]){  
                if(key!=='children')item[key] = state.treeData[i][key];
            }
            temp.push(item);
        }
        return temp
    }
}

const actions = {
    //获取文件状态树
    getModifiedFiles({commit}){
        let params={};
        let serialNumber = [];
        for(var i=0;i<file.state.fileList.length;i++){
            serialNumber.push(file.state.fileList[i].serial_number);
        }
        params.serialNumbers = serialNumber
        fetchData('getModifiedFiles',params).then((res)=>{
            commit(types.GET_TREE_DATA,res);
        })
    },
    // 接受所有变更
    reciveAll({commit}){
        new Promise((resolve,reject)=>{
            fetchData('');
        })
    }
}

const mutations = {
    [types.GET_TREE_DATA](state,res){
        state.treeData = res;
    }
}

export default {
  state,
  getters,
  actions,
  mutations
}
