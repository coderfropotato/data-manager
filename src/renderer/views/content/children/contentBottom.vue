<!--加载List或uploadFile组件-->
<template>
  <div id="contentBottom-root" v-loading="loading">
    <router-view></router-view>
  </div>
</template>
<script>
  import bus from '@/utils/bus'

  export default {
    data () {
      return {
        loading: false
      }
    },
    beforeMount () {
      bus.$on('loading-content', () => {
        this.loading = true
      })
      bus.$on('loading-end', () => {
        this.$nextTick(() => {
          this.loading = false
        })
      })
    }
  }
</script>
<style lang="scss">
  #contentBottom-root {
    height: 100%;
  }
</style>
