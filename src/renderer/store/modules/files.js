/*
 * 管理后台传送的文件分类
 * 即侧边栏的所有文件夹中的文件
 */
import fetchData from '@/api';
import * as types from '@/store/mutation-types';
import bus from '@/utils/bus';
import global from '@/store/modules/global';
const state = {
  // 记录当前的文件列表（列表展示）
  fileList: [],
  // file table 文件列表
  fileTableData: [],
  //root path
  rootPath: '',
  //面包屑数组
  navList: [],
  //存序列号
  serialNumber: "",
  //设备名称
  deviceAlias:"",
  //表格选中的历史项，总是显示最后一个的详情
  tableClickHistory: [],
  searchTableClickHistory: [],
  //文件路径
  filePath: ""
}

const getters = {
  fileList: state => state.fileList,
  fileTableData: state => state.fileTableData,
  navList: state => state.navList,
  tableClickHistory: state => state.tableClickHistory,
  searchTableClickHistory: state => state.searchTableClickHistory,
  alias:state=>state.deviceAlias
}

const actions = {
  //获取文件列表
  getImportTargetDisks({
    commit
  }) {
    return new Promise((resolve, reject) => {
      fetchData('getImportTargetDisks', {}).then((data) => {
        commit(types.SET_FILE_LIST, data.disks);
        resolve('success');
      })
    })
  },
  getDirTree({
    commit
  }, params) {
    // params =>serialNumber path  type
    let parm = {
      rootPath: state.rootPath,
      childPath: params.path || state.rootPath,
      serialNumber: params.serialNumber || state.serialNumber
    }
    return new Promise((resolve, reiect) => {
      bus.$emit('fileTableLoading', true);
      fetchData('getDirTree', parm).then(data => {
        if (!data.fileList || !data.fileList.length) {
          commit(types.SET_TOTAL_COUTN, 0);
          commit(types.SET_FILE_TABLE_dATA, []);
        } else {
          commit(types.SET_TOTAL_COUTN, data.fileList.length);
          commit(types.SET_FILE_TABLE_dATA, data.fileList);
        }

        bus.$emit('fileTableLoading', false);
        resolve('success');
      }).catch(e => {
        bus.$emit('fileTableLoading', false);
        reject('error');
      })
    })
  },
  //设置根路径
  setRootPath({
    commit
  }, path) {
    return new Promise((resolve, reject) => {
      commit(types.SET_ROOT_PATH, path);
      resolve('success');
    })
  },
  //设置面包屑
  setNavBar({
    commit
  }, item) {
    return new Promise((resolve, reject) => {
      commit(types.SET_NAV_BAR, item);
      resolve('success');
    })
  },
  //增加面包屑 
  updateNavBar({
    commit
  }, item) {
    commit(types.UPDATE_FILES_DETAIL, item);
  },
  //删除面包屑
  delNavBar({
    commit
  }, index) {
    commit(types.DELETE_NAV_NAR, state.navList.slice(0, index + 1))
  },
  //设置序列号
  setSerialNumber({
    commit
  }, num) {
    return new Promise((resolve, reject) => {
      commit(types.SET_SERIAL_NUMBER, num);
      resolve('success');
    })
  },
  // 设置设备名称
  setDeviceAlias({commit},alias){
    commit(types.SET_DEVICE_ALIAS,alias);
  },
  //set bottom info
  setBottomInfo({
    commit
  }, valList) {
    return new Promise((resolve, reject) => {
      let size = 0;
      for (let j = 0; j < valList.length; j++) {
        if (!valList[j].isdir) {
          size += valList[j].size;
        } else {
          continue;
        }
      }
      let count = valList.length;
      if (global.state.globalRouteStatus === 'file') {
        //file
        commit(types.SET_ATTR_HISTORY, valList);
      } else {
        // search
        commit(types.SET_SEARCH_TABLE_CLICK, valList)
      }
      commit(types.SET_SELECTED, {
        count,
        size
      })
      resolve('success')
    })
  },
  // reset table click history
  resetTableClickHistory({
    commit
  }) {
    return new Promise((resolve, reject) => {
      commit(types.RESER_TABLE_CLICK_HISTORY);
      resolve('success');
    })
  }
}

const mutations = {
  // 设置文件列表信息
  [types.SET_FILE_LIST](state, list) {
    // 如果传进的response数组为 0，则设置文件列表为空，否则将新获取的文件加入原数组
    if (list.length === 0) {
      state.fileList = []
    } else {
      state.fileList = list;
    }
  },
  // 设置文件表格数据
  [types.SET_FILE_TABLE_dATA](state, list) {
    if (list.length == 0) {
      state.fileTableData = [];
    } else {
      state.fileTableData = list;
    }
  },
  //设置rootpath
  [types.SET_ROOT_PATH](state, path) {
    state.rootPath = path;
  },
  //设置面包屑
  [types.SET_NAV_BAR](state, item) {
    state.navList.length = 0;
    state.navList.push(item);
  },
  //更新 filetable 面包屑
  [types.UPDATE_FILES_DETAIL](state, item) {
    state.navList.push(item);
  },
  //删除面包屑
  [types.DELETE_NAV_NAR](state, temp) {
    state.navList = temp;
  },
  //设置序列号
  [types.SET_SERIAL_NUMBER](state, num) {
    state.serialNumber = num;
  },
  [types.SET_ATTR_HISTORY](state, arr) {
    state.tableClickHistory = arr;
  },
  [types.SET_SEARCH_TABLE_CLICK](state, arr) {
    state.searchTableClickHistory = arr;
  },
  //设置详情点击历史 总是查看最后一个点击的详情 取消点击 按选择顺序查看详情
  // reset table click history
  [types.RESER_TABLE_CLICK_HISTORY](state) {
    state.tableClickHistory = [];
  },
  [types.SET_DEVICE_ALIAS](state,alias){
    state.deviceAlias = alias;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}