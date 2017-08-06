<template>
  <div class="newSortDir-root">
    <div class="tree">
      <el-tree
          :data="treeData"
          node-key="id"
          :expand-on-click-node="false"
          @node-click="addNewNode">
      </el-tree>
    </div>
  </div>
</template>
<script>
  import {ipcRenderer} from 'electron'
  export default {
    data () {
      return {
        treeData: []
      }
    },
    mounted () {
      ipcRenderer.on('send-data-to-newWin', (event, data) => {
        console.log(data)
        this.treeData = data
      })
    },
    methods: {
      addNewNode (nodeObj) {
        console.log(nodeObj)
      }
    }
  }
</script>
<style>
</style>
