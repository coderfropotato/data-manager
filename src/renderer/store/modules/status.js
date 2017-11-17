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
const test = true;
const state = {
    //状态树数据
    treeData:[],
    checkedData:[],
    modifiedNumber:0,
}

//树的侧边栏列表 信息从treeData获取 ->getter
const getters = {
    modifiedNumber:state=>state.modifiedNumber,
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
    },
    checkedData:state=>state.checkedData,
    treeCat:state=>{
        let obj = {"add":[],"move":[],"label":[],"delete":[],"modified":[]};
        for(let j=0;j<state.checkedData.length;j++){
            let cur = state.checkedData[j];
            switch(Number(cur.status)){
                case 1: obj.add.push(cur);break;
                case 2: obj.move.push(cur);break;
                case 3: obj.label.push(cur);break;
                case 4: obj.delete.push(cur);break;
                case 5: obj.modified.push(cur);break;
            }
        }
        return obj;
    }
}

const actions = {
    //获取文件状态树
    getModifiedFiles({commit}){
        let params={};
        let serialNumber = [];
        if(!file.state.fileList.length) return;
        params.dirs = [];
        for(var i=0;i<file.state.fileList.length;i++){
            let obj = {};
            obj.serialNumber = file.state.fileList[i].serial_number;
            obj.root_path = file.state.fileList[i].path;
            params.dirs.push(obj);
        }
        console.log(params)
        fetchData('getModifiedFiles',params).then((res)=>{
            let rootMarkArr = [];
            for(var i=0;i<res.length;i++){
                rootMarkArr.push(res[i].mark);
            }
            bus.$emit('statueSideBarClick',rootMarkArr);
            //按状态分类
            function loop(arr){
                var files=[];
                function loop(child){
                    var temp = [];
                    if(!child.length) return;
                    for(var i=0;i<child.length;i++){
                        if(child[i].children){
                            temp = temp.concat(child[i].children)
                        }else{
                            files.push(child[i]);
                        }
                    }
                    loop(temp)
                }
                loop(arr);
                return files;
            }
            let list =loop(res); 
            //默认全选的length
            commit(types.SET_CHECED_DATA,list);
            //修改的总数
            commit(types.SET_MODIFIED_NUM,list.length)
            //tree data
            commit(types.GET_TREE_DATA,res);
        })
    },
    // 接受所有变更
    reciveAll({commit}){
        new Promise((resolve,reject)=>{
            fetchData('');
        })
    },
    setCheckedData({commit},arr){
        commit(types.SET_CHECKED_DATA,arr);
    }
}

const mutations = {
    [types.GET_TREE_DATA](state,res){
        state.treeData = res;
    },
    [types.SET_CHECKED_DATA](state,arr){
        state.checkedData = arr;
    },
    [types.SET_CHECED_DATA](state,data){
        state.checkedData = data;
    },
    [types.SET_MODIFIED_NUM](state,len){
        state.modifiedNumber = len;
    }
}

export default {
  state,
  getters,
  actions,
  mutations
}
