<template>
  <div id="list-root">
    <el-table
        :data="tableData"
        highlight-current-row
        style="width: 100%" @row-click="showFileInfo">
      <el-table-column
          type="index"
          label="序号"
          width="80">
      </el-table-column>
      <el-table-column
          property="name"
          label="文件名">
      </el-table-column>
      <el-table-column
          property="createTime"
          label="创建时间">
      </el-table-column>
      <el-table-column
          property="size"
          label="文件大小">
      </el-table-column>
      <el-table-column
          label="操作">
        <template scope="scope">
          <el-button type="text">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {}
    },
    computed: mapState({
      tableData: state => state.files.currentFileList,
      currentPath: state => state.files.currentPath
    }),
    methods: {
      showFileInfo (row, event) {
        let path = this.currentPath + row.name

        // 获取文件的具体信息
        this.$store.dispatch({
          type: 'getFileInfo',
          path: path,
          volumeId: 1111
        })

        // 显示文件信息区
        this.$store.commit('showFileInfo')
      }
    }
  }
</script>

<style lang="scss" scoped>
  #list-root {
    .el-table__body-wrapper {
      overflow: hidden;
    }
  }
</style>
