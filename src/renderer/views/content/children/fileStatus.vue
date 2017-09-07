<template>
  <div id="file-status-root">
    <!--标题-->
    <div id="file-status-title">
      <h1>所有变更</h1>
    </div>
    <!--文件树-->
    <div id="file-status-tree">
      <el-tree
          :data="modifiedFiles"
          :expand-on-click-node="false"
          :render-content="renderContent"
          @node-click="handleNodeClick"
          @check-change="handleCheckChange"
          :default-expand-all="false"
          :show-checkbox="true"
          ref="tree"
          node-key="path"
          :highlight-current="true"
      ></el-tree>
    </div>
    <!--提交按钮-->
    <div id="file-status-commit">
            <span id="commit-buttons" v-if="showCommitOrIgnore">
                <el-button type="primary" size="small" @click="commitSelectedFiles">提交选中的文件</el-button>
                <el-button size="small" @click="ignoreSelectedFiles">忽略选中的文件</el-button>
            </span>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: 'fileStatusContent',

    // mounted时加载
    mounted () {
      this.getModifiedFiles()  // 获取修改文件
      this.toggleShowFileStatusAside(false) // 刚刚打开时不显示右侧文件信息
      this.setNodeData(null)    // 设置NodeData为空
    },

    data () {
      return {
        // 中间栏是否显示commit/ignore按钮
        showCommitOrIgnore: false
      }
    },

    computed: mapGetters([
//      // 所有中间栏选中的文件/文件夹
//      selectedModifiedFiles: state => state.modified.selectedModifiedFiles,

      // 变更文件
      'modifiedFiles',

      // 变更文件树
      // modifiedFilesTree: state => state.modified.modifiedFilesTree,

      // 所有打好标记的文件
      'taggedModifiedFiles'

    ]),

    methods: {
      // 映射Actions
      ...mapActions([
        'ignoreFiles',  // 忽略文件
        'updateFileInfo', // 给后端发消息，请求更新文件信息
        'setSelectedFilesNum', // 设置选中的文件数目
        'toggleShowFileStatusAside',  // 切换展示右侧文件信息边栏
        'getModifiedFiles',  // 获取修改的文件
        'getFileInfo', // 获取文件/文件夹信息
        'setNodeData', // 设置当前点击节点的数据
        'showModifiedFileInfo',  // 右侧显示修改文件的信息
        'setShowMode'   // 设置右侧显示模式
      ]),

      // 渲染状态标签
      renderContent (h, {node, data}) {
        // 带status节点
        if (data.status != null) {
          let color = null
          let tag = null

          // 判断status
          if (data.status === -1) {
            color = 'red'
            tag = '最近删除'
          } else if (data.status === 0) {
            color = 'gray'
            tag = '最近修改'
          } else if (data.status === 1) {
            color = 'green'
            tag = '最近新增'
          } else if (data.status.indexOf('tagged') !== -1) {
            color = 'orange'
            tag = '已打标签'
          }

          return h(
            'span',
            [
              h('span', node.label),
              h('el-tag',
                {
                  style: {
                    backgroundColor: color
                  }
                },
                tag)
            ]
          )
        } else {
          // 不带status节点
          return h(
            'span',
            [
              h('span', node.label)
            ]
          )
        }
      },

      // 处理点击节点事件
      handleNodeClick (data) {
        // 如果点击了磁盘，不显示任何信息
        if (data.serialNumber) {
          return 0
        }

        // 设置成显示模式
        this.setShowMode(true)

        // 获取该节点的基本信息
        let serialNumber = data.path.split('/')[0]
        let path = data.path.split(serialNumber)[1]

        let status
        if (data.status) {
          status = data.status > 0 ? 0 : 1    // 新增文件传status=0，删除修改传status=1
        } else {
          status = 1  // 点选没有修改信息的文件夹传status=1
        }

        // 生成payload
        let payload = {serialNumber: serialNumber, path: path, status: status}

        // 发送请求
        this.getFileInfo(payload)

        // 设置节点信息
        this.setNodeData(data)

        // 右侧展示文件信息
        this.toggleShowFileStatusAside(true)
      },

      // 处理选中节点
      handleCheckChange () {
        // 获取中间选中的文件
        this.setSelectedFilesNum(this.$refs.tree.getCheckedKeys().length)
//        this.selectedModifiedFiles = this.$refs.tree.getCheckedKeys()
//        console.log(this.selectedModifiedFiles.length)

        // 如果选中多个文件显示提交或忽略的按钮
        if (this.$refs.tree.getCheckedNodes().length > 0) {
          this.showCommitOrIgnore = true
          // 设置成选择模式
          this.setShowMode(false)
          this.toggleShowFileStatusAside(true)
        } else {    // 否则不显示按钮
          this.showCommitOrIgnore = false
          // 设置成选择模式
          this.toggleShowFileStatusAside(false)
        }
      },

      // 提交选中的修改文件
      commitSelectedFiles () {
        let selectedModifiedFiles = this.$refs.tree.getCheckedKeys()
        let res = []
        for (let i in selectedModifiedFiles) {
          if (this.taggedModifiedFiles.get(selectedModifiedFiles[i])) {
            res.push({path: selectedModifiedFiles[i], update: this.taggedModifiedFiles.get(selectedModifiedFiles[i])})
          }
        }
        console.log('可以提交', res)
        this.updateFileInfo(res)
      },

      // 忽略选中的文件
      ignoreSelectedFiles () {
        this.ignoreFiles(this.$refs.tree.getCheckedKeys())
      }
    }
  }

</script>

<style lang="scss">
  #file-status-root {
    height: 100%;
    -webkit-overflow-y: overlay;
    overflow-x: hidden;
  }
</style>
