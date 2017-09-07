<template>
  <div id="newDiskFile-root">
    <div class="newDiskFile-inner">
      <!--基本设置-->
      <el-form
          :model="basicForm"
          :rules="rules"
          ref="basicForm"
          label-position="left"
          label-width="80px">
        <el-form-item label="别名" prop="alias">
          <el-input v-model="basicForm.alias" size="small"></el-input>
        </el-form-item>
        <el-form-item label="数据源" required>
          <el-select v-model="basicForm.dataSource" size="small" clearable>
            <el-option
                v-for="item in dataSourceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="remote" v-if="basicForm.dataSource === 'remoteServer'">
          <el-form-item label="协议" prop="protocol">
            <el-select v-model="basicForm.protocol" size="small">
              <el-option
                  v-for="item in protocolOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主机" prop="host">
            <el-input v-model="basicForm.host" size="small">
            </el-input>
          </el-form-item>
          <el-form-item label="端口号" prop="port">
            <el-input v-model="basicForm.port" size="small">
            </el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-col :span="24">
              <el-input v-model="basicForm.username" size="small">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="basicForm.password" size="small">
            </el-input>
            <el-checkbox v-model="useKey" style="margin-left: 1.5em;">使用密钥</el-checkbox>
          </el-form-item>
        </div>
        <!--选择路径-->
        <el-form-item label="路径" prop="path">
          <el-input v-model="basicForm.path" size="small"></el-input>
          <el-button type="primary" size="small" @click="showPath" style="margin-left: 1.5em;">浏览</el-button>
        </el-form-item>
      </el-form>
      <!--展开高级选项按钮-->
      <div class="show-advanced">
        <el-row>
          <el-col :span="20">
            <el-tooltip content="为文件夹添加属性信息" placement="top">
              <el-button size="small" @click="showAdvanced=!showAdvanced">展开高级选项
              </el-button>
            </el-tooltip>
          </el-col>
        </el-row>
      </div>
      <!--高级选项-->
      <div class="advanced-options" v-if="showAdvanced">
        <div>
          <el-row :gutter="20">
            <el-col :span="24">
              <span>为文件夹添加属性（可不填）</span>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="4">
              <span>模板</span>
            </el-col>
            <el-col :span="14">
              <!--当用户选择后，通知用户添加自定义条目-->
              <el-select v-model="template" size="small" clearable @change="noticeAddCustom">
                <el-option
                    v-for="item in templateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </div>
        <div class="project-attr">
          <div class="attr-item" v-for="item in projectAttr">
            <el-row :gutter="20">
              <el-col :span="4">
                <span>{{item.name}}</span>
              </el-col>
              <el-col :span="14">
                <el-input placeholder="请输入" v-model="item.value" size="small">
                </el-input>
              </el-col>
            </el-row>
          </div>
          <el-button size="small" @click="addCustomOption" v-if="template === 'custom'">+</el-button>
          <div class="custom" v-if="template === 'custom'">
            <div class="custom-item" v-for="(custom,index) in customChoose" :key="index">
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-select v-model="custom.attr" size="small" cleara>
                    <el-option
                        v-for="item in customOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="14">
                  <el-input v-model="custom.value" size="small"></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button type="primary" icon="delete" size="small"
                             @click="deleteCustomChoose(index)"></el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
      <div class="confirm">
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button @click="resetForm">重置</el-button>
            <el-button type="primary" @click="confirmAddDirectory">提交</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
  import {ipcRenderer} from 'electron'

  export default {
    data () {
      return {
        dataSourceOptions: [{
          value: 'localDisk',
          label: '本地磁盘或外接设备'
        }, {
          value: 'remoteServer',
          label: '远程服务器'
        }],
        protocolOptions: [{
          value: 'SSH',
          label: 'SSH'
        }],
        templateOptions: [{
          value: 'project',
          label: '项目文件夹'
        }, {
          value: 'custom',
          label: '自定义文件夹'
        }],
        customOptions: [
          {
            value: '条目一',
            label: '条目一'
          }, {
            value: '条目二',
            label: '条目二'
          }
        ],
        projectAttr: [
          {
            name: '项目',
            attr: 'project',
            value: ''
          }, {
            name: '年份',
            attr: 'year',
            value: ''
          }, {
            name: '负责人',
            attr: 'principal',
            value: ''
          }
        ],
        // 表单数据
        basicForm: {
          // 别名
          alias: '',
          // 路径
          path: '',
          // 数据源
          dataSource: 'localDisk',
          // 远程服务器信息
          protocol: '',
          host: '',
          port: '',
          username: '',
          password: ''
        },
        // 表单验证规则
        rules: {
          alias: [
            {required: true, message: '请输入磁盘别名', trigger: 'blur'}
          ],
          path: [
            {required: true, message: '请选择路径', trigger: 'blur'}
          ],
          protocol: [
            {required: true, message: '请选择协议', trigger: 'change'}
          ],
          host: [
            {required: true, message: '请输入主机地址', trigger: 'blur'}
          ],
          port: [
            {required: true, message: '请输入端口', trigger: 'blur'}
          ],
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        // 记录用户选择的结果
        customChoose: [],
        // 项目模板选项
        template: 'project',
        // 是否使用密匙（暂不支持）
        useKey: true,
        // 是否显示高级选项
        showAdvanced: false
      }
    },
    methods: {
      // 重置表格数据
      resetForm () {
        this.$refs['basicForm'].resetFields()
      },
      // 添加自定义文件夹条目
      // TODO 防止自定义条目重复选择
      addCustomOption () {
        // 只能选择提供的条目
        let optionLength = this.customOptions.length
        if (this.customChoose.length < optionLength) {
          this.customChoose.push({
            attr: '',
            value: ''
          })
        } else {
          this.$notify.info({
            title: '提示',
            message: '只能添加' + optionLength + '条可选属性！',
            duration: 3000
          })
        }
      },
      // 删除自定义文件夹条目
      deleteCustomChoose (index) {
        this.customChoose.splice(index, 1)
        console.log(this.customChoose)
      },
      // 在输入框显示选择路径
      showPath () {
        ipcRenderer.send('open-file-dialog', 'single')
        ipcRenderer.on('selected-directory', (event, path) => {
          // 将返回的 path 数组转化成 string
          this.basicForm.path = path.toString()
        })
      },
      // 提示信息
      noticeAddCustom (e) {
        if (e === 'custom') {
          this.$notify.info({
            title: '提示',
            message: '请点击下方的加号添加自定义条目',
            duration: 3000
          })
        }
      },
      // 确认添加磁盘目录
      confirmAddDirectory () {
        this.$refs['basicForm'].validate((valid) => {
          if (valid) {
            // 提取项目信息
            let formData = this.basicForm
            let projectInfo = []
            for (let item in this.projectAttr) {
              projectInfo.push({
                [this.projectAttr[item].attr]: this.projectAttr[item].value
              })
            }
            // 将所有文件夹信息汇总
            // TODO 目录类型需要明确（私有数据，共有数据，共享数据）
            let directoryInfo = {
              alias: formData.alias,
              path: formData.path,
              remoteServer: {
                protocol: formData.protocol,
                host: formData.host,
                port: formData.port,
                username: formData.username,
                password: formData.password
              },
              dataSource: formData.dataSource, // localDisk, remoteServer
              projectInfo,
              customAttr: this.customChoose
            }
            // 判断当前路径是否已经被管理
            this.$store.dispatch({
              type: 'judgeNewDiskDir',
              path: formData.path,
              host: formData.host
            }).then(status => {
              // 文件夹可以被管理
              if (status === 0) {
                this.$store.dispatch('addNewDiskDir', directoryInfo).then(status => {
                  if (status) {
                    this.$message({
                      type: 'info',
                      message: '目录添加成功',
                      showClose: true
                    })
                  }
                  // 重新刷新数据
                  let call = {
                    mode: 'action',
                    API: 'openFile'
                  }
                  ipcRenderer.send('change-data', call)
                })
              }
              // 子文件夹已被管理
              if (status === -1) {
                this.$confirm('存在子文件已被管理，是否放弃操作或继续（继续将删除已存在的子文件夹信息）?', '提示', {
                  confirmButtonText: '继续',
                  cancelButtonText: '放弃',
                  type: 'warning'
                }).then(() => {
                  this.$store.dispatch('addNewDiskDir', directoryInfo).then(() => {
                    // 重新刷新数据
                    let call = {
                      mode: 'action',
                      API: 'openFile'
                    }
                    ipcRenderer.send('change-data', call)
                  })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已放弃',
                    showClose: true
                  })
                })
              }
              // 父文件夹（包括本身）已被管理
              if (status === 1) {
                this.$confirm('此文件夹已被管理', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
                })
              }
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  // 隐藏滚动条
  #newDiskFile-root {
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    font-weight: 500;
    &::-webkit-scrollbar {
      display: none;
    }
    // 内间距
    .newDiskFile-inner {
      width: 80%;
      margin: 2em auto;
    }
    .el-form {
      .el-input {
        display: inline-block;
        width: 24em;
      }
      .el-form-item {
        width: 32em;
        margin: 1em auto;
      }
    }
    .advanced-options {
      // 行间距
      .el-col {
        margin: 1em 0;
      }
      .attr-item {
        .el-input {
          width: 24em;
        }
      }
    }

    // 显示高级选项按钮
    .show-advanced {
      .el-button {
        float: right;
        margin-right: -0.8em;
      }
    }

    .advanced-options {
      width: 32em;
      margin: 2em auto;
      i.el-input__icon.el-icon-close {
        margin-right: -4em !important;
      }
    }

    // 确认与取消按钮
    .confirm {
      .el-row--flex {
        text-align: center;
      }
      .el-button {
        margin: 2em 2em;
      }
    }
  }
</style>
