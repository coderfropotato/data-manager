<template>
  <div id="newDiskFile-root" v-loading.lock="fullscreenLoading" element-loading-text="正在扫描磁盘文件，请稍候">
    <div class="newDiskFile-inner">
      <my-nav @close="closeWin" @mini="miniWin" :h="46" :config="{'close':true,'mini':true,'resize':false}"></my-nav>
      <!--基本设置-->
      <el-form
          :model="basicForm"
          :rules="rules"
          ref="basicForm"
          label-position="left"
          label-width="80px">
                  <!--选择路径-->
        <el-form-item  label="路径" prop="path">
          <el-input class="path" v-model="basicForm.path" size="small"></el-input>
          <input class="potatos-btn btn-hover" type="button" value="浏览"  @click="showPath">
          <!-- <el-button  type="primary" size="small" @click="showPath" style="margin-left: 1.5em;">浏览</el-button> -->
        </el-form-item>
        
        <el-form-item label="数据源" required>
          <el-select v-model.trim="basicForm.dataSource" size="small" >
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
            <el-select  v-model.trim="basicForm.protocol" size="small">
              <el-option
                  v-for="item in protocolOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主机" prop="host">
            <el-input v-model.trim="basicForm.host" size="small">
            </el-input>
          </el-form-item>
          <el-form-item label="端口号" prop="port">
            <el-input v-model.trim="basicForm.port" size="small">
            </el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-col :span="24">
              <el-input v-model.trim="basicForm.username" size="small">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model.trim="basicForm.password" size="small">
            </el-input>
            <!-- <el-checkbox v-model="useKey" style="margin-left: 1.5em;">使用密钥</el-checkbox> -->
          </el-form-item>
        </div>
        <el-form-item label="别名" prop="alias"> 
          <el-input :maxlength="50" v-model.trim="basicForm.alias" size="small"></el-input>
        </el-form-item>
      </el-form>
      <!--展开高级选项按钮-->
      <!-- <div class="show-advanced">
        <el-row>
          <el-col :span="20">
            <el-tooltip content="为文件夹添加属性信息" placement="top">
              <el-button size="small" @click="showAdvanced=!showAdvanced">展开高级选项
              </el-button>
            </el-tooltip>
          </el-col>
        </el-row>
      </div> -->
      <!--高级选项 暂未开放-->
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
          <div class="attr-item" v-for="(item,index) in projectAttr" :key="index">
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
            <el-button class="btn-first" @click="resetForm">重置</el-button>
            <el-button class="btn-hover" type="primary" @click="confirmAddDirectory">提交</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import navbar from "../../../components/navbar";
import { ipcRenderer } from "electron";
import fetchData from "../../../api/index";
import bus from "@/utils/bus";
export default {
  data() {
    return {
      isMessage: false,
      fullscreenLoading: false,
      dataSourceOptions: [
        {
          value: "localDisk",
          label: "本地磁盘或外接设备"
        },
        {
          value: "remoteServer",
          label: "远程服务器"
        }
      ],
      protocolOptions: [
        {
          value: "SSH",
          label: "SSH"
        }
      ],
      templateOptions: [
        {
          value: "project",
          label: "项目文件夹"
        },
        {
          value: "custom",
          label: "自定义文件夹"
        }
      ],
      customOptions: [
        {
          value: "条目一",
          label: "条目一"
        },
        {
          value: "条目二",
          label: "条目二"
        }
      ],
      projectAttr: [
        {
          name: "项目",
          attr: "project",
          value: ""
        },
        {
          name: "年份",
          attr: "year",
          value: ""
        },
        {
          name: "负责人",
          attr: "principal",
          value: ""
        }
      ],
      // 表单数据
      basicForm: {
        // 别名
        alias: "",
        // 路径
        path: "",
        // 数据源
        dataSource: "localDisk",
        // 远程服务器信息
        protocol: "SSH",
        host: "",
        port: "",
        username: "",
        password: ""
      },
      // 表单验证规则
      rules: {
        alias: [{ required: true, message: "请输入磁盘别名", trigger: "change" }],
        path: [{ required: true, message: "请选择路径", trigger: "change" }],
        protocol: [{ required: true, message: "请选择协议", trigger: "change" }],
        host: [{ required: true, message: "请输入主机地址", trigger: "change" }],
        port: [{ required: true, message: "请输入端口", trigger: "change" }],
        username: [{ required: true, message: "请输入用户名", trigger: "change" }],
        password: [{ required: true, message: "请输入密码", trigger: "change" }]
      },
      // 记录用户选择的结果
      customChoose: [],
      // 项目模板选项
      template: "project",
      // 是否使用密匙（暂不支持）
      useKey: true,
      // 是否显示高级选项
      showAdvanced: false
    };
  },
  created() {
    let _this = this;
    bus.$on("error", _ => {
      this.fullscreenLoading = false;
      if (!this.isMessage) {
        this.isMessage = true;
        this.$message({
          type: "error",
          message: "数据读取失败，请重试。",
          duration: 1200,
          onClose: _ => {
            this.isMessage = false;
          }
        });
      }
    });
  },
  watch: {
    basicForm: {
      handler: function(val, oldVal) {
        if (val.dataSource !== "localDisk") {
          this.$electron.ipcRenderer.send("resetWinSize", [650, 600]);
        } else {
          this.$electron.ipcRenderer.send("resetWinSize", [650, 340]);
        }
      },
      deep: true
    }
  },
  components: ["navbar"],
  methods: {
    closeWin() {
      this.$electron.ipcRenderer.send("addFile", { API: "close" });
    },
    miniWin() {
      this.$electron.ipcRenderer.send("addFile", { API: "mini" });
    },
    // 重置表格数据
    resetForm() {
      this.$refs["basicForm"].resetFields();
    },
    // 添加自定义文件夹条目
    // TODO 防止自定义条目重复选择
    addCustomOption() {
      // 只能选择提供的条目
      let optionLength = this.customOptions.length;
      if (this.customChoose.length < optionLength) {
        this.customChoose.push({
          attr: "",
          value: ""
        });
      } else {
        this.$notify.info({
          title: "提示",
          message: "只能添加" + optionLength + "条可选属性！",
          duration: 3000
        });
      }
    },
    // 删除自定义文件夹条目
    deleteCustomChoose(index) {
      this.customChoose.splice(index, 1);
      //console.log(this.customChoose);
    },
    // 在输入框显示选择路径
    showPath() {
      ipcRenderer.send("open-file-dialog", "single");
      ipcRenderer.on("selected-directory", (event, path) => {
        // 将返回的 path 数组转化成 string
        this.basicForm.path = path.toString();
        var nameArr = "Untitled"
        if(process.platform == "win32") {
          nameArr = path.toString().split("\\");
        } else {
          nameArr = path.toString().split("/");
        }
        this.basicForm.alias = nameArr[nameArr.length - 1];
      });
    },
    // 提示信息
    noticeAddCustom(e) {
      if (e === "custom") {
        this.$notify.info({
          title: "提示",
          message: "请点击下方的加号添加自定义条目",
          duration: 3000
        });
      }
    },
    // 确认添加磁盘目录
    confirmAddDirectory() {
      let _this = this;
      this.$refs["basicForm"].validate(valid => {
        if (valid) {
          _this.fullscreenLoading = true;
          // 提取项目信息
          let formData = this.basicForm;
          let projectInfo = [];
          for (let item in this.projectAttr) {
            projectInfo.push({
              [this.projectAttr[item].attr]: this.projectAttr[item].value
            });
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
          };
          //判断是否可以被管理
          fetchData("isAliasExist", {
            alias: _this.basicForm.alias
          }).then(res => {
            if (res.result) {
              //远程服务 或者 本地磁盘
              let params = {
                path: _this.basicForm.path,
                isTelnet: false,
                alias: _this.basicForm.alias,
                source: {}
              };
              if (_this.basicForm.dataSource === "remoteServer") {
                params.isTelnet = true;
                params.source.host = _this.basicForm.host;
                params.source.port = _this.basicForm.port;
                params.source.username = _this.basicForm.username;
                params.source.password = _this.basicForm.password;
                params.source.secretKey = "";
                params.source.isSecretKey = false;
                params.source.protocal = _this.basicForm.protocol;
              }
              fetchData("addDiskDir", params).then(
                res => {
                  _this.fullscreenLoading = false;
                  if (res.result === "success") {
                    // 重新获取设备列表
                    _this.$electron.ipcRenderer.send("updateFilesList");
                    if (!_this.isMessage) {
                      _this.isMessage = true;
                      _this.$message({
                        message: "项目添加成功",
                        duration: 1200,
                        type: "success",
                        onClose: function() {
                          _this.isMessage = false;
                          _this.$electron.ipcRenderer.send("addFile", {
                            API: "close"
                          });
                        }
                      });
                    }
                    // update file status
                  } else {
                    if (!_this.isMessage) {
                      _this.isMessage = true;
                      _this.$message({
                        message: res.Error,
                        duration: 1200,
                        type: "warning",
                        onClose: function() {
                          _this.isMessage = false;
                        }
                      });
                    }
                  }
                },
                err => {
                  _this.fullscreenLoading = false;
                }
              );
            } else {
              if (!_this.isMessage) {
                _this.isMessage = true;
                _this.$message({
                  message: "文件名重复，请重试",
                  duration: 1200,
                  type: "warning",
                  onClose: function() {
                    _this.isMessage = false;
                  }
                });
              }
              _this.fullscreenLoading = false;
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
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
    padding-top: 66px;
    width: 80%;
    margin: 0 auto;
  }
  .el-form {
    .el-input {
      display: inline-block;
      width: 24em;
      &.path {
        padding-right: 54px;
      }
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
  .potatos-btn {
    width: 58px;
    height: 30.5px;
    outline: none;
    color: #fff;
    border: none;
    border-radius: 0 4px 4px 0;
    background: #386cca;
    position: absolute;
    right: 54px;
    top: 3px;
    cursor: pointer;
  }
  .path {
    .el-input__inner {
      padding-right: 64px;
    }
  }
}
</style>
