<template>
  <div id="fileStatus-root">
    <FileManager :has-new-button="false"
                 :hasBadge="true"
                 :badgeData="badgeData">
    </FileManager>
  </div>
</template>

<script>
  import FileManager from '@/components/fileManager'

  export default {
    name: 'fileStatusSidebar',
    data () {
      return {
        badgeData: {
          allFiles: 2,
          categoryFiles: 2,
          others: 3
        }
      }
    },
    components: {
      FileManager
    }
  }
</script>

<style>
</style>
