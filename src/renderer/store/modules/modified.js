/*
 * 文件状态功能
 */
import fetchData from '@/api'
import * as types from '@/store/mutation-types'
import packUpModified from '@/utils/convertJSON'
import { Message } from 'element-ui'

// 给node底下的所有子节点都打上标签
// isDir=true时，只能更改来源属性，不能重置其他属性,isDir=false时，直接赋值即可
function tagYouAll (state, node, newAttributes, onlySourceInfo) {
  // console.log(node)
  if (node.hasOwnProperty('status')) {
    // 更新展示状态
    node.status = node.status + '*' + 'tagged'

    // 更新数据状态
    if (node.isDir) { // 如果被打标签的是文件夹
      if (!onlySourceInfo) {  // 怎么可能传过来文件信息呢，are you 弄啥嘞
        console.log('exo me????')
      } else {  // 用户给上层文件夹打标签，下层文件夹要接收到信息，此时直接赋值即可
        state.taggedModifiedFiles.set(node.path, JSON.parse(JSON.stringify(newAttributes)))
      }
    } else {  // 如果被打标签的是文件
      if (!onlySourceInfo) {  // 而且传过来的信息是文件的信息，就直接赋值
        state.taggedModifiedFiles.set(node.path, JSON.parse(JSON.stringify(newAttributes)))
      } else {  // 用户给上层文件夹赋值，下层文件要接收到，还要保留原来的数据
        let oldAttributes = state.taggedModifiedFiles.get(node.path)
        if (oldAttributes) { // 如果taggedModifiedFiles已经有信息了
          if (Object.keys(oldAttributes.fileattr).length > 0) { // 如果该文件原来已经有详细属性
            oldAttributes.source = newAttributes.source // 只更新source属性
          } else {  // 若原来文件没有属性，此时在上层的SourceInfo基础上，还要补上fileattr
            let source = oldAttributes.source
            let fileattr = {}
            state.taggedModifiedFiles.set(node.path, JSON.parse(JSON.stringify({source: source, fileattr: fileattr})))
          }
        } else {  // 如果如果taggedModifiedFiles还没有信息
          let source = newAttributes.source
          let fileattr = {}
          state.taggedModifiedFiles.set(node.path, JSON.parse(JSON.stringify({source: source, fileattr: fileattr})))
        }
      }
    }
  }
  if (node.hasOwnProperty('children')) {
    for (let childNode in node.children) {
      tagYouAll(state, node.children[childNode], newAttributes, onlySourceInfo)
    }
  }
}

// 给node底下的所有子节点都去掉标签
function removeYouAll (state, node) {
  if (node.hasOwnProperty('status')) {
    node.status = parseInt(node.status.split('*')[0])
    console.log(node)
    state.taggedModifiedFiles.delete(node.path)
  }
  if (node.hasOwnProperty('children')) {
    for (let childNode in node.children) {
      removeYouAll(state, node.children[childNode])
    }
  }
}

const state = {
  modifiedFiles: [],  // 最近变更的文件，供Element-UI渲染

  modifiedFilesTree: {},  // 最近变更文件树，供遍历路径

  showFileStatusAside: false,  // 是否展示右边侧栏的文件信息

  taggedModifiedFiles: new Map(),  // 所有已标记好的变更文件

  modifiedNum: 0, // 变更文件的数目

  nodeData: {}, // 当前选中节点的信息，以便打标签

  selectedModifiedFiles: [],    // 所有选中的文件或文件夹路径，此时已准备提交，有可能多于已打好标签的文件

  selectedFilesNum: 0, // 选中的文件/文件夹的数目

  showMode: '', // 是否是展示文件信息，true时展示文件/文件夹属性，false展示选中了多少文件等属性

  activeModifiedFile: '' // 当前正在进行编辑的文件路径
}

const getters = {
  modifiedFiles: state => state.modifiedFiles,
  modifiedFilesTree: state => state.modifiedFilesTree,
  showFileStatusAside: state => state.showFileStatusAside,
  taggedModifiedFiles: state => state.taggedModifiedFiles,
  modifiedNum: state => state.modifiedNum,
  nodeData: state => state.nodeData,
  selectedModifiedFiles: state => state.selectedModifiedFiles,
  selectedFilesNum: state => state.selectedFilesNum,
  showMode: state => state.showMode,
  activeModifiedFile: state => state.activeModifiedFile
}

const actions = {
  // 更新文件信息
  updateFileInfo ({commit, dispatch}, updateList) {
    console.log('sending.......', updateList)
    fetchData('updateAttribute', {updateList: updateList}).then(data => {
      // 提示用户
      if (data.info === 'success') {
        Message({
          message: '成功',
          type: 'success'
        })
        // 更新文件状态
        // getModifiedFiles()
        dispatch('getModifiedFiles')
      } else {
        Message({
          message: '请重试',
          type: 'warning'
        })
      }
    })
  },

  // 获取变更文件
  getModifiedFiles ({commit}) {
    // 获取更改文件后返回
    return new Promise((resolve, reject) => {
      fetchData('getModifiedFiles', {}).then((data) => {
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
  toggleShowFileStatusAside ({commit}, status) {
    commit(types.SHOW_MODIFIED_FILE_INFO, status)
  },

  // 增加了一个修改好属性的文件
  addTaggedModifiedFile ({commit}, payload) {
    commit(types.ADD_TAGGED_MODIFIED_FILE, payload)
  },

  // 删除某个打好标签的文件/文件夹
  removeTaggedFile ({ commit }, path) {
    commit(types.REMOVE_TAGGED_FILE, path)
  },

  // 设置当前节点的数据
  setNodeData ({commit}, nodeData) {
    commit(types.SET_NODE_DATA, nodeData)
  },

  // 设置右侧显示模式
  setShowMode ({commit}, status) {
    commit(types.SET_SHOW_MODE, status)
  },

  //
  setSelectedFilesNum ({commit}, num) {
    commit(types.SET_SELECTED_FILES_NUM, num)
  },

  // 忽略这些文件/文件夹
  ignoreFiles ({commit, dispatch}, files) {
    fetchData('ignoreFiles', {paths: files}).then(data => {
      // 提示用户
      if (data.info === 'success') {
        Message({
          message: '成功忽略',
          type: 'success'
        })
        // 更新文件状态
        dispatch('getModifiedFiles')
      } else {
        Message({
          message: '请重试',
          type: 'warning'
        })
      }
    })
  },

  // 更新当前节点的数据
  renewNodeData ({commit}, payload) {
    commit(types.RENEW_NODE_DATA, payload)
  }
}

const mutations = {
  // 获取所有的修改文件并转换成合适的格式
  [types.RECEIVE_MODIFIED_FILES] (state, files) {
    // console.log(files)
    state.modifiedFilesTree = files
    let result = packUpModified(files)
    state.modifiedFiles = result.res
    state.modifiedNum = result.count
  },

  // 切换右侧是否展示修改文件的信息
  [types.SHOW_MODIFIED_FILE_INFO] (state, status) {
    state.showFileStatusAside = status
  },

  // 增加了一个修改好属性的文件
  [types.ADD_TAGGED_MODIFIED_FILE] (state, payload) {
    state.taggedModifiedFiles.set(payload.path, payload.newAttributes)
  },

  // 设置当前节点的数据
  [types.SET_NODE_DATA] (state, nodeData) {
    state.nodeData = nodeData
  },

  // 更新当前节点及子节点数据
  [types.RENEW_NODE_DATA] (state, payload) {
    let newAttributes = payload.newAttributes
    let onlySourceInfo = payload.onlySourceInfo
    // 打标签啊打标签
    tagYouAll(state, state.nodeData, newAttributes, onlySourceInfo)
  },

  [types.SET_SHOW_MODE] (state, status) {
    state.showMode = status
  },

  [types.SET_SELECTED_FILES_NUM] (state, num) {
    state.selectedFilesNum = num
  },

  // 放弃修改某个打好标签的文件夹/文件的新属性
  removeTaggedFile (state, path) {
    removeYouAll(state, state.nodeData)
    // console.log(state.taggedModifiedFiles)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
