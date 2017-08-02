<template>
  <div id="list-root">
    <div class="lists-display" v-if="status === 'Lists'">
      <div class="list-items">
        <div class="list-item" v-for="(item,index) in tableData" :key="index">
          <div class="file-name">
            {{item.name}}
          </div>
          <div class="create-time">
            {{item.createTime}}
          </div>
          <div class="size">
            {{item.size}}
          </div>
          <div class="edit">
            <el-button type="text">
              编辑
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="columns-display" v-if="status === 'Columns'">
      <el-table :data="tableData"
                highlight-current-row
                style="width: 100%"
                @row-click="showFileInfo">
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
    <div class="grid-display" v-if="status === 'Grid'">
      <div class="grid-items">
        <el-row :gutter="20">
          <el-col :span="8" v-for="(item,index) in tableData" :key="index">
            <!--TODO：添加编辑按钮-->
            <div class="grid-item">
              <el-card>
                <div class="card-inner">
                  <div class="file-name">
                    {{item.name}}
                  </div>
                  <div class="create-time">
                    {{item.createTime}}
                  </div>
                  <div class="size">
                    {{item.size}}
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
      }
    },
    computed: mapState({
      tableData: state => state.files.currentFileList,
      currentPath: state => state.files.currentPath,
      status: state => state.showControl.listDisplayStatus
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
  .lists-display{
    .list-item{
      position: relative;
      width: 100%;
      height: 4em;
      padding: 0 2em;
      overflow: hidden;
      .file-name{
        font-size: 1.1em;
        font-weight: 500;
        margin: 0.25em 0;
      }
      .create-time,
      .size{
        display: inline-block;
        margin-right: 1em;
      }
      .edit{
        position: absolute;
        top: 1em;
        vertical-align: -0.5em;
        right: 2em;
      }
    }
    .list-item:nth-child(even){
      background-color: #eef1f6;
    }
  }

  .grid-display{
    .grid-item{
      margin: 1em;
      .file-name{
        font-size: 1.1em;
        font-weight: 500;
        height: 2em;
      }
      .create-time,
      .size{
        margin: 1em 0;
      }
    }
  }

  .el-card{
    .card-inner{
      margin: 1em;
    }
  }
</style>
