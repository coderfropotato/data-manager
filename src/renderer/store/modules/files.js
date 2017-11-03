/*
 * 管理后台传送的文件分类
 * 即侧边栏的所有文件夹中的文件
 */
import fetchData from '@/api'
import * as types from '@/store/mutation-types'
const state = {
  // 记录当前的文件列表（列表展示）
  fileList: [],
  // file table 文件列表
  fileTableData:[],
  //root path
  rootPath:'',
  //面包屑数组
  navText:[],
  //存序列号
  serialNumber:"",
}

const getters = {
  fileList: state => state.fileList,
  fileTableData:state=>state.fileTableData,
  navText:state=>state.navText
}

const actions = {
  //获取文件列表
  getImportTargetDisks({commit}){
    fetchData('getImportTargetDisks',{}).then((data)=>{
      commit(types.SET_FILE_LIST,data.disks)
    })
  },
  getDirTree({commit},params){
    // params =>serialNumber path
    let parm = {
      rootPath:state.rootPath,
      childPath:params.path,
      serialNumber:params.serialNumber
    }
    fetchData('getDirTree',parm).then(data=>{
      console.log(data);
      commit(types.SET_FILE_TABLE_dATA,data.result.tree);
    })
  },
  //设置根路径
  setRootPath({commit},path){
    commit(types.SET_ROOT_PATH,path);
  },
  //设置面包屑
  setNavBar({commit},params){
    commit(types.SET_NAV_BAR,params)
  },
  //更新 treedata 面包屑 
  updateFilesDetail({commit},params){
    commit(types.UPDATE_FILES_DETAIL,params);
  },
  //设置序列号
  setSerialNumber({commit},num){
    commit(types.SET_SERIAL_NUMBER,num);
  }
}

const mutations = {
  // 设置文件列表信息
  [types.SET_FILE_LIST] (state, list) {
    // 如果传进的response数组为 0，则设置文件列表为空，否则将新获取的文件加入原数组
    if (list.length === 0) {
      state.fileList = []
    } else {
      state.fileList = list;
    }
  },
  // 设置文件表格数据
  [types.SET_FILE_TABLE_dATA](state,list){
    if(list.length==0){
      state.filetableData = [];
    }else{
      state.fileTableData = list;
    }
  },
  //设置rootpath
  [types.SET_ROOT_PATH](state,path){
    state.rootPath = path;
  },
  //设置面包屑
  [types.SET_NAV_BAR](state,params){
    state.navText=[params];
  },
  //更新 filetable 面包屑
  [types.UPDATE_FILES_DETAIL](state,params){
  },
  //设置序列号
  [types.SET_SERIAL_NUMBER](state,num){
    state.serialNumber = num;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
