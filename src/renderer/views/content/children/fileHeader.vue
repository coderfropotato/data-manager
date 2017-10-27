<template>
  <div id="fileHeader-root">
    file header
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    name: 'fileHeader',
    data () {
      return {
        searchValue: ''
      }
    },
    mounted () {
    },
  }
</script>
<style lang="scss">
#fileHeader-root {
  #scrollBar {
    position: relative;
    overflow: hidden;
    margin-right: 1em;
    .scrollBar-inner {
      position: relative;
    }
  }
}
</style>
