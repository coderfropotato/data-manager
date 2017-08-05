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
              <el-select v-model="protocol" size="small">
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
            <el-button size="small" @click="showAdvanced=!showAdvanced">展开高级选项
            </el-button>
          </el-col>
        </el-row>
      </div>
      <!--高级选项-->
      <div class="advanced-options" v-if="showAdvanced">
        <div>
          <el-row :gutter="20">
            <el-col :span="8">
              <span>为文件夹添加属性</span>
            </el-col>
            <el-col :span="3">
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
                <el-input placeholder="请输入" icon="close" v-model="item.value" :on-icon-click="clearProject"
                          size="small">
                </el-input>
              </el-col>
            </el-row>
          </div>
          <el-button size="small" @click="addCustomOption" v-if="template === 'custom'">+</el-button>
          <div class="custom" v-if="template === 'custom'">
            <div class="custom-item" v-for="custom in customChoose">
              <el-row :gutter="20">
                <el-col :span="4">
                  <el-select v-model="custom.key" size="small" cleara>
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
              </el-row>
            </div>
          </div>
        </div>
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
        projectAttr: [
          {
            name: '项目',
            value: ''
          }, {
            name: '年份',
            value: ''
          }, {
            name: '负责人',
            value: ''
          }
        ],
        customOptions: [
          {
            value: '条目一',
            label: '条目一'
          }, {
            value: '条目二',
            label: '条目二'
          }
        ],
        customChoose: [],
        alias: '',
        path: '',
        remoteServer: {
          host: '',
          port: '',
          username: '',
          password: ''
        },
        dataSource: 'localDisk',
        protocol: 'SSH',
        template: 'project',
        useKey: true,
        showAdvanced: false
      }
    },
    methods: {
      clearProject (ev) {
        this.advanced.project = ''
      },
      addCustomOption () {
        this.customChoose.push({
          key: '',
          value: ''
        })
      },
      showFilename () {
        ipcRenderer.send('open-file-dialog')
        let vueThis = this
        ipcRenderer.on('selected-directory', function (event, path) {
          console.log(vueThis)
          vueThis.path = `${path}`
        })
      },
      noticeAddCustom (e) {
        if (e === 'custom') {
          this.$notify.info({
            title: '提示',
            message: '请点击下方的加号添加自定义条目',
            duration: 0
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  html,
  body {
    height: 100%;
    overflow: hidden;
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
</style>
