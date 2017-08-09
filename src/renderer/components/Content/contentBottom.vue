<!--加载List或uploadFile组件-->
<template>
  <div id="contentBottom-root" v-loading="loading">
    <router-view></router-view>
  </div>
</template>
<script>
  import bus from '@/assets/JS/bus'

  export default {
    data () {
      return {
        loading: false
      }
    },
    beforeMount () {
      bus.$on('loading-content', () => {
        console.log('loading')
        this.loading = true
      })
      bus.$on('loading-end', () => {
        console.log('loading-end')
        this.loading = false
      })
    }
  }
</script>
<style lang="scss">
  #contentBottom-root {
    height: 100%;
  }
</style>
