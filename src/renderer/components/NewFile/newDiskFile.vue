<template>
  <div id="newDiskFile-root">
    <div class="top">
      <span>别名</span>
      <el-input  v-model="alias" size="mini">
      </el-input>
      <span>数据源</span>
      <el-select v-model="dataSource"  size="mini" clearable>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="area" v-if="dataSource=='远程服务器'">
      <span>协议</span>
      <el-select v-model="protocol" size="mini">
        <el-option
          v-for="item in options2"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div class="Host">
        <span>主机</span>
        <el-input  v-model="remoteServer.host" size="mini">
        </el-input>
        <span>端口号</span>
        <el-input  v-model="remoteServer.port" size="mini">
        </el-input>
      </div>
      <div class="username">
        <span style="margin-right: 0em">用户名</span>
        <el-input  v-model="remoteServer.username" size="mini">
        </el-input>
        <span style="margin-right: 2em">密码</span>
        <el-input  v-model="remoteServer.password" size="mini">
        </el-input>
        <el-checkbox v-model="checked" style="margin-left: 1em">使用密钥</el-checkbox>
      </div>
    </div>
    <div class="path">
      <span>路径</span>
      <el-input  v-model="path" size="mini">
      </el-input>
      <el-button size="mini" v-on:click="showFilename" style="width: 4em">浏览</el-button>
    </div>
    <el-button size="mini" style="margin-left: 33em;margin-top: 1em;" v-on:click="showAdvanced=!showAdvanced">展开高级选项</el-button>
    <div v-if="showAdvanced">
      <div class="line"></div>
      <div class="advancedOptions">
        <div>
          <span style="margin-right: 4em">为文件夹添加属性</span>
          <span>模板</span>
          <el-select v-model="model"  size="mini" clearable style="width: 8em">
            <el-option
              v-for="item in options3"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="property">
          <div class="projectName">
            <span>项目</span>
            <el-input placeholder="请输入" icon="close"  v-model="advanced.project" :on-icon-click="clearProject" size="mini">
            </el-input>
          </div>
          <div class="year">
            <span>年份</span>
            <el-input placeholder="请输入" icon="close" v-model="advanced.year" :on-icon-click="clearYear" size="mini">
            </el-input>
          </div>
          <div class="principal">
            <span style="margin-right: 0em">负责人</span>
            <el-input placeholder="请输入" icon="close" v-model="advanced.principal" :on-icon-click="clearPrincipal" size="mini">
            </el-input>
          </div>
          <el-button size="mini" style="width: 3em;margin: 1.5em 0 0 2em" v-on:click="add">+</el-button>
          <div class="item" v-if="showItem">
            <el-select v-model="items"  size="mini" clearable style="width: 5.5em">
              <el-option
                v-for="item in options4"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input  v-model="input8" size="mini"></el-input>
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
        options: [{
          value: '本地磁盘或外接设备',
          label: '本地磁盘或外接设备'
        }, {
          value: '远程服务器',
          label: '远程服务器'
        }],
        options2: [{
          value: 'SSH',
          label: 'SSH'
        }],
        options3: [{
          value: '项目文件夹',
          label: '项目文件夹'
        }, {
          value: '自定义文件夹',
          label: '自定义文件夹'
        }],
        options4: [{
          value: '条目一',
          label: '条目一'
        }, {
          value: '条目二',
          label: '条目二'
        }],
        alias: '',
        path: '',
        remoteServer: {
          host: '',
          port: '',
          username: '',
          password: ''
        },
        advanced: {
          project: '',
          year: '',
          principal: ''
        },
        dataSource: '本地磁盘或外接设备',
        protocol: 'SSH',
        model: '项目文件夹',
        items: '条目一',
        checked: true,
        showItem: false,
        showAdvanced: false
      }
    },
    methods: {
      clearProject (ev) {
        this.advanced.project = ''
      },
      clearYear () {
        this.advanced.year = ''
      },
      clearPrincipal () {
        this.advanced.principal = ''
      },
      add () {
        this.model = '自定义文件夹'
        this.showItem = !this.showItem
      },
      showFilename () {
        ipcRenderer.send('open-file-dialog')
        let vueThis = this
        ipcRenderer.on('selected-directory', function (event, path) {
          console.log(vueThis)
          vueThis.path = `${path}`
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  #newDiskFile-root {
    font-size: 15px;
    span {
      margin: 1em 1em 1em 1.5em;
    }
    .top {
      margin-top: 1em;
      .el-input {
        width: 12em;
        }
    }
    .path {
      margin-top: 2em;
      .el-input {
        width: 25em;
      }
    }
    .area {
      margin-top: 1.5em;
      .username {
        margin-top: 1.5em;
      }
      .Host {
        margin-top: 1.5em;
      }
    }
    .el-input {
      width: 12em;
    }
    .line {
      height: 1px;
      width: 90%;
      background-color: #48576a;
      margin: 1em auto;
    }
    .projectName {
      margin-top: 1em;
    }
    .year {
      margin-top: 1em;
    }
    .principal {
      margin-top: 1em;
    }
    .item {
      margin: 1em 0 0 1.5em;
    }
    .property {
      .el-input {
        width: 12em;
      }
    }
  }
</style>
