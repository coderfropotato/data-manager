<template>
    <div id="file-status-root">
        分类
        <el-tree :data="modifiedFiles" :expand-on-click-node="false" :render-content="renderContent"></el-tree>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import $ from 'jquery'

  export default {
    name: 'fileStatusContent',

    mounted () {
      this.insertFileIcon()
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
      }

//      // 选中高亮
//      /* eslint-disable */
//      renderContent (h) {
//        return (<span style="color: red"></span>)
//      }
    }
  }
</script>
