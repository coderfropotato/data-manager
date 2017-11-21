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
    searchTableData:[],
    searchRange:[],
    searchValue:"",
}

const getters = {
    searchTableData:state=>state.searchTableData,
    searchValue:state=>state.searchValue,
    searchRange:state=>state.searchRange,
    searchRangeLength:state=>{
        return state.searchRange.length;
    }
}
const actions = {
  getSearchTableData({commit},params){
      return new Promise((resolve,reject)=>{
          fetchData('searchFile',{}).then(_=>{
              commit(types.GET_SEARCH_TABLE_DATA,_);
              resolve('success');
          })
      })
  },
  //setup default search value
  setSearchValue({commit},val){
      return new Promise((resolve,reject)=>{
          commit(types.SET_SEARCH_VALUE,val);
          resolve('success')
      })
  },
  searchCurrentDisk({commit},context){
      return new Promise((resolve,reject)=>{
        let serialNumber = files.state.serialNumber;
        let rootPath = files.state.rootPath;
        let childPath = files.state.navList[files.state.navList.length-1].path;
        fetchData('searchCurrentDisk',{context,serialNumber,rootPath,childPath}).then(res=>{
            let data={},list=[];
            commit(types.GET_SEARCH_TABLE_DATA,res);
            resolve(list);
        })
      })
    },
    //global search
    searchFile({commit},params){
        //{context,type}
        //params：context searchRange[{serialNumber,path}];
        let context = params.context;
        let isglobal = false;
        let searchRange = [];
        if(params.type ==='files'){
            //fileList
            for(let i=0;i<files.state.fileList.length;i++){
                let obj={};
                obj.serialNumber = files.state.fileList[i].serial_number;
                obj.path = files.state.fileList[i].path;
                searchRange.push(obj);
            }
        }else{
            //searchRange
            for(let i=0;i<state.searchRange.length;i++){
                let obj={};
                obj.serialNumber = state.searchRange[i].serial_number;
                obj.path = state.searchRange[i].path;
                searchRange.push(obj);
            }
        }
        searchRange.length === files.state.fileList.length?isglobal = true:isglobal = false;
        return new Promise((resolve,reject)=>{
            if(!searchRange.length){
                reject('err');
            }else{
                //console.log('searchFile'+JSON.stringify({context,searchRange,isglobal}))
                fetchData('searchFile',{context,searchRange,isglobal}).then(res=>{
                    commit(types.GET_SEARCH_TABLE_DATA,res.fileList);
                    resolve(res.fileList);
                });
            }
        })
        
    },
    checkAllSwitch({commit},flag){
        flag?commit(types.SELECTED_ALL_SEARCH_RANGE):commit(types.REMOVE_SEARCH_RANGE);
    },
    setSearchRange({commit},val){
        commit(types.SET_SEARCH_RANGE,val);
    }
}

const mutations = {
    [types.GET_SEARCH_TABLE_DATA](state,data){
        state.searchTableData = data;
    },
    [types.SET_SEARCH_VALUE](state,val){
        state.searchValue = val;
    },
    [types.REMOVE_SEARCH_RANGE](state){
        state.searchRange = [];
    },
    [types.SELECTED_ALL_SEARCH_RANGE](state){
        state.searchRange = files.state.fileList;
    },
    [types.SET_SEARCH_RANGE](state,list){
        state.searchRange = list;
    }
}

export default {
  state,
  getters,
  actions,
  mutations
}
