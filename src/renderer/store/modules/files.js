/*
 * 管理后台传送的文件分类
 * 即侧边栏的所有文件夹中的文件
 */
import fetchData from '@/api'
import * as types from '@/store/mutation-types'
// 引入文件树数据处理函数
//import travelTree from '@/utils/handleCategoryTreeData'
import convert from '@/utils/convertTreeToList'
console.log(convert)
const state = {
  // 记录当前的文件列表（列表展示）
  fileList: [],
  // file table 文件列表
  fileTableData:[],
  //树深度数组
  treeArr:[0],
  //面包屑数组
  navText:[],
  //存序列号
  serialNumber:""
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
  getFileTree({commit},params){
    // params =>serialNumber path
    fetchData('getFileTree',params).then(data=>{
      commit(types.SET_FILE_TABLE_dATA,data);
    })
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
  [types.SET_FILE_TABLE_dATA](state,listObj){
    if(!listObj.result.tree.length){
      state.fileTableData=[];
      state.defaultTableData = [];
    }else{
      state.defaultTableData = listObj.result.tree[0];
      let temp = [];
      for(let key in listObj.result.tree[0]){
        let cur = listObj.result.tree[0][key];
        let obj = {};
        obj.filename = key;
        obj.ctime =  cur.ctime;
        obj.isdir =  cur.isdir;
        obj.mtime =  cur.mtime;
        obj.path =  cur.path;
        obj.size =  cur.size;
        temp.push(obj);
      }
      state.fileTableData = temp;
    }
  },
  //设置层级表格显示数据

  //设置面包屑
  [types.SET_NAV_BAR](state,params){
    state.navText=[params];
  },
  //更新 filetable 面包屑
  [types.UPDATE_FILES_DETAIL](state,params){
  },
  //设置默认树深
  [types.DEFAULT_TREE_INDEX](state){
    state.treeArr=[0];
  },
  //追加树深度索引
  [types.PUSH_TREE_INDEX](state,index){
    state.treeArr.push(index);
  },
  //删除树深度索引
  [types.DEL_TREE_INDEX](state,index){
    state.treeArr = state.treeArr.slice(0,(state.treeArr.indexOf(index)+1));
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
