<template>
  <div id="filescale">
      <ol v-if="fileList.length">
        <li @click="jumpToSearch(item)"  v-for="(item,index) in fileList" :key="index">
          <img v-if="item.ismoveable" src="../../../assets/images/disk.png" />
          <img v-else-if="item.isTelnet" src="../../../assets/images/telnet.png" />
          <img v-else src="../../../assets/images/computer.png" />
          <p>{{item.alias}}</p>
        </li>
      </ol>
      <div class="menu">
        <p @click="rename"><i class="iconfont icon-beizhu"></i>重命名</p>
        <p @click="del"><i class="iconfont icon-shanchu1"></i>删除</p>
      </div>
      <div v-if="!fileList.length" class="no-data">
        <img src="../../../assets/images/nodevice.png" alt="">
        <p>您还没有添加任何设备，赶紧去<span @click="addDevice">添加</span>吧</p>
      </div>
      <!-- dialog -->
      <el-dialog
        title="修改名称"
        :visible.sync="dialogVisible"
        custom-class="dialog-custom"
        size="tiny">
        <el-input size="small" :maxlength="50" @keyup.enter.native="saveAlias" v-model.trim="modifiedAlias"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveAlias">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import $ from "jquery";
import { mapGetters } from "vuex";
import fetchData from "@/api/getData";
export default {
  data() {
    return {
      deviceList: [
        {
          name: "我的电脑",
          isDisk: false
        },
        {
          name: "我的磁盘",
          isDisk: true
        }
      ],
      isMessage:false,
      dialogVisible: false,
      index:0,
      renameItem: {},
      modifiedAlias: ""
    };
  },
  mounted() {
    let _this = this;
    $(document).on("click", function() {
      $(".menu").fadeOut();
    });
    $(document).on("contextmenu", "#filescale li", function(ev) {
      _this.index = $(this).index();
      $(".menu")
        .css({
          left: ev.clientX + 4 - $(".sidebar-wrapper").width() + "px",
          top: ev.clientY + 4 - $(".header-wrap").height() + "px"
        })
        .fadeIn();
      return false;
    });
    // .on("mouseout", "#filescale ol", function() {
    //   $(".menu").fadeOut();
    // });
  },
  created() {
    //默认获取文件列表
    this.$store.dispatch("getImportTargetDisks");
    // .then(_ => {
    //   //默认获取文件状态
    //   this.$store
    //     .dispatch("getModifiedFiles")
    //     .then(_ => {
    //       this.loading = false;
    //     })
    //     .catch(_ => {
    //       this.loading = false;
    //     });
    // });

    // 连接服务器 用来接收文件状态
    // let wsk = new WebSocket("ws://127.0.0.1:5002");
    // wsk.onopen = function(event){
    //   console.log("连接建立成功"+this.readyState)
    // }
    // wsk.onmessage = function(ev){
    //   console.log(ev.data);
    //   //set treedata
    // }
    // wsk.onerror = function(ev){
    //   console.log(ev)
    // }
  },
  methods: {
    jumpToSearch(item) {
      //编程式导航
      this.$router.push(`/searchfiles?type=${item.serial_number}`);
      this.$store.dispatch("setDeviceAlias", item.alias);
      //设置序列号
      this.$store.dispatch("setSerialNumber", item.serial_number).then(res => {
        //设置根路径
        this.$store.dispatch("setRootPath", item.path).then(res => {
          //获取数据
          let serialNumber = item.serial_number;
          this.$store.dispatch("getDirTree", { serialNumber }).then(res => {
            //设置面包屑
            this.$store.dispatch("setNavBar", item).then(_ => {
              //重置fileInfo
              this.$store.dispatch("getFileInfo");
            });
          });
        });
      });
      // 文件历史纪录
      this.$store.dispatch("setGlobalHistory", true);
      this.$store.dispatch("resetTableClickHistory");
    },
    rename() {
      this.renameItem = this.fileList[this.index];
      this.modifiedAlias = this.fileList[this.index].alias;
      this.dialogVisible = true;
    },
    showMessage(message, type) {
      if (!this.isMessage) {
        this.isMessage = true;
        this.$message({
          message,
          duration: 1200,
          type: type || "info",
          onClose: _ => {
            this.isMessage = false;
          }
        });
      }
    },
    saveAlias() {
      if (this.modifiedAlias) {
        if (this.modifiedAlias === this.renameItem.alias) {
          this.dialogVisible = false;
        } else {
          let _this = this;
          let serialNumber = this.renameItem.serial_number;
          let path = this.renameItem.path;
          let newAlias = this.modifiedAlias;
          fetchData("rename", { serialNumber, path, newAlias })
            .then(_ => {
              let message = "";
              if (_.result) {
                message = "名称修改成功";
                _this.dialogVisible = false;
                this.$store.dispatch("getImportTargetDisks");
                this.$router.push("/filescale");
                this.$store.dispatch("setGlobalHistory", false);
                this.showMessage(message,'success');
              } else if (_.Error) {
                message = _.Error;
                this.showMessage(message);
              } else {
                message = "修改失败！该名称文件已存在！";
                this.showMessage(message);
              }
            })
            .catch(_ => {
              console.log("服务器异常");
              _this.dialogVisible = false;
              this.showMessage(message, "error");
            });
        }
      } else {
        this.modifiedAlias = this.renameItem.alias;
      }
    },
    del() {
      // TODO delete device
      this.$confirm(
        `此操作将永久删除 " ${this.fileList[this.index].alias} ", 确定删除?"`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          fetchData("deleteDisk", {
            serialNumber: this.fileList[this.index].serial_number,
            path: this.fileList[this.index].path,
            alias: this.fileList[this.index].alias
          }).then(() => {
            //删除成功重新获取设备列表 路由跳转到file主页
            this.$store.dispatch("getImportTargetDisks");
            // .then(_ => {
            //   this.$store.dispatch("getModifiedFiles");
            // });

            //删除状态
            // this.$store.dispatch("deleteSatatus", {
            //   serialNumber: this.listInfo.serial_number,
            //   path: this.listInfo.path
            // });

            // //reset file info && global history
            this.$store.dispatch("resetFileInfo");
            this.$store.dispatch("setGlobalHistory", false);

            if (!this.isMessage) {
              this.isMessage = true;
              this.$message({
                type: "success",
                message: "删除成功",
                duration: 1200,
                onClose: _ => {
                  this.isMessage = false;
                }
              });
            }
            this.$router.push("/files");
          });
        })
        .catch(_ => {});
    },
    addDevice() {
      this.$electron.ipcRenderer.send("addFile", {
        API: "open",
        URL: "/newfile/newdiskdir"
      });
    }
  },
  deactivated() {
    this.$store.dispatch("removeRightView", false);
  },
  activated() {
    this.$store.dispatch("removeRightView", true);
  },
  computed: {
    ...mapGetters(["fileList"])
  }
};
</script>

<style lang="scss" scoped>
#filescale {
  height: 100%;
  position: relative;
  .menu {
    width: 84px;
    border: 1px solid #eaeaea;
    position: absolute;
    display: none;
    p {
      font-size: 12px;
      line-height: 34px;
      padding: 0 10px;
      box-sizing: border-box;
      background-color: #fff;
      border-bottom: 1px solid #eaeaea;
      color: #333;
      cursor: pointer;
      &:last-child {
        border-bottom: none;
      }
      &:hover {
        background-color: #f5f5f5;
      }
      i {
        font-size: 12px;
        margin-right: 8px;
      }
    }
  }
  .no-data {
    text-align: center;
    margin-top: 172px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin-top: 24px;
      color: #a6afbf;
    }
    span {
      color: #386cca;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  i {
    font-size: 80px;
  }
  ol {
    display: flex;
    list-style: none;
    flex-flow: row wrap;
    justify-content: flex-start;
    padding: 34px;
    li {
      width: 120px;
      height: 120px;
      padding: 0 12px;
      margin-bottom: 20px;
      text-align: center;
      padding-top: 10px;
      cursor: pointer;
      box-sizing: border-box;
      border-radius: 10px;
      opacity: 0.9;
      // transition: 0.3s all ease;
      // &:hover {
      //   border:1px solid  #d1dbe5;
      // }
      &:hover img {
        background-color: #f5f5f5;
      }
      // &:hover p {
      //   color: #386cca;
      // }
      &:active img {
        border: 1px solid #999;
      }
      &:active p {
        color: #386cca;
      }
      img {
        transition: 0.3s all ease;
        width: 60px;
        height: 60px;
        display: inline-block;
        border-radius: 50%;
      }
      p {
        margin-top: 12px;
        font-size: 14px;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
