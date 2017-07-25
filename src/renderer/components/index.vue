<template>
  <div id="index-root">
    <div class="sidebar-wrapper">
      <Sidebar></Sidebar>
    </div>
    <div class="content">
      <el-row>
        <el-col :span="16">
          <div class="content-wrapper">
            <ContentDetail></ContentDetail>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="file-wrapper">
            <FileInfo></FileInfo>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import Sidebar from './basicLayout/sidebar.vue'
  import ContentDetail from './basicLayout/content.vue'
  import FileInfo from './basicLayout/fileInfo.vue'

  // 导出
  export default {
    name: 'Index',
    components: {
      Sidebar,
      ContentDetail,
      FileInfo
    }
  }
</script>

<style lang="scss">
  $baseColor-1: #0294FF;
  $back-Color1: #404042;
  $back-Color2: #4E546C;
  $sideBarWidth: 14em;
  #index-root {
    height: 100%;
    .sidebar-wrapper,
    .content-wrapper,
    .file-wrapper,
    .content{
      height: 100%;
    }
    .sidebar-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      width: $sideBarWidth;
    }
    .content{
      margin-left: $sideBarWidth;
      top: 0;
    }
  }
</style>
