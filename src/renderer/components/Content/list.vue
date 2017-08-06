<template>
  <div id="list-root">
    <div class="lists-display" v-if="status === 'Lists'">
      <div class="list-items">
        <div class="list-item" v-for="(item,index) in filesData" :key="index" @click="showFileInfo(item)">
          <div class="file-name">
            <el-tooltip :content="item.rowName" placement="right-start">
              <span>{{item.filename}}</span>
            </el-tooltip>
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
      <el-table :data="filesData"
                highlight-current-row
                style="width: 100%;"
                @row-click="showFileInfo">
        <el-table-column
            type="index"
            label="序号"
            width="100"
            sortable>
        </el-table-column>
        <el-table-column
            property="filename"
            label="文件名"
            sortable>
        </el-table-column>
        <el-table-column
            property="ctime"
            label="创建时间"
            sortable>
        </el-table-column>
        <el-table-column
            property="size"
            label="文件大小"
            sortable>
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
          <el-col :span="6" v-for="(item,index) in filesData" :key="index">
            <!--TODO：添加编辑按钮-->
            <div class="grid-item"  @click="showFileInfo(item)">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-file"></use>
              </svg>
              <div class="file-name">
                <el-tooltip :content="item.rowName" placement="top">
                  <span>{{item.filename}}</span>
                </el-tooltip>
              </div>
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
  import formatFileData from '@/assets/JS/formatFileData'

  export default {
    data () {
      return {
        // 记录拖入与拖出的次数
        count: 0
      }
    },
    computed: mapState({
      // 对列表数据进行处理
      filesData: state => {
        // 原始文件信息数据，文件名最大长度
        return formatFileData(state.files.currentFileList, 10)
      },
      // 当前路径， 导航面包屑
      currentPath: state => state.files.currentPath,
      // 文件展示状态 list/column/grid
      status: state => state.showControl.listDisplayStatus,
      // 是否显示拖拽导入文件提示
      dragFiles: state => state.showControl.dragShow
    }),
    mounted () {
      // 监听列表区拖拽，有拖入则显示导入提示，拖出则隐藏提示
      let list = document.getElementById('list-root')
      list.addEventListener('dragenter', e => {
        // drag-zone 也有监听拖拽事件，同时监听父子元素会导致拖出事件频繁触发，造成闪烁
        this.count++
        e.preventDefault()
        if (this.count > 0) {
          this.$store.commit('toggleDragShow', true)
        }
      }, false)
      list.addEventListener('dragleave', e => {
        console.log('leave')
        e.preventDefault()
        this.count--
        if (this.count <= 0) {
          this.$store.commit('toggleDragShow', false)
        }
      }, false)

      // 监听拖拽，对导入的文件进行处理
      this.dragEvent()
    },
    methods: {
      showFileInfo (file) {
        // 获取文件的具体信息
        this.$store.dispatch({
          type: 'getFileInfo',
          path: file.path,
          serialNumber: file.serialNumber
        })
        // 显示文件信息区
        this.$store.commit('showFileInfo')
      },

      // 处理导入文件夹操作
      dropHandler (e) {
        e.stopPropagation()
        e.preventDefault()
        let importDirectory = e.dataTransfer.files
        let fileCount = 0
        // 计算文件的个数， Chrome only
        if (e.dataTransfer.items && e.dataTransfer.items.length) {
          for (let item of e.dataTransfer.items) {
            let entry = item.webkitGetAsEntry()
            if (entry && entry.isFile) {
              fileCount++
              break
            }
          }
        }
        // fileCount 大于 0，则含有文件，报错，否则传递数据，进行重定向
        if (fileCount) {
          // 不能导入文件
          this.$message({
            message: '不能导入文件',
            type: 'error',
            showClose: true,
            duration: 4000
          })
          this.$store.commit('toggleDragShow', false)
        } else {
          // 将文件夹加入到状态管理中的记录导入文件夹的数组
          this.$store.commit('addImportFiles', importDirectory)
          // 重定向到导入文件页面
          // 设置拖拽区域隐藏
          this.$store.commit('toggleDragShow', false)
          this.$router.push('/files/importfile')
        }
        // 放下后，缺少拖出的计数，需重置为 0， 防止下次无法隐藏
        this.count = 0
      },

      // 拖拽事件监听
      dragEvent () {
        let dragZone = document.querySelector('.drag-zone')
        dragZone.addEventListener('dragover', function (e) {
          e.preventDefault()
          e.stopPropagation()
          e.dataTransfer.dragEffect = 'copy'
        }, false)
        dragZone.addEventListener('drop', this.dropHandler, false)
      }
    }
  }
</script>

<style lang="scss">
  #list-root {
    min-height: 400px;
    position: relative;
    .el-table__body-wrapper {
      overflow: hidden;
    }
    .drag-zone {
      .drag-inner {
        position: absolute;
        z-index: 100;
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
      cursor: pointer;
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
      text-align: center;
      margin: 1em;
      .icon {
        font-size: 3em;
      }
      .file-name {
        font-size: 0.8em;
        margin: 1em;
      }
    }
  }
</style>
