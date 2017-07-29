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
        <FileInfo></FileInfo>
      </div>
    </div>
  </div>
</template>

<script>
  import Sidebar from './Sidebar/sidebar'
  import ContentDetail from './Content/content'
  import FileInfo from './FileInfo/fileInfo'
  import $ from 'jquery'
  import 'jquery-resizable-dom/src/jquery-resizable'

  export default {
    name: 'Index',
    data () {
      return {}
    },
    mounted () {
      this.$router.push('index')
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
      FileInfo
    }
  }
</script>

<style lang='scss' scoped>
  $baseColor-1: #0294FF;
  $back-Color1: #404042;
  $back-Color2: #4E546C;
  $sideBarWidth: 14em;
  @import "../assets/SCSS/resizable";
</style>
