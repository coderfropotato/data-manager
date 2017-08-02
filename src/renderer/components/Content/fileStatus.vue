<template>
    <div id="file-status-root">
        所有变更
        <el-tree :data="modifiedFiles" :expand-on-click-node="false" :render-content="renderContent"></el-tree>
        <!--<el-tree :data="modi    fiedFiles" :expand-on-click-node="false"></el-tree>-->
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
      /* eslint-disable */
      renderContent (h, { node, data}) {
        if (data.status === -1) {
          return(
            <span>
            <span>{node.label}</span>
            <span><el-tag type="danger">已删除</el-tag></span>
            </span>
        )
        } else if (data.status === 0) {
          return(
            <span>
            <span>{node.label}</span>
            <el-tag type="grey">已修改</el-tag>
            </span>
        )
        } else if (data.status === 1) {
          return(
            <span>
            <span>{node.label}</span>
            <el-tag type="success">已新增</el-tag>
            </span>
        )
        } else {
          return(
            <span>
            <span>{node.label}</span>
            </span>
        )
        }
      }
    }
  }

</script>
