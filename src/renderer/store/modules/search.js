/*
 * 文件状态功能
 */
import fetchData from '@/api'
import * as types from '@/store/mutation-types'

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
  'layout': '单/双端'
}

const state = {
  searchResults: [],
  searchConditions: [],
  searchPositions: []
}

const getters = {
  searchResults: state => state.searchResults,
  searchConditions: state => state.searchConditions,
  searchPositions: state => state.searchPositions
}

const actions = {
  // 获取搜索条件
  getSearchConditions ({commit}) {
    return new Promise((resolve, reject) => {
      fetchData('getSearchConditions').then(data => {
        resolve()
        commit('handleConditionMap', data)
      })
    })
  },
  // 获取搜索结果
  getSearchResult ({commit}, value) {
    // TODO 添加搜索范围
    return new Promise((resolve, reject) => {
      fetchData('searchContext', value).then((data) => {
        console.log(data)
      })
    })
  }
}

const mutations = {
  // 获取所有的修改文件并转换成合适的格式
  [types.SET_SEARCH_RANGE] (state, positions) {
    state.searchPositions = positions
  },

  // 处理后台返回的可供用户选择的搜索条件
  [types.HANDLE_SEARCH_CONDITION_MAP] (state, data) {
    // 对数据进行中英文映射处理
    for (let item in data) {
      // 选项条目名
      let options = []
      for (let option in data[item]) {
        options.push(conditionMap[option])
      }
      let condition = {
        // 选项名
        label: conditionMap[item],
        // 原选项英文值
        name: 'item',
        // 原选项条目英文值
        value: data[item],
        options
      }
      state.searchConditions.push(condition)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
