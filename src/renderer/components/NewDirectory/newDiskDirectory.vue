<template>
  <div id="newDiskFile-root">
    <div class="newDiskFile-inner">
      <!--基本设置-->
      <div class="basic-settings">
        <!--从本地磁盘添加文件目录-->
        <div class="localDisk">
          <el-row :gutter="20">
            <el-col :span="3">
              <span>别名</span>
            </el-col>
            <el-col :span="8">
              <el-input v-model="alias" size="small">
              </el-input>
            </el-col>
            <el-col :span="3">
              <span>数据源</span>
            </el-col>
            <el-col :span="8">
              <el-select v-model="dataSource" size="small" clearable>
                <el-option
                    v-for="item in dataSourceOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </div>

        <!--从远程服务器添加文件目录-->
        <div class="area" v-if="dataSource=='remoteServer'">
          <el-row :gutter="20">
            <el-col :span="3"><span>协议</span></el-col>
            <el-col :span="8">
              <el-select v-model="remoteServer.protocol" size="small">
                <el-option
                    v-for="item in protocolOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <div class="Host">
            <el-row :gutter="20">
              <el-col :span="3">
                <span>主机</span>
              </el-col>
              <el-col :span="8">
                <el-input v-model="remoteServer.host" size="small">
                </el-input>
              </el-col>
              <el-col :span="3">
                <span>端口号</span>
              </el-col>
              <el-col :span="6">
                <el-input v-model="remoteServer.port" size="small">
                </el-input>
              </el-col>
            </el-row>
          </div>
          <div class="username">
            <el-row :gutter="20">
              <el-col :span="3">
                <span>用户名</span>
              </el-col>
              <el-col :span="8">
                <el-input v-model="remoteServer.username" size="small">
                </el-input>
              </el-col>
              <el-col :span="3">
                <span>密码</span>
              </el-col>
              <el-col :span="6">
                <el-input v-model="remoteServer.password" size="small">
                </el-input>
              </el-col>
              <el-col :span="2">
                <el-checkbox v-model="useKey">使用密钥</el-checkbox>
              </el-col>
            </el-row>
          </div>
        </div>
        <!--文件目录路径-->
        <div class="path">
          <el-row :gutter="20">
            <el-col :span="3">
              <span>路径</span>
            </el-col>
            <el-col :span="17">
              <el-input v-model="path" size="small">
              </el-input>
            </el-col>
            <el-col :span="2">
              <el-button size="small" @click="showFilename">浏览</el-button>
            </el-col>
          </el-row>

        </div>
      </div>
      <!--展开高级选项按钮-->
      <div class="show-advanced">
        <el-row>
          <el-col :span="22">
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
            <el-col :span="8">
              <span>为文件夹添加属性（可不填）</span>
            </el-col>
            <el-col :span="2">
              <span>模板</span>
            </el-col>
            <el-col :span="8">
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
              <el-col :span="3">
                <span>{{item.name}}</span>
              </el-col>
              <el-col :span="8">
                <el-input placeholder="请输入" v-model="item.value" size="small">
                </el-input>
              </el-col>
            </el-row>
          </div>
          <el-button size="small" @click="addCustomOption" v-if="template === 'custom'">+</el-button>
          <div class="custom" v-if="template === 'custom'">
            <div class="custom-item" v-for="(custom,index) in customChoose" :key="index">
              <el-row :gutter="20">
                <el-col :span="4">
                  <el-select v-model="custom.attr" size="small" cleara>
                    <el-option
                        v-for="item in customOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
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
        <el-button @click="closeWindow">取&nbsp;&nbsp;消</el-button>
        <el-button @click="confirmAddDirectory" type="primary">确&nbsp;&nbsp;认</el-button>
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
            attr: 'projectName',
            value: ''
          }, {
            name: '年份',
            attr: 'year',
            value: ''
          }, {
            name: '负责人',
            attr: 'owner',
            value: ''
          }
        ],
        // 记录用户选择的结果
        customChoose: [],
        // 别名
        alias: '',
        // 路径
        path: '',
        remoteServer: {
          protocol: '',
          host: '',
          port: '',
          username: '',
          password: ''
        },
        dataSource: 'localDisk',
        template: 'project',
        useKey: true,
        showAdvanced: false
      }
    },
    methods: {
      clearProject (e) {
        console.log(e)
      },
      addCustomOption () {
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
      showFilename () {
        ipcRenderer.send('open-file-dialog', 'single')
        ipcRenderer.on('selected-directory', (event, path) => {
          // 将返回的 path 数组转化成 string
          this.path = path.toString()
        })
      },
      noticeAddCustom (e) {
        if (e === 'custom') {
          this.$notify.info({
            title: '提示',
            message: '请点击下方的加号添加自定义条目',
            duration: 3000
          })
        }
      },
      // 删除自定义文件夹条目
      deleteCustomChoose (index) {
        this.customChoose.splice(index, 1)
        console.log(this.customChoose)
      },
      closeWindow () {
        this.$confirm('是否关闭窗口', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ipcRenderer.send('addFile', {API: 'close'})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      confirmAddDirectory () {
        // 提取项目信息
        let projectInfo = []
        for (let item in this.projectAttr) {
          projectInfo.push({
            attr: this.projectAttr[item].attr,
            value: this.projectAttr[item].value
          })
        }
        // 将所有文件夹信息汇总
        let directoryInfo = {
          alias: this.alias,
          path: this.path,
          remoteServer: this.remoteServer,
          dataSource: this.dataSource, // localDisk, remoteServer
          projectInfo,
          customAttr: this.customChoose
        }
        let call = {
          mode: 'mutation',
          API: 'setNewDiskDirInfo'
        }
        ipcRenderer.send('change-data', call, directoryInfo)
      }
    }
  }
</script>
<style lang="scss">
  html,
  body {
    height: 100%;
  }

  body {
    overflow-y: scroll;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  #newDiskFile-root {
    height: 100%;
    width: 100%;
  }

  .newDiskFile-inner {
    width: 80%;
    margin: 2em auto;
    .el-input {
      display: inline-block;
    }
  }

  .el-col {
    margin: 1em 0;
  }

  .show-advanced {
    .el-button {
      float: right;
    }
  }

  .advanced-options {
    i.el-input__icon.el-icon-close {
      margin-right: -4em !important;
    }
  }

  .confirm {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 2em 0;
    width: 100%;
    text-aligin: center;
    .el-button {
      margin: 0 3em;
    }
  }
</style>
