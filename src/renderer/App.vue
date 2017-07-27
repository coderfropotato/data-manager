<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import './api/database'
  export default {
    name: 'data-manager-desktop',
    data () {
      return {}
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style lang="scss">
  @import "./assets/SCSS/common";
</style>
