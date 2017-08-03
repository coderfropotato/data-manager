<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import './api/database'

  export default {
    name: 'data-manager-desktop',
    mounted () {
      // 应用加载后，发送获取文件树的请求，提前对文件树进行处理，优化加载速度
      this.$store.dispatch('openFile')

      // 禁用浏览器拖拽事件
      document.addEventListener('drop', e => {
        e.preventDefault()
      }, false)
      document.addEventListener('dragenter', e => {
        e.preventDefault()
      }, false)
      document.addEventListener('dragleave', e => {
        e.preventDefault()
      }, false)
      document.addEventListener('dragover', e => {
        e.preventDefault()
      }, false)
    }
  }
</script>

<style lang="scss">
  @import "./assets/SCSS/common";
</style>
