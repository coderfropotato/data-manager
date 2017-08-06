/*
 * 文件状态功能
 */
import sendMessage from '@/api'
import * as types from '@/store/mutation-types'
import packUpModified from '@/assets/JS/convertJSON'
import {ipcRenderer} from 'electron'

const state = {
  modifiedFiles: [],  // 最近变更的文件，供Element-UI渲染

  modifiedFilesTree: {},  // 最近变更文件树，供遍历路径

  showFileInfo: false,  // 是否展示右边侧栏的文件信息

  taggedModifiedFiles: new Map(),  // 所有已标记好的变更文件

  selectedModifiedFiles: [], // 所有选中的文件或文件夹，此时已准备提交，一般是上一个属性的子集

  modifiedNum: 0, // 变更文件的数目

  activeModifiedFile: {} // 当前正在进行编辑的文件及其信息
}

const actions = {
  // 获取变更文件
  getModifiedFiles ({commit}) {
    // 获取更改文件后返回
    return new Promise((resolve, reject) => {
      sendMessage('getModifiedFiles', {}).then((data) => {
        if (data.isModified) {
          resolve(true)
          commit(types.RECEIVE_MODIFIED_FILES, data.tree)
        } else {
          // 获取更改信息完成，通知执行 then
          resolve(false)
        }
      })
    })
  },

  // 右侧展示修改文件的信息
  showModifiedFileInfo ({ commit }) {
    commit(types.SHOW_MODIFIED_FILE_INFO)
  },

  // 增加了一个修改好属性的文件
  addTaggedModifiedFile ({ commit }, payload) {
    commit(types.ADD_TAGGED_MODIFIED_FILE, payload)
  }
}

const mutations = {
  // 获取所有的修改文件并转换成合适的格式
  [types.RECEIVE_MODIFIED_FILES] (state, files) {
    state.modifiedFilesTree = files
    let result = packUpModified(files)
    state.modifiedFiles = result.res
    state.modifiedNum = result.count
  },

  // 右侧展示修改文件的信息
  [types.SHOW_MODIFIED_FILE_INFO] (state) {
    state.showFileInfo = true
  },

  // 增加了一个修改好属性的文件
  [types.ADD_TAGGED_MODIFIED_FILE] (state, payload) {
    state.taggedModifiedFiles.set(payload.path, payload.newAttributes)
  }
}

export default {
  state,
  actions,
  mutations
}
