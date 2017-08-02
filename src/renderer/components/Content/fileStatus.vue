<template>
    <div id="file-status-root">
        所有变更
        <el-tree :data="modifiedFiles" :expand-on-click-node="false" :render-content="renderContent" @node-click="handleNodeClick"></el-tree>
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
      // console.log(this.modifiedFiles)
    },

    computed: mapState({
      // 分类文件夹树
      modifiedFiles: state => state.modified.modifiedFiles

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
        if (data.status) {
          let color = null
          let tag = null

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
        if (data.status) {
          console.log(data.path)
        }
      }
    }
  }

</script>

<style lang="scss" scoped>
/*.red-tag {*/
    /*background-color: red;*/
/*}*/

/*.gray-tag {*/
    /*background-color: gray;*/
/*}*/

/*.grenn-tag {*/
    /*background-color: green;*/
/*}*/
</style>
