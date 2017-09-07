// 点击具体的年份，获取当前年份下所有创建文件夹的作者
// import fetchData from '@/api'
import * as types from '@/store/mutation-types'
import authors from '@/api/data'
const state = {
  authors: []
}

const getters = {
  authors: state => state.authors
}

const actions = {
  getAuthors ({commit}) {
    // fetchData('getAuthors',{}).then(data => {
    //   commit(types.GET_AUTHORS,data)
    // })
    let data = authors
    console.log(data)
    commit(types.GET_AUTHORS, data)
  }
}

const mutations = {
  [types.GET_AUTHORS] (state, reponse) {
    state.authors = reponse
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
