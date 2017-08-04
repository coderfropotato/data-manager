<template>
  <div id="uploadFile-root">
    <div class="drag-zone">
      <div class="drag-inner">
        <i class="el-icon-upload"></i>
        <div class="text">
          将文件拖到此处，或
          <el-button type="text">点击上传</el-button>
        </div>
      </div>
    </div>
    <div class="file-info">
      <div class="file-items">
        <div class="file-item">
          <template>
            <el-table
                :data="importFiles"
                style="width: 98%"
                stripe>
              <el-table-column
                  prop="name"
                  label="文件名"
                  width="180">
              </el-table-column>
              <el-table-column
                  prop="type"
                  label="类型"
                  width="180">
              </el-table-column>
              <el-table-column
                  prop="size"
                  label="大小">
              </el-table-column>
              <el-table-column
                  prop="lastModified"
                  label="最后更改时间">
              </el-table-column>
            </el-table>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        // 不能使用计算属性，无法自动响应
        importFiles: []
      }
    },
    mounted () {
      // 遍历Map，获取文件列表
      this.getImportFileList()
      this.dragEvent()
    },
    methods: {
      // 对时间进行格式化处理
      formatDate (date) {
        let d = new Date(date)
        let month = '' + (d.getMonth() + 1)
        let day = '' + d.getDate()
        let year = d.getFullYear()
        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day
        return [year, month, day].join('/')
      },
      dropHandler (e) {
        e.stopPropagation()
        e.preventDefault()
        // 每一次导入都是一个 fileList
        let fileList = e.dataTransfer.files
        // 将文件加入到状态管理中的记录导入文件的数组
        this.$store.commit('addImportFiles', fileList)
        // 遍历Map，获取文件列表
        this.getImportFileList()
        console.log(this.importFiles)
      },
      dragEvent () {
        let dragZone = document.querySelector('.drag-zone')
        dragZone.addEventListener('dragover', function (e) {
          e.preventDefault()
          e.stopPropagation()
        }, false)
        dragZone.addEventListener('drop', this.dropHandler, false)
      },
      // 遍历Map，获取文件数组，防止导入重复的文件
      getImportFileList () {
        let fileList = []
        let files = this.$store.state.files.importFiles
        for (let file of files.values()) {
          let tempObj = {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: this.formatDate(file.lastModified)
          }
          fileList.push(tempObj)
        }
        this.importFiles = fileList
      }
    }
  }
</script>
<style lang="scss" scoped>
  #uploadFile-root {
    position: relative;
  }

  .drag-zone {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 98%;
    height: 300px;
    background-color: rgba(202, 202, 202, 0.2);
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    margin: 8px auto;
    text-align: center;
    .el-icon-upload {
      margin: 0.5em 0;
      font-size: 4em;
      color: #97a8be;
    }
    .text {
      font-size: 1.1em;
      .el-button {
        color: #20a0ff;
        font-size: 0.95em;
      }
    }
  }

  .file-info {
    width: 98%;
    margin: 2em auto;
    .file-item {
      margin: 1em 0;
    }
  }
</style>
