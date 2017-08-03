<template>
    <div id="file-status-root">
        所有变更
        <el-tree :data="modifiedFiles"
                 :expand-on-click-node="false"
                 :render-content="renderContent"
                 @node-click="handleNodeClick"
                 @check-change="handleCheckChange"
                 :default-expand-all="true"
                 :show-checkbox="true"
                 ref="tree"
                 node-key="path"
        ></el-tree>
    </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import $ from 'jquery'

  export default {
    name: 'fileStatusContent',

    // mounted时加载
    mounted () {
      this.getModifiedFiles()   // 获取修改文件
      this.insertFileIcon()     // 插入文件icon
    },

    computed: mapState({
      // 变更文件
      modifiedFiles: state => state.modified.modifiedFiles,

      // 变更文件树
      modifiedFilesTree: state => state.modified.modifiedFilesTree,

      // 当前选中的变更文件集合
      activeModifiedFilesSet: state => state.modified.activeModifiedFilesSet

    }),

    methods: {
      // 插入文件Icon
      insertFileIcon () {
        let Icon = '<svg class="icon" aria-hidden="true">\n' + '<use xlink:href="#icon-wenjian"></use>\n' + '</svg>'
        let downIcon = $('.el-tree-node__expand-icon')
        $(Icon).insertAfter(downIcon)
        $('.el-tree-node__content > .icon')
          .css('font-size', '1.2em')
          .css('margin-right', '0.5em')
          .css('vertical-align', '-0.25em')
      },

      // 映射Actions
      ...mapActions([
        'getModifiedFiles'  // 获取修改的文件
      ]),

      // 渲染状态标签
      renderContent (h, { node, data }) {
        // 带status节点
        if (data.status) {
          let color = null
          let tag = null

          // 判断status
          if (data.status === -1) {
            color = 'red'
            tag = '已删除'
          } else if (data.status === 0) {
            color = 'gray'
            tag = '已修改'
          } else if (data.status === 1) {
            color = 'green'
            tag = '已新增'
          }

          return h(
            'span',
            [
              h('span', node.label),
              h('el-tag',
                {style: {
                  backgroundColor: color
                }},
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
        // 是否可选中
        if (data.status) {
          let keys = data.path.split('/')
          let tempTree = this.modifiedFilesTree
          // 逐层进入
          for (let i = 1; i < keys.length; i++) {
            tempTree = tempTree[keys[i]]
          }
          // 结果
          console.log('ctime', tempTree['__info__']['ctime'])
          console.log('size', tempTree['__info__']['size'])
        }
      },

      // 处理选中节点
      handleCheckChange () {
        console.clear()
        this.activeModifiedFilesSet.clear()
        this.activeModifiedFilesSet.add(this.$refs.tree.getCheckedKeys())   // 获取选中的变更文件并添加至Set中
        for (let item of this.activeModifiedFilesSet.values()) {
          console.log(item)
        }
      }
    }
  }

</script>

<style lang="scss" scoped>

</style>
