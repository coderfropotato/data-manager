/*
 * 管理单个文件的基本信息，用于右侧文件详情显示
 */

import sendMessage from '@/api'
import * as types from '@/store/mutation-types'
// import * as object from '@/api/data'

const conditionMap = {
  'year': '年份',
  'type': '数据源',
  'private': '私有数据',
  'public': '共有数据',
  'share': '共享数据',
  'filetype': '文件类型',
  'organism': '物种',
  'strain': '品种',
  'tissue': '组织',
  'sex': '性别',
  'age': '年龄',
  'development_stage': '发育阶段',
  'breeding_history': '育种史',
  'biomaterial_provider': '材料提供者',
  'geographic_location': '地理位置',
  'treatment': '处理方式',
  'replicate': '生物学重复',
  'generation': '世代',
  'instrument': '测序平台',
  'strategy': '建库策略',
  'read_length': '读长',
  'source': '组学分类',
  'selection': '模版类型',
  'layout': '单/双端',
  'serial_number': '磁盘序列号'
}

const state = {
  newDiskDirInfo: [],
  newSortDirInfo: [],
  smartSortList: [],
  smartSort: [[]],
  searchConditions: [],
  sortOrder: [],
  tableName: ''
}

const actions = {
  sendNewSortInfo ({commit}, path) {
    sendMessage('', {path}).then(status => {
    })
  },

  // 将新添加的智能视图添加到智能视图列表中去
  // temp 包含着名称，限制条件(是一个对象数组)，选择条件 (选择条件是一个数组）
  addNewSmartSort ({commit}, temp) {
    // 这里应该返回一个true或者false
    sendMessage('setNewSmartSort', {temp}).then(data => {
      commit(types.ADD_SMART_SORT, temp, data)
    })
    // commit(types.ADD_SMART_SORT, temp)
  },

  // 获取智能视图列表显示在文件树上面
  showSmartSortList ({commit}) {
    // 这里返回的data应该是所有智能视图的名字的数组
    return new Promise((resolve, reject) => {
      sendMessage('showSmartSortList', {}).then(data => {
        resolve()
        commit(types.SHOW_SMART_SORT_LIST, data)
      })
    })
  },

  // 点击智能视图名称，将名称发送给后台，后台根据智能视图的名称发送具体的数据
  showSmartSort ({commit}, payload) {
    let tableName = payload.tableName
    let select = payload.select
    sendMessage('showSmartSort', {tableName, select}).then(data => {
      commit(types.SHOW_SMART_SORT, data)
    })
    // commit(types.SHOW_SMART_SORT)
  },
  getSearchConditions ({commit}) {
    return new Promise((resolve, reject) => {
      sendMessage('getSearchConditions', {}).then(data => {
        resolve()
        console.log(data)
        commit(types.GET_SEARCH_CONDITIONS, data)
      })
    })
    // commit(types.GET_SEARCH_CONDITIONS)
  }
}

const mutations = {
  // 新增磁盘文件夹信息
  [types.SET_NEW_DISK_DIR_INFO] (state, newDirInfo) {
    state.newDiskDirInfo.push(newDirInfo)
  },

  // 新增分类文件信息
  [types.SET_NEW_SORT_DIR_INFO] (state, newDirInfo) {
    state.newSortDirInfo.push(newDirInfo)
  },

  // 新增智能视图
  [types.ADD_SMART_SORT] (state, newSmartSort, response) {
    if (response === true) {
      state.smartSortList.push(newSmartSort.name)
      this.$alert('创建成功', {
        confirmButtonText: '确定'
      })
    } else {
      this.$alert('创建失败', {
        confirmButtonText: '确定'
      })
    }
  },

  // 在sidebar展示所有的智能视图
  [types.SHOW_SMART_SORT_LIST] (state, smartSortList) {
    state.smartSortList = smartSortList.allSmartView
    console.log(smartSortList.allSmartView)
  },

  [types.SHOW_SMART_SORT] (state, response) {
    // state.smartSort = object.smartSort
    let smartView = response.smartView
    state.smartSort.push(smartView.data)
    state.sortOrder = smartView.tabs
    state.tableName = smartView.table
    console.log(state.tableName)
    // console.log(object.smartSort)
    console.log(response)
    // console.log(state.smartSort)
  },
  // smartSort置空
  [types.SET_SMART_SORT] (state) {
    state.smartSort = [[]]
  },

  [types.GET_SEARCH_CONDITIONS] (state, response) {
    // let data = object.searchConditions
    let data = response.searchConditions
    console.log(response.searchConditions)
    // 对数据进行中英文映射处理
    for (let item in data) {
      // 选项条目名
      let options = ''
      let option = ''
      for (option in data[item]) {
        options = conditionMap[option]
      }
      let condition = {
        // 选项名
        label: options,
        // 原选项英文值
        name: option,
        // 原选项条目英文值
        value: data[item][option]
      }
      state.searchConditions.push(condition)
    }
  }
}

export default {
  state,
  actions,
  mutations
}
