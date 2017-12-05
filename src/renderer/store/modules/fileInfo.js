/*
 * 管理单个文件的基本信息，用于右侧文件详情显示
 */

import fetchData from '@/api'
import * as types from '@/store/mutation-types'
import file from '@/store/modules/files'
import global from '@/store/modules/global'
import bus from '@/utils/bus'
const state = {
  show: false,
  //是否移除right view
  removeRightView: false,
  //文件详情
  fileInfo: {},
  //文件状态的文件详情请求参数
  bottomFileInfoParams: {

  }
}

const getters = {
  show: state => state.show,
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
  resetFileInfo({ commit }) {
    return new Promise((resolve,reject)=>{
      commit(types.RESET_FILE_INFO);
      resolve('success');
    })
  },
  //获取文件详情
  getFileInfo({ commit }) {
    let filepath;
    if (!file.state.tableClickHistory.length) {
      filepath = file.state.navList[file.state.navList.length-1].path;
    } else {
      filepath = file.state.tableClickHistory[file.state.tableClickHistory.length - 1].path;
    }
    //root path  获取文件详情 childPath = rootPath;
    let serialNumber = file.state.serialNumber;
    let rootPath = file.state.rootPath;
    fetchData('getFileInfo', { serialNumber, rootPath, filepath }).then(res => {
      commit(types.GET_FILE_INFO, res);
    })
  },
  //获取搜索列表的单个文件的文件详情
  getSearchFileInfo({ commit }) {
      let filepath = file.state.searchTableClickHistory[file.state.searchTableClickHistory.length - 1].path;
      let serialNumber = file.state.searchTableClickHistory[file.state.searchTableClickHistory.length - 1].serialNumber;
      let rootPath = file.state.searchTableClickHistory[file.state.searchTableClickHistory.length - 1].rootPath;
      //console.log({serialNumber,rootPath,filepath});
      fetchData('getFileInfo', { serialNumber, rootPath, filepath }).then(res => {
        commit(types.GET_FILE_INFO, res);
      })
  },
  //手动设置fileinfo
  setFileInfo({ commit }, info) {
    commit(types.SET_FILE_INFO, info);
  },
  //input的绑定
  updateMessage({ commit }, params) {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_MESSAGE, params);
      resolve('success');
    })
  },
  //保存数据之前校验key是否存在
  saveFileInfo({ commit }) {
    let updateList = state.fileInfo.property.concat();
    for (let i = 0; i < updateList.length; i++) {
      for (let key in updateList[i]) {
        if (!updateList[i].name) {
          updateList.splice(i, 1);
          bus.$emit('saveAttrEmptyError');
          return;
          i--;
          break;
        }
      }
    }
    //检查key 是否重复
    for(var i =0;i<updateList.length;i++){
      for(var j=0;j<updateList.length;j++){
        if(updateList[i].name === updateList[j].name && i!==j){
          bus.$emit('saveAttrNameSame');
          return;
        }
      }
    }
    let remark = { name: "remark", attr: state.fileInfo.remark };
    updateList.push(remark);
    if (global.state.globalRouteStatus === 'file') {
      //文件列表保存详情
      let serialNumber = file.state.serialNumber;
      let rootPath = file.state.rootPath;
      let filePath;
      //点击进入文件夹的时候 默认清除点击历史记录
      if(file.state.tableClickHistory.length===0){
        filePath = file.state.navList[file.state.navList.length-1].path;
      }else{
        filePath = file.state.tableClickHistory[file.state.tableClickHistory.length - 1].path;
      }
      var param = { serialNumber, rootPath, filePath, updateList }
    } else if (global.state.globalRouteStatus === 'search') {
      //搜索列表保存详情
      let serialNumber = file.state.searchTableClickHistory[file.state.searchTableClickHistory.length - 1].serialNumber;
      let rootPath = file.state.searchTableClickHistory[file.state.searchTableClickHistory.length - 1].rootPath;
      let filePath = file.state.searchTableClickHistory[file.state.searchTableClickHistory.length - 1].path;
      var param = { serialNumber, rootPath, filePath, updateList }
    } else if (global.state.globalRouteStatus === 'status') {
      //文件状态保存详情
      let serialNumber = state.bottomFileInfoParams.serialNumber;
      let rootPath = state.bottomFileInfoParams.rootPath;
      let filePath = state.bottomFileInfoParams.filepath;
      var param = {serialNumber,rootPath,filePath,updateList}
    }
    return new Promise((resolve, reject) => {
      fetchData('updateAttribute', param).then(res => {
        commit(types.SAVE_FILE_INFO, updateList);
        // if(global.state.globalRouteStatus === 'status')
        resolve('success');
      })
    })
  },
  addFileInfo({ commit }) {
    commit(types.ADD_FILE_INFO);
  },
  commitSaveFileParams({ commit }, params) {
    return new Promise((resolve, reject) => {
      commit(types.COMMIT_SAVE_FILE_PARAMS,params)
      resolve('success');
    })
  },
  getStatusFileInfo({ commit }) {
    return new Promise((resolve,reject)=>{
      fetchData('getFileInfo', state.bottomFileInfoParams).then(res => {
        commit(types.GET_FILE_INFO,res);
        resolve('success');
      })
    })
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
  [types.GET_FILE_INFO](state, info) {
    state.fileInfo = info;
  },
  [types.RESET_FILE_INFO](state) {
    state.fileInfo = {};
  },
  [types.UPDATE_MESSAGE](state, params) {
    if (typeof params === 'string') {
      //参数类型为string 就是修改备注
      state.fileInfo.remark = params;
    } else {
      params.type === 'key' ? state.fileInfo.property[params.index].name = params.val : state.fileInfo.property[params.index].attr = params.val;
    }
  },
  //保存文件详情
  [types.SAVE_FILE_INFO](state, newInfo) {
    state.fileInfo.property = newInfo.slice(0, newInfo.length - 1);
    let temp = newInfo.slice(newInfo.length - 1);
    state.fileInfo.remark = temp[0].attr;
  },
  [types.ADD_FILE_INFO](state, params) {
    state.fileInfo.property.push({ 'name': "", 'attr': "" });
  },
  [types.SET_FILE_INFO](state, info) {
    state.fileInfo = info;
  },
  [types.COMMIT_SAVE_FILE_PARAMS](state, params) {
    state.bottomFileInfoParams = params;
  },
  [types.SET_FILEINFO_PROPERTY](state,arr){
    state.fileInfo.property = arr;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
