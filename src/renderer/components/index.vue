<template>
  <div id="index-root">
    <Sidebar></Sidebar>
    <ContentDetail></ContentDetail>
    <FileInfo></FileInfo>
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
</style>
