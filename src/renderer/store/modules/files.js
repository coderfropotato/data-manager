/*
 * 管理后台传送的文件分类
 * 即侧边栏的所有文件夹中的文件
 */
import fetchData from '@/api';
import * as types from '@/store/mutation-types';
import bus from '@/utils/bus';
const state = {
  // 记录当前的文件列表（列表展示）
  fileList: [],
  // file table 文件列表
  fileTableData:[],
  //root path
  rootPath:'',
  //面包屑数组
  navList:[],
  //存序列号
  serialNumber:"",
  //表格选中的历史项，总是显示最后一个的详情
  tableClickHistory :[],
  //文件路径
  filePath:""
}

const getters = {
  fileList: state => state.fileList,
  fileTableData:state=>state.fileTableData,
  navList:state=>state.navList,
  tableClickHistory:state=>state.tableClickHistory
}

const actions = {
  //获取文件列表
  getImportTargetDisks({commit}){
    return new Promise((resolve,reject)=>{
      fetchData('getImportTargetDisks',{}).then((data)=>{
        commit(types.SET_FILE_LIST,data.disks);
        resolve('success');
      })
    })
  },
  getDirTree({commit},params){
    // params =>serialNumber path  type
    let parm = {
      rootPath:state.rootPath,
      childPath:params.path || state.rootPath,
      serialNumber:params.serialNumber || state.serialNumber
    }
    return new Promise((resolve,reiect)=>{
      fetchData('getDirTree',parm).then(data=>{
        commit(types.SET_TOTAL_COUTN,data.length);
        commit(types.SET_FILE_TABLE_dATA,data);
        resolve('success');
      })
    })
  },
  //设置根路径
  setRootPath({commit},path){
    return new Promise((resolve,reject)=>{
      commit(types.SET_ROOT_PATH,path);
      resolve('success');
    })
  },
  //设置面包屑
  setNavBar({commit},item){
    commit(types.SET_NAV_BAR,item)
  },
  //增加面包屑 
  updateNavBar({commit},item){
    commit(types.UPDATE_FILES_DETAIL,item);
  },
  //删除面包屑
  delNavBar({commit},index){
    commit(types.DELETE_NAV_NAR,index)
  },
  //设置序列号
  setSerialNumber({commit},num){
    return new Promise((resolve,reject)=>{
      commit(types.SET_SERIAL_NUMBER,num);
      resolve('success');
    })
  },
  //set bottom info
  setBottomInfo({commit},valList){
    return new Promise((resolve,reject)=>{
      let size = 0;
      valList.forEach((val,index)=>{
        size+=val.size;
      });
      let count = valList.length;
      commit(types.SET_SELECTED,{count,size})
      if(valList.length===0) bus.$emit('no-data');
      commit(types.SET_ATTR_HISTORY,valList);
      resolve('success')
    })
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
      state.fileTableData = [];
    }else{
      state.fileTableData = list;
    }
  },
  //设置rootpath
  [types.SET_ROOT_PATH](state,path){
    state.rootPath = path;
  },
  //设置面包屑
  [types.SET_NAV_BAR](state,item){
    state.navList.length=0;
    state.navList.push(item);
  },
  //更新 filetable 面包屑
  [types.UPDATE_FILES_DETAIL](state,item){
    state.navList.push(item);
  },
  //删除面包屑
  [types.DELETE_NAV_NAR](state,index){
    state.navList.splice(index+1,1);
  },
  //设置序列号
  [types.SET_SERIAL_NUMBER](state,num){
    state.serialNumber = num;
  },
  [types.SET_ATTR_HISTORY](state,arr){
    state.tableClickHistory = arr;
  }
  //设置详情点击历史 总是查看最后一个点击的详情 取消点击 按选择顺序查看详情

}

export default {
  state,
  getters,
  actions,
  mutations
}
