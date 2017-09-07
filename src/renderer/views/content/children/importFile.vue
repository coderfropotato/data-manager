<template>
  <div id="uploadFile-root">
    <div class="drag-zone">
      <div class="drag-inner">
        <i class="el-icon-upload"></i>
        <div class="text">
          将<b>文件夹</b>拖到此处，或
          <el-button type="text" @click="handleImport">点击上传</el-button>
        </div>
      </div>
    </div>
    <div class="file-info">
      <div class="title">
        <span>导入文件夹列表</span>
        <el-button small type="text" @click="confirmImportFiles">确认导入</el-button>
      </div>
      <div class="file-items">
        <template>
          <el-table
              :data="importFiles"
              stripe
              style="width: 100%;"
              fit
              max-height="350">
            <el-table-column
                type="index"
                label="序号" width="80">
            </el-table-column>
            <el-table-column
                prop="name"
                label="文件夹名称"
                sortable>
            </el-table-column>
            <el-table-column
                prop="lastModified"
                label="最后更改时间"
                width="160"
                sortable>
            </el-table-column>
            <el-table-column
                label="操作"
                width="100">
              <template scope="scope">
                <el-button
                    type="text"
                    size="small"
                    @click="handleDeleteFile(scope.$index, scope.row)"
                    style="color: #20a0ff;">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
  import {ipcRenderer} from 'electron'
  import {mapGetters} from 'vuex'
  import fs from 'fs'

  export default {
    data () {
      return {
        // 不能使用计算属性，无法自动响应
        importFiles: []
      }
    },
    computed: mapGetters({
      importFilesMap: 'importFilesMap',
      path: 'currentPath'
    }),
    mounted () {
      if (this.path === '') {
        this.$message({
          message: '请选择分类或磁盘',
          type: 'error',
          showClose: true
        })
      }
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
      // 调用 electron 接口导入文件夹
      handleImport () {
        // 通知主进程打开浏览本地文件的窗口
        ipcRenderer.send('open-file-dialog')
        // 接受返回的文件夹列表
        ipcRenderer.on('selected-directory', (event, paths) => {
          // 主进程返回读取文件夹的路径数组，需要使用 node 的 fs 模块进行处理
          // 存放处理的文件夹信息
          let directoryList = []
          // 遍历读取所有路径的信息
          for (let index in paths) {
            let path = paths[index]
            let stats = fs.statSync(path)
            if (!stats) {
              // 如果没有读取到文件
              this.$message({
                message: '文件读取错误，请重试！',
                type: 'error',
                showClose: true,
                duration: 4000
              })
              console.error('文件读取错误')
            } else {
              // 判断导入的是否为文件夹
              if (stats.isFile()) {
                this.$message({
                  message: '只能导入文件夹',
                  type: 'error',
                  showClose: true,
                  duration: 4000
                })
                return
              }
              let dirName = ''
              if (path.indexOf('/') >= 0) {
                dirName = path.split('/').pop()
              }
              if (path.indexOf('\\') >= 0) {
                dirName = path.split('\\').pop()
              }
              let directoryInfo = {
                name: dirName,
                lastModified: stats.mtime,
                path
              }
              directoryList.push(directoryInfo)
            }
          }
          console.log(directoryList)
          this.$store.commit('addImportFiles', directoryList)
          // 刷新文件夹列表数据
          this.getImportFileList()
        })
      },

      // 处理拖拽导入文件的操作
      dropHandler (e) {
        e.stopPropagation()
        e.preventDefault()
        // 每一次导入都是一个 fileList
        let fileList = e.dataTransfer.files
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
          this.$store.commit('addImportFiles', fileList)
          // 重定向到导入文件页面
          // 设置拖拽区域隐藏
          this.$store.commit('toggleDragShow', false)
        }
        // 遍历Map，获取文件列表
        this.getImportFileList()
      },

      // 监听拖拽事件
      dragEvent () {
        let dragZone = document.querySelector('.drag-zone')
        dragZone.addEventListener('dragover', function (e) {
          e.preventDefault()
          e.stopPropagation()
        }, false)
        dragZone.addEventListener('drop', this.dropHandler, false)
      },

      // 遍历Map，获取文件数组，对时间进行格式化处理
      getImportFileList () {
        // 将 Map 转换成数组
        let fileList = []
        // Map
        let files = this.importFilesMap
        for (let file of files.values()) {
          let tempObj = {
            name: file.name,
            size: file.size,
            path: file.path,
            // 将标准时间转化成 xxxx/xx/xx 格式
            lastModified: this.formatDate(file.lastModified)
          }
          fileList.push(tempObj)
        }
        this.importFiles = fileList
      },

      // 删除导入的文件夹
      handleDeleteFile (index, row) {
        // 文件夹的路径是文件夹的唯一标志 key
        // 从 Map 中删除文件
        let filePath = this.importFiles[index].path
        let importFilesMap = this.importFilesMap
        if (importFilesMap.has(filePath)) {
          importFilesMap.delete(filePath)
        }
        // 重新获取文件列表
        this.getImportFileList()
      },

      // 确认导入文件
      confirmImportFiles () {
        if (this.path === '') {
          this.$message({
            message: '请选择分类磁盘',
            type: 'error',
            showClose: true
          })
          return
        }
        this.$store.dispatch('confirmImportFiles').then(({status, fileAmount}) => {
          // 导入文件夹的数量为0，则报错提醒
          if (fileAmount === 0) {
            this.$message({
              type: 'error',
              message: '文件夹数量不能为0！',
              showClose: true,
              duration: 4000
            })
          }
          // 导入操作成功，提醒导入文件夹数量
          if (status === 1 && fileAmount > 0) {
            this.$message({
              type: 'success',
              message: '成功导入' + fileAmount + '个文件夹',
              showClose: true,
              duration: 5000
            })
          }
        })
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
    text-align: center;
    .title {
      margin: 1em;
      font-size: 1.1em;
      .el-button {
        float: right;
        color: #20a0ff;
      }
    }
  }
</style>
