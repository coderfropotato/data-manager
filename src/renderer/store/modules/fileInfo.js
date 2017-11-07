/*
 * 管理单个文件的基本信息，用于右侧文件详情显示
 */

import fetchData from '@/api'
import * as types from '@/store/mutation-types'
import file from '@/store/modules/files'
import bus from '@/utils/bus'
const state = {
  show:false,
  //是否移除right view
  removeRightView: false,
  //文件详情
  fileInfo:{}
}

const getters = {
  show:state=>state.show,
  removeRightView: state => state.removeRightView,
  fileInfo: state => state.fileInfo
}

const actions = {
  //隐藏右侧文件详情
  hideFileInfo({ commit }) {
    commit(types.HIDE_FILE_INFO)
  },
  //显示右侧文件详情
  showFileInfo({ commit }) {
    commit(types.SHOW_FILE_INFO)
  },
  //移除右侧view
  removeRightView({ commit }, status) {
    commit(types.REMOVE_RIGHT_VIEW, status)
  },
  //设置文件详情
  resetFileInfo({commit}){
    commit(types.RESET_FILE_INFO);
  },
  //获取文件详情
  getFileInfo({commit}){
    //root 区分是否跟路径
    let filepath;
    if(!file.state.tableClickHistory.length){
      bus.$emit('noInfoData');
      return;
    }else{
      filepath = file.state.tableClickHistory[file.state.tableClickHistory.length-1].path;
    }
     //root path  获取文件详情 childPath = rootPath;
    // filepath = file.state.rootPath;
    let serialNumber =file.state.serialNumber;
    let rootPath = file.state.rootPath;
    fetchData('getFileInfo',{serialNumber,rootPath,filepath}).then(res=>{
      commit(types.GET_FILE_INFO,res);
    })
  },
  //input的绑定
  updateMessage({commit},params){
    return new Promise((resolve,reject)=>{
      commit(types.UPDATE_MESSAGE,params);
      resolve('success');
    })
  }, 
  //保存数据之前校验key是否存在
  saveFileInfo({commit},params){
    let updateList = state.fileInfo.property.concat();
    for(let i=0;i<updateList.length;i++){
      for(let key in updateList[i]){
        if(!updateList[i].name){
          updateList.splice(i,1);
          i--;
        }else{
          continue;
        }
      }
    }
    let remark = {name:"remark",attr:state.fileInfo.remark};
    updateList.push(remark);
    let serialNumber =file.state.serialNumber;
    let rootPath = file.state.rootPath; 
    let filePath =file.state.tableClickHistory[file.state.tableClickHistory.length-1].path;
    let param = {
      serialNumber,
      rootPath,
      filePath,
      updateList
    }
    return new Promise((resolve,reject)=>{
      fetchData('updateAttribute',param).then(res=>{
        console.log(res);
        resolve('success');
        commit(types.SAVE_FILE_INFO,updateList);
      })
    })
  },
  addFileInfo({commit}){
    commit(types.ADD_FILE_INFO);
  }
}

const mutations = {
  // 显示文件信息区
  [types.SHOW_FILE_INFO](state) {
    state.show = true
  },
  //隐藏文件信息区
  [types.HIDE_FILE_INFO](state) {
    state.show = false
  },
  [types.REMOVE_RIGHT_VIEW](state, status) {
    state.removeRightView = status;
  },
  [types.GET_FILE_INFO](state,info){
      state.fileInfo = info;
  },
  [types.RESET_FILE_INFO](state){
    state.fileInfo = {};
  },
  [types.UPDATE_MESSAGE](state,params){
    if(typeof params ==='string'){
      //参数类型为string 就是修改备注
      state.fileInfo.remark = params;
    }else{
      params.type==='key'?state.fileInfo.property[params.index].name=params.val:state.fileInfo.property[params.index].attr=params.val;
    }
  },
  //保存文件详情
  [types.SAVE_FILE_INFO](state,newInfo){
    state.fileInfo.property = newInfo.slice(0,newInfo.length-1);
    let temp = newInfo.slice(newInfo.length-1);
    state.fileInfo.remark = temp[0].attr;
  },
  [types.ADD_FILE_INFO](state,params){
    state.fileInfo.property.push({'name':"",'attr':""});
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
