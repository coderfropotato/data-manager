<!--划分三栏组件-->
<template>
  <div id='index-root'>
    <div class='sidebar-wrapper'>
      <Sidebar></Sidebar>
    </div>
    <div class="splitter-left"></div>
    <div class="right">
      <div class='content-wrapper'>
        <ContentDetail></ContentDetail>
      </div>
      <div class='splitter-right'></div>
      <div class='file-wrapper'>
        <FileAside></FileAside>
      </div>
    </div>
  </div>
</template>

<script>
  // 侧边栏导航组件
  import Sidebar from './Sidebar/sidebar'
  // 内容区组件
  import ContentDetail from './Content/content'
  // 文件详情区组件
  import FileAside from './FileAside/fileAside'
  import $ from 'jquery'
  // jQuery 插件，可拖拽改变 div 宽度
  import 'jquery-resizable-dom/src/jquery-resizable'

  export default {
    name: 'Index',
    data () {
      return {}
    },
    mounted () {
      // 挂载可变区域
      $('.sidebar-wrapper').resizable({
        handleSelector: '.splitter-left',
        resizeWidth: true,
        resizeHeight: false
      })
      $('.content-wrapper').resizable({
        handleSelector: '.splitter-right',
        resizeWidth: true,
        resizeHeight: false
      })
    },
    methods: {},
    components: {
      Sidebar,
      ContentDetail,
      FileAside
    }
  }
</script>

<style lang='scss' scoped>
  @import "../assets/SCSS/resizable";
</style>
