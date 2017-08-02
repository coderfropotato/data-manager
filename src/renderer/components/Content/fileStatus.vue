<template>
    <div id="file-status-root">
        所有变更
        <el-tree :data="modifiedFiles" :expand-on-click-node="false"></el-tree>
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
      ])

//      // 选中高亮
//      /* eslint-disable */
//      renderContent (h) {
//        return (<span style="color: red"></span>)
//      }
    }
  }
</script>
