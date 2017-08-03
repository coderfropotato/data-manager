<template>
  <div id="list-root">
    <div class="lists-display" v-if="status === 'Lists'">
      <div class="list-items">
        <div class="list-item" v-for="(item,index) in tableData" :key="index">
          <div class="file-name">
            {{item.name}}
          </div>
          <div class="create-time">
            {{item.ctime}}
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
            property="ctime"
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
                    {{item.ctime}}
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
    <div class="drag-zone">
      <div class="drag-inner" v-if="dragFiles">
        <span>导入文件</span>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'

  export default {
    data () {
      return {}
    },
    mounted () {
      let count = 0
      let list = document.getElementById('list-root')
      list.addEventListener('dragenter', e => {
        count++
        e.preventDefault()
        if (count === 1) {
          this.$store.commit('toggleDragShow', true)
        }
      }, false)
      list.addEventListener('dragleave', e => {
        e.preventDefault()
        count--
        if (count === 0) {
          this.$store.commit('toggleDragShow', false)
        }
      }, false)

      // 监听拖拽文件
      this.dragEvent()
    },
    computed: mapState({
      tableData: state => {
        let rowListData = state.files.currentFileList
        let tableData = []
        // TODO 待检验
        for (let item in rowListData) {
          tableData.push(Object.assign(rowListData[item].basic, rowListData[item].path))
        }
        return tableData
      },
      currentPath: state => state.files.currentPath,
      status: state => state.showControl.listDisplayStatus,
      dragFiles: state => state.showControl.dragShow
    }),
    methods: {
      showFileInfo (row, event) {
        // 获取文件的具体信息
        // 待检验
        let path = row.path
        this.$store.dispatch({
          type: 'getFileInfo',
          path: path,
          serialNumber: 1111
        })

        // 显示文件信息区
        this.$store.commit('showFileInfo')
      },
      dropHandler (e) {
        e.stopPropagation()
        e.preventDefault()
        let file = e.dataTransfer.files
        // 将文件加入到状态管理中的记录导入文件的数组
        this.$store.commit('addImportFiles', file)
        // 设置拖拽区域隐藏
        this.$store.commit('toggleDragShow', false)
        // 重定向到导入文件页面
        this.$router.push('/files/uploadfile')
      },
      dragEvent () {
        let dragZone = document.querySelector('.drag-zone')
        dragZone.addEventListener('dragover', function (e) {
          e.preventDefault()
          e.stopPropagation()
        }, false)
        dragZone.addEventListener('drop', this.dropHandler, false)
      }
    }
  }
</script>

<style lang="scss" scoped>
  #list-root {
    position: relative;
    .el-table__body-wrapper {
      overflow: hidden;
    }
  }

  .el-upload-dragger {
    .el-icon-plus {
      vertical-align: middle;
      text-align: center;
      font-size: 48px;
    }
  }

  .lists-display {
    .list-item {
      position: relative;
      width: 100%;
      height: 4em;
      padding: 0 2em;
      overflow: hidden;
      .file-name {
        font-size: 1.1em;
        font-weight: 500;
        margin: 0.25em 0;
      }
      .create-time,
      .size {
        display: inline-block;
        margin-right: 1em;
      }
      .edit {
        position: absolute;
        top: 1em;
        vertical-align: -0.5em;
        right: 2em;
      }
    }
    .list-item:nth-child(even) {
      background-color: #eef1f6;
    }
  }

  .grid-display {
    .grid-item {
      margin: 1em;
      .file-name {
        font-size: 1.1em;
        font-weight: 500;
        height: 2em;
      }
      .create-time,
      .size {
        margin: 1em 0;
      }
    }
  }

  .el-card {
    .card-inner {
      margin: 1em;
    }
  }

  .drag-zone {
    .drag-inner {
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      font-size: 2em;
      font-weight: 600;
      text-align: center;
      color: #edf7ff;
      background-color: rgba(1, 1, 1, 0.5);
    }

  }
</style>
