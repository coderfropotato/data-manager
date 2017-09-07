<template>
  <div id="excelImport-root" v-loading.fullscreen="loading">
    <!--文件目录路径-->
    <div class="import-excel">
      <div class="import-title">
        <el-row>
          <el-col :span="16">
            <span class="title">{{title}}</span>
          </el-col>
          <el-col :span="8" v-if="!generateTemplate">
            <span>没有模板？</span>
            <el-button type="text" @click="toggle(true)">
              点击生成
            </el-button>
          </el-col>
        </el-row>
      </div>
      <el-form
          :model="ruleForm"
          :rules="rules"
          label-position="left"
          ref="ruleForm"
          class="ruleForm"
          label-width="80px">
        <el-form-item label="路径" prop="path" required>
          <el-col :span="20">
            <el-input v-model="ruleForm.path" :placeholder="placeholder" size="small"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" size="small" @click="showPath">浏览</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="文件类型" prop="fileType">
          <el-select v-model="ruleForm.fileType" placeholder="请选择" size="small">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导入磁盘" prop="serialNumber" v-if="!generateTemplate">
          <el-select v-model="ruleForm.serialNumber" placeholder="请选择" size="small">
            <el-option
                v-for="item in targetDisks"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!--选择文件类型和生成模板按钮-->
      <div class="file-type">
        <el-row type="flex" justify="center" v-if="generateTemplate">
          <el-col :span="10">
            <el-button size="small" @click="toggle(false)">取消</el-button>
            <el-button size="small" type="primary" @click="generateExcelTemplate">生成</el-button>
          </el-col>
        </el-row>
      </div>
      <!--导入模板按钮-->
      <div class="confirm" v-if="!generateTemplate">
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-button size="small" @click="resetForm">重置</el-button>
            <el-button size="small" type="primary" @click="importExcel">导入</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="import-result" v-if="imported">
        <span class="title">导入结果</span>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-table
                :data="importResult.notFoundFiles"
                border
                style="width: 100%;"
                max-height="300">
              <el-table-column
                  prop="file"
                  label="未找到的文件">
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="8">
            <el-table
                :data="importResult.repeatFiles"
                border
                style="width: 100%;"
                max-height="300">
              <el-table-column
                  prop="file"
                  label="重复的文件">
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="8">
            <el-table
                :data="importResult.warnMsg"
                border
                style="width: 100%;"
                max-height="300">
              <el-table-column
                  prop="file"
                  label="错误信息">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
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
        title: '请选择 Excel 模板文件',
        placeholder: '请选择模板',
        ruleForm: {
          path: '',
          fileType: '',
          serialNumber: ''
        },
        rules: {
          path: [
            {validator: this.checkPath, trigger: 'blur'}
          ],
          fileType: [
            {required: true, message: '请选择文件类型', trigger: 'blur'}
          ],
          serialNumber: [
            {required: true, message: '请选择磁盘', trigger: 'change'}
          ]
        },
        // 在生成模板时，获得后台反馈的磁盘序列号
        options: [
          {
            value: 'fastq',
            label: 'fastq'
          }
        ],
        importResult: {
          notFoundFiles: [],
          repeatFiles: [],
          warnMsg: []
        },
        // 加载动画
        loading: true,
        // 显示状态
        generateTemplate: false,
        // 控制导入结果是否显示
        imported: false
      }
    },
    computed: mapState({
      targetDisks: state => {
        let rowData = state.excel.targetPositions
        let target = []
        for (let item in rowData) {
          target.push({
            value: rowData[item].serialNumber,
            label: rowData[item].name
          })
        }
        return target
      }
    }),
    watch: {
      targetDisks () {
        this.loading = false
      }
    },
    methods: {
      // 重置表单输入框
      resetForm () {
        this.$refs['ruleForm'].resetFields()
      },
      // 自定义验证方法，检查路径是否符合要求
      checkPath (rule, value, callback) {
        // 选择生成模板路径
        if (this.generateTemplate) {
          if (value === '') {
            callback(new Error('路径不能为空'))
          } else {
            callback()
          }
        }
        // 选择导入模板路径
        if (!this.generateTemplate) {
          if (value === '') {
            callback(new Error('路径不能为空'))
          } else {
            if (value.indexOf('xls') === -1) {
              callback(new Error('请选择 Excel 文件'))
            } else {
              callback()
            }
          }
        }
      },
      // 显示打开的路径
      showPath () {
        ipcRenderer.send('open-file-dialog', 'single')
        ipcRenderer.on('selected-directory', (event, path) => {
          // 将返回的 path 数组转化成 string
          this.ruleForm.path = path.toString()
        })
      },
      // 生成 Excel 模板
      generateExcelTemplate () {
        // this.generateTemplate = true
        // 验证表单字段
        this.$refs['ruleForm'].validate((valid) => {
          // 验证通过
          if (valid) {
            /**
             * 发送生成模板的请求
             * @path 生成路径
             * @fileType 所选择的文件类型
             */
            this.$store.dispatch({
              type: 'generateExcelTemplate',
              path: this.ruleForm.path,
              fileType: this.ruleForm.fileType
            }).then(response => {
              // 返回生成的模板的所在路径
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
                this.ruleForm.path = path
              } else {
                this.$notify({
                  type: 'error',
                  title: '失败',
                  message: 'Excel 模板生成失败，请重试！',
                  duration: 3000
                })
              }
            })
          } else {
            return false
          }
        })
      },
      // 导入 Excel 模板
      importExcel () {
        this.loading = true
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$store.dispatch({
              type: 'importExcelTemplate',
              path: this.ruleForm.path,
              serialNumber: this.ruleForm.serialNumber,
              fileType: this.ruleForm.fileType
            }).then(data => {
              /**
               *  获取导入结果反馈
               *  @error 错误消息
               *  @repeat 重复的导入文件
               *  @not_found 没有找到的文件
               *  @warn_msg 有关文件错误的消息
               */
              if (data.error !== '') {
                this.$notify({
                  type: 'error',
                  message: data.error,
                  duration: 0
                })
                this.loading = false
                return false
              }
              this.imported = true
              // 获取并设置导入结果数据，用于显示导入结果列表
              // 未找到的文件
              for (let item in data.not_found) {
                this.importResult.notFoundFiles.push({
                  file: data.not_found[item]
                })
              }
              // 重复的文件
              for (let item in data.repeat) {
                this.importResult.repeatFiles.push({
                  file: data.repeat[item]
                })
              }
              // 错误消息
              for (let item in data.warn_msg) {
                this.importResult.warnMsg.push({
                  file: data.warn_msg[item]
                })
              }
              this.loading = false
            })
          } else {
            this.loading = false
            return false
          }
        })
      },
      openFile (path) {
        // shell.showItemInFolder(path)
        // 打开文件
        shell.openExternal('file://' + path)
      },
      // 切换显示状态
      toggle (value) {
        if (value) {
          this.placeholder = '请选择模板生成路径'
          this.title = '生成模板文件'
        } else {
          this.placeholder = '请选择模板'
          this.title = '请选择 Excel 模板文件'
        }
        this.generateTemplate = value
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
        .title {
          display: inline-block;
          font-size: 1.2em;
          margin-top: -0.2em;
        }
      }
      .el-form {
        margin: 2em auto;
        .el-button {
          margin: 0 2em;
        }
      }
      // 确认按钮
      .file-type,
      .confirm {
        .el-row--flex {
          text-align: center;
        }
        .el-button {
          margin: 2em 2em;
        }
      }

      // 导入结果
      .import-result {
        .title {
          font-size: 1.2em;
          display: inline-block;
          margin: 1.5em 0;
        }
      }
    }
  }
</style>
