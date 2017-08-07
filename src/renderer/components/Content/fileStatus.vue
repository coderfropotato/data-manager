<template>
    <div id="file-status-root">
        <!--标题-->
        <div id="file-status-title">
            所有变更
        </div>
        <!--文件树-->
        <div id="file-status-tree">
            <el-tree :data="modifiedFiles"
                     :expand-on-click-node="false"
                     :render-content="renderContent"
                     @node-click="handleNodeClick"
                     @check-change="handleCheckChange"
                     :default-expand-all="true"
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
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'fileStatusContent',

    // mounted时加载
    mounted () {
      this.getModifiedFiles()  // 获取修改文件
      this.showFileInfo = false // 刚刚打开时不显示右侧文件信息
    },

    data () {
      return {
        // 是否显示commit
        showCommitOrIgnore: false,

        // 所有选中的文件或文件夹路径，此时已准备提交，有可能多于已打好标签的文件
        selectedModifiedFiles: []
      }
    },

    computed: mapState({
      // 变更文件
      modifiedFiles: state => state.modified.modifiedFiles,

      // 变更文件树
      modifiedFilesTree: state => state.modified.modifiedFilesTree,

      // 当前选中文件/文件夹的基本信息
      basicInfo: state => state.fileInfo.basicInfo,

      // 所有打好标记的文件
      taggedModifiedFiles: state => state.modified.taggedModifiedFiles

    }),

    watch: {
      // 观察所有打好标记的文件，若有新增或删除，重新渲染文件树的样式
      taggedModifiedFiles () {

      }
    },

    methods: {
      // 映射Actions
      ...mapActions([
        'getModifiedFiles',  // 获取修改的文件
        'getFileInfo', // 获取文件/文件夹信息
        'setNodeData', // 设置当前点击节点的数据
        'showModifiedFileInfo'  // 右侧显示修改文件的信息
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

        // 右侧展示文件信息
        this.showModifiedFileInfo()

        // 设置节点信息
        this.setNodeData(data)
      },

      // 处理选中节点
      handleCheckChange () {
        // 如果选中多个文件显示提交或忽略的按钮
        if (this.$refs.tree.getCheckedNodes().length > 0) {
          this.showCommitOrIgnore = true
        } else {    // 否则不显示按钮
          this.showCommitOrIgnore = false
        }
      },

      // 提交选中的修改文件
      commitSelectedFiles () {
        this.selectedModifiedFiles = this.$refs.tree.getCheckedKeys()
        // console.log(this.selectedModifiedFiles)
        let res = []
        for (let i in this.selectedModifiedFiles) {
          if (this.taggedModifiedFiles.get(this.selectedModifiedFiles[i])) {
            res.push(this.selectedModifiedFiles[i])
          }
        }
        console.log(res)
      },

      // 忽略选中的文件
      ignoreSelectedFiles () {

      }

    }
  }

</script>

<style lang="scss" scoped>

</style>
