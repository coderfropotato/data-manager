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
  removeRightView: true,
  //文件详情
  fileInfo: {},
  //文件状态的文件详情请求参数
  bottomFileInfoParams: {

  }
}

const getters = {
  show: state => state.show,
  removeRightView: state => state.removeRightView,
  fileInfo: state => state.fileInfo,
}

const actions = {
  //隐藏右侧文件详情
  hideFileInfo({
    commit
  }) {
    commit(types.HIDE_FILE_INFO)
  },
  //显示右侧文件详情
  showFileInfo({
    commit
  }) {
    commit(types.SHOW_FILE_INFO)
  },
  //移除右侧view
  removeRightView({
    commit
  }, status) {
    commit(types.REMOVE_RIGHT_VIEW, status)
  },
  //设置文件详情
  resetFileInfo({
    commit
  }) {
    return new Promise((resolve, reject) => {
      commit(types.RESET_FILE_INFO);
      resolve('success');
    })
  },
  //获取文件详情
  getFileInfo({
    commit
  }) {
    let filepath;
    if (!file.state.tableClickHistory.length) {
      filepath = file.state.navList[file.state.navList.length - 1].path;
    } else {
      filepath = file.state.tableClickHistory[file.state.tableClickHistory.length - 1].path;
    }
    //root path  获取文件详情 childPath = rootPath;
    let serialNumber = file.state.serialNumber;
    let rootPath = file.state.rootPath;
    bus.$emit('fileInfoLoading', true);
    fetchData('getFileInfo', {
      serialNumber,
      rootPath,
      filepath
    }).then(res => {
      bus.$emit('fileInfoLoading', false);
      commit(types.GET_FILE_INFO, res);
    }).catch(e => {
      bus.$emit('fileInfoLoading', false);
    })
  },
  //获取搜索列表的单个文件的文件详情
  getSearchFileInfo({
    commit
  }) {
    let filepath = file.state.searchTableClickHistory[file.state.searchTableClickHistory.length - 1].path;
    let serialNumber = file.state.searchTableClickHistory[file.state.searchTableClickHistory.length - 1].serialNumber;
    let rootPath = file.state.searchTableClickHistory[file.state.searchTableClickHistory.length - 1].rootPath;
    //console.log({serialNumber,rootPath,filepath});
    bus.$emit('fileInfoLoading', true);
    fetchData('getFileInfo', {
      serialNumber,
      rootPath,
      filepath
    }).then(res => {
      bus.$emit('fileInfoLoading', false);
      commit(types.GET_FILE_INFO, res);
    }).catch(e => {
      bus.$emit('fileInfoLoading', false);
    })
  },
  //手动设置fileinfo
  setFileInfo({
    commit
  }, info) {
    commit(types.SET_FILE_INFO, info);
  },
  //input的绑定
  updateMessage({
    commit
  }, params) {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_MESSAGE, params);
      resolve('success');
    })
  },
  //校验属性
  checkAttrs({
    commit
  }) {
    let attrs = state.fileInfo.property.concat();
    for (let i = 0; i < attrs.length; i++) {
      if (attrs[i].name === '') {
        attrs.splice(i, 1);
        i--;
      }
    }
    commit(types.SET_FILEINFO_PROPERTY, attrs);
  },
  //删除属性
  deleteAttrs({
    commit
  }, index) {
    let property = state.fileInfo.property;
    if (property[index]) {
      property.splice(index, 1);
    }
    return new Promise((resolve, reject) => {
      commit(types.SET_FILEINFO_PROPERTY, property);
      resolve('success');
    })
  },
  //保存数据之前校验key是否存在
  saveFileInfo({
    commit
  }) {
    let updateList = state.fileInfo.property.concat();
    for (let i = 0; i < updateList.length; i++) {
      if (updateList[i].name === '') {
        updateList.splice(i, 1);
        i--;
        // 属性为空的提示
        // bus.$emit('saveAttrEmptyError');
      }
    }
    //检查key 是否重复
    for (var i = 0; i < updateList.length; i++) {
      for (var j = 0; j < updateList.length; j++) {
        if (updateList[i].name === updateList[j].name && i !== j) {
          // commit(types.DELETE_FILE_ATTRS, j);
          bus.$emit('saveAttrNameSame');
          return new Promise((resolve, reject) => {
            resolve('error');
          })
        }
      }
    }
    bus.$emit("removeSaveAttrNameSameStatus");
    // let remark = {
    //   name: "remark",
    //   attr: state.fileInfo.remark
    // };
    // updateList.push(remark);
    if (global.state.globalRouteStatus === 'file') {
      //文件列表保存详情
      let serialNumber = file.state.serialNumber;
      let rootPath = file.state.rootPath;
      let filePath;
      //点击进入文件夹的时候 默认清除点击历史记录
      if (file.state.tableClickHistory.length === 0) {
        filePath = file.state.navList[file.state.navList.length - 1].path;
      } else {
        filePath = file.state.tableClickHistory[file.state.tableClickHistory.length - 1].path;
      }
      var param = {
        serialNumber,
        rootPath,
        filePath,
        updateList
      }
    } else if (global.state.globalRouteStatus === 'search') {
      //搜索列表保存详情
      let serialNumber = file.state.searchTableClickHistory[file.state.searchTableClickHistory.length - 1].serialNumber;
      let rootPath = file.state.searchTableClickHistory[file.state.searchTableClickHistory.length - 1].rootPath;
      let filePath = file.state.searchTableClickHistory[file.state.searchTableClickHistory.length - 1].path;
      var param = {
        serialNumber,
        rootPath,
        filePath,
        updateList
      }
    } else if (global.state.globalRouteStatus === 'status') {
      //文件状态保存详情
      let serialNumber = state.bottomFileInfoParams.serialNumber;
      let rootPath = state.bottomFileInfoParams.rootPath;
      let filePath = state.bottomFileInfoParams.filepath;
      var param = {
        serialNumber,
        rootPath,
        filePath,
        updateList
      }
    }
    return new Promise((resolve, reject) => {
      fetchData('updateAttribute', param).then(res => {
        commit(types.SAVE_FILE_INFO, updateList);
        // if(global.state.globalRouteStatus === 'status')
        resolve('success');
      })
    })
  },
  // 保存备注
  saveRemarkInfo({
    commit
  }) {
    let remark = state.fileInfo.remark
    if (global.state.globalRouteStatus === 'file') {
      //文件列表保存详情
      let serialNumber = file.state.serialNumber;
      let rootPath = file.state.rootPath;
      let filePath;
      //点击进入文件夹的时候 默认清除点击历史记录
      if (file.state.tableClickHistory.length === 0) {
        filePath = file.state.navList[file.state.navList.length - 1].path;
      } else {
        filePath = file.state.tableClickHistory[file.state.tableClickHistory.length - 1].path;
      }
      var param = {
        serialNumber,
        rootPath,
        filePath,
        remark
      }
    } else if (global.state.globalRouteStatus === 'search') {
      //搜索列表保存详情
      let serialNumber = file.state.searchTableClickHistory[file.state.searchTableClickHistory.length - 1].serialNumber;
      let rootPath = file.state.searchTableClickHistory[file.state.searchTableClickHistory.length - 1].rootPath;
      let filePath = file.state.searchTableClickHistory[file.state.searchTableClickHistory.length - 1].path;
      var param = {
        serialNumber,
        rootPath,
        filePath,
        remark
      }
    } else if (global.state.globalRouteStatus === 'status') {
      //文件状态保存详情
      let serialNumber = state.bottomFileInfoParams.serialNumber;
      let rootPath = state.bottomFileInfoParams.rootPath;
      let filePath = state.bottomFileInfoParams.filepath;
      var param = {
        serialNumber,
        rootPath,
        filePath,
        remark
      }
    }
    return new Promise((resolve, reject) => {
      fetchData('updateRemark', param).then(res => {
        commit(types.SAVE_FILE_INFO_REMAEK, remark);
        resolve('success');
      }).catch(err => { })
    })
  },
  addFileInfo({
    commit
  }) {
    commit(types.ADD_FILE_INFO);
  },
  commitSaveFileParams({
    commit
  }, params) {
    return new Promise((resolve, reject) => {
      commit(types.COMMIT_SAVE_FILE_PARAMS, params)
      resolve('success');
    })
  },
  getStatusFileInfo({
    commit
  }) {
    return new Promise((resolve, reject) => {
      bus.$emit('fileInfoLoading', true);
      fetchData('getFileInfo', state.bottomFileInfoParams).then(res => {
        commit(types.GET_FILE_INFO, res);
        bus.$emit('fileInfoLoading', false);
        resolve('success');
      }).catch(e => {
        bus.$emit('fileInfoLoading', false);
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
    state.fileInfo.property = newInfo;
  },
  [types.ADD_FILE_INFO](state, params) {
    state.fileInfo.property.push({
      'name': "",
      'attr': ""
    });
  },
  [types.SET_FILE_INFO](state, info) {
    state.fileInfo = info;
  },
  [types.COMMIT_SAVE_FILE_PARAMS](state, params) {
    state.bottomFileInfoParams = params;
  },
  [types.SET_FILEINFO_PROPERTY](state, arr) {
    state.fileInfo.property = arr;
  },
  [types.DELETE_FILE_ATTRS](state, index) {
    state.fileInfo.property.splice(index, 1);
  },
  [types.CLEAR_FILE_ATTRS](state, index) {
    state.fileInfo.property[index].name = '';
  },
  [types.SAVE_FILE_INFO_REMAEK](state, remark) {
    state.fileInfo.remark = remark;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}