<template>
  <div id="index-root">
    <el-row>
      <el-col :span="6">
        <div class="sidebar-wrapper">
          <Sidebar></Sidebar>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="content-wrapper">
          <ContentDetail></ContentDetail>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="file-wrapper">
          <FileInfo></FileInfo>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Sidebar from './sidebar.vue'
  import ContentDetail from './content.vue'
  import FileInfo from './fileInfo.vue'

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
  #index-root{
    height: 100%;
    .sidebar-wrapper{
      height: 100%;
    }
  }
</style>
