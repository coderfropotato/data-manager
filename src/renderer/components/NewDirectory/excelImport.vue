<template>
  <div id="excelImport-root">
    <!--文件目录路径-->
    <div class="import-excel">
      <div class="import-title">
        <el-row>
          <el-col :span="9">
            <span class="title">请选择&nbsp;Excel&nbsp;模板文件</span>
          </el-col>
          <el-col :span="8">
            <span>没有模板？</span>
            <el-button type="text" @click="generateExcelTemplate">
              点击生成
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="path">
        <el-row :gutter="20">
          <el-col :span="4">
            <span>路径</span>
          </el-col>
          <el-col :span="16">
            <el-input v-model="path" :placeholder="placeholder" size="small">
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" size="small" @click="showFilename">浏览</el-button>
          </el-col>
        </el-row>
      </div>
      <!--选择文件类型和生成模板按钮-->
      <div class="file-type" v-if="generateTemplate">
        <el-row :gutter="20">
          <el-col :span="4">
            <span>文件类型</span>
          </el-col>
          <el-col :span="6">
            <el-select v-model="fileType" placeholder="请选择" size="small">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-button size="small">取消</el-button>
            <el-button size="small" type="primary" @click="generateExcelTemplate">生成</el-button>
          </el-col>
        </el-row>
      </div>
      <!--导入模板按钮-->
      <div class="confirm" v-if="!generateTemplate">
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-button size="small">取消</el-button>
            <el-button size="small" type="primary" @click="importExcel">导入</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="import-result">
      </div>
    </div>
  </div>
</template>
<script>
  import {ipcRenderer, shell} from 'electron'
  import {mapState} from 'vuex'

  export default {
    data () {
      return {
        placeholder: '请选择模板',
        generateTemplate: false,
        // 在生成模板时，获得后台反馈的磁盘序列号
        serialNumber: '',
        path: '',
        fileType: '',
        options: [
          {
            value: 'fastq',
            label: 'fastq'
          }
        ]
      }
    },
    computed: mapState({
      targetDisks: state => state.excel.targetPositions
    }),
    methods: {
      showFilename () {
        ipcRenderer.send('open-file-dialog', 'single')
        ipcRenderer.on('selected-directory', (event, path) => {
          // 将返回的 path 数组转化成 string
          this.path = path.toString()
        })
      },
      generateExcelTemplate () {
        this.placeholder = '请选择模板生成路径'
        this.generateTemplate = true
        // 如果没有选择路径
        if (this.path === '' || this.fileType === '') {
          this.$notify({
            type: 'info',
            message: '请选择生成模板的位置和文件类型！',
            duration: 3000
          })
          return
        }
        this.$store.dispatch({
          type: 'generateExcelTemplate',
          path: this.path,
          fileType: this.fileType
        }).then(response => {
          let path = response.path
          if (path !== '') {
            this.$notify({
              type: 'success',
              title: '成功',
              message: 'Excel 模板生成成功，点击打开！',
              duration: 0,
              onClick: this.openFile(path)
            })
            // 切换到导入模板状态
            this.placeholder = '请选择模板'
            this.generateTemplate = false
            // 设置路径模板生成路径
            this.path = path
          } else {
            this.$notify({
              type: 'error',
              title: '失败',
              message: 'Excel 模板生成失败，请重试！',
              duration: 3000
            })
          }
        })
      },
      // 导入 Excel 模板
      importExcel () {
        if (this.path === '') {
          this.$notify({
            title: '提示',
            message: '路径不能为空',
            type: 'error'
          })
          return
        }
        if (this.path.indexOf('.xls') === -1) {
          this.$notify({
            title: '提示',
            message: '请选择 Excel 模板文件',
            type: 'error'
          })
          return
        }
        this.$store.dispatch('importExcel', this.path)
      },
      openFile (path) {
        // shell.showItemInFolder(path)
        // 打开文件
        shell.openExternal('file://' + path)
      }
    }
  }
</script>
<style lang="scss">
  #excelImport-root {
    .import-excel {
      width: 80%;
      margin: 4em auto;
      .import-title {
        .el-button {
          padding: 0;
        }
      }
      .title {
        display: inline-block;
        font-size: 1.2em;
        margin-top: -0.2em;
      }
      .file-type,
      .confirm {
        .el-row--flex {
          text-align: center;
        }
        .el-button {
          margin: 2em 2em;
        }
      }
    }
    .el-row {
      margin: 1.5em 0;
      height: 2em;
      line-height: 2em;
    }
  }
</style>
