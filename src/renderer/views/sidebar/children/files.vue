<template>
  <div id="directory-root">
      <div class="title">所有文件<i @click="addDevice" @mouseover="change = true;" @mouseout="change = false;" class="iconfont" :class="{'icon-tianjia':!change,'icon-tianjia-dianji':change}"></i></div>
      <div v-if="fileList.length" class="list">
        <ol :class="{'height-range':fileList.length>=5 && isShow}">
          <!-- icon-wodeyingpan -->
          <!-- <li @click="jumpToSearch(item.name)" v-for="(item,index) in fileList" :key="index"><i class="iconfont iconfile" :class="{'icon-wodeyingpan':item.isDisk,'icon-diannao':!item.isDisk}"></i>{{item.name}}</li> -->
          <li @contextmenu="contextmenu($event,item)" @click="jumpToSearch($event,item)" v-for="(item,index) in fileList" :key="index" :title="item.alias">
            <em class="iconfile iconfont " :class="{'icon-wodeyingpan':item.ismoveable,'icon-diannao':!item.ismoveable && !item.isTelnet,'icon-yuanchenglianjie':item.isTelnet}"></em>
            <div class="alias">{{item.alias}}</div>
            <i class="editDevice iconfont icon-gengduo"></i>
            <div class="edit-wrap">
              <p @click="rename">重命名</p>
              <p @click="del(index)">删除</p>
            </div>
            <!-- <edit-dom v-model="item.alias" @input="input"></edit-dom> -->
          </li>
        </ol>
        <p @click="isShow=true;" v-show="fileList.length>5 && !isShow">更多设备&nbsp;></p>
      </div>
      <p class="no-data" v-if="!fileList.length">暂无设备</p>
      <!-- <span @click.stop="del" id="delete" ref="del" v-show="deleteShow">删除</span> -->
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import bus from "@/utils/bus";
import $ from "jquery";
import fetchData from "@/api/getData";
export default {
  name: "AllFiles",
  data() {
    return {
      isShow: false,
      selectedIndex: 0,
      change: false,
      edit: true,
      isMessage: false
    };
  },
  computed: {
    ...mapGetters(["fileList"])
  },
  created() {
    document.addEventListener("click", () => {
      this.deleteShow = false;
    });
  },
  mounted() {
    $(document)
      .on("mouseover", ".editDevice", function() {
        $(this)
          .removeClass("icon-gengduo")
          .addClass("icon-gengduo-dianji");
      })
      .on("mouseout", ".editDevice", function() {
        $(this)
          .removeClass("icon-gengduo-dianji")
          .addClass("icon-gengduo");
      })
      .on("click", ".editDevice", function(ev) {
        $(this).addClass("icon-shouqi");
        $(this)
          .parent()
          .addClass("active");
          ev.stopPropagation();
      }).on('click',function(){
        $('#directory-root ol li').removeClass('active');
      })

  },
  methods: {
    input(...args) {
      console.log(args);
    },
    addDevice() {
      this.$electron.ipcRenderer.send("addFile", {
        API: "open",
        URL: "/newfile/newdiskdir"
      });
    },
    rename(){
      console.log('rename');
    },
    del(index) {
      // TODO delete device
      this.$confirm(`此操作将永久删除 " ${this.fileList[index].alias} ", 是否继续?"`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          fetchData("deleteDisk", {
            serialNumber: this.fileList[index].serial_number,
            path: this.fileList[index].path,
            alias: this.fileList[index].alias
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
    jumpToSearch($event, item) {
      if ($event.srcElement.localName !== "i") {
        // init translate
        $('#directory-root .list ol li').removeClass('active')
        //编程式导航
        this.$router.push(`/searchfiles?type=${item.serial_number}`);
        //设置序列号
        this.$store
          .dispatch("setSerialNumber", item.serial_number)
          .then(res => {
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
        this.$store.dispatch("resetTableClickHistory");
        // 文件有历史记录
        this.$store.dispatch("setGlobalHistory", true);
      }
    }
  }
};
</script>
<style lang="scss" scoped >
.router-link-exact-active {
  &.router-link-active {
    background: #386cca;
    color: #fff;
  }
}
#directory-root {
  height: 100%;
  width: 100%;
  font-size: 14px;
  color: #48576a;
  box-sizing: border-box;
  overflow-y: visible;

  span {
    cursor: pointer;
    width: 80px;
    height: 24px;
    text-align: center;
    line-height: 24px;
    background: #fff;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1000;
    border-radius: 4px;
    &:hover {
      background: #386cca;
      color: #fff;
    }
  }
  .title {
    display: flex;
    justify-content: space-between;
    padding: 0 18px;
    cursor: default;
    vertical-align: middle;
    i {
      cursor: pointer;
      line-height: 18px;
      margin-top: 1px;
    }
  }
  p {
    font-size: 12px;
    text-align: right;
    padding-right: 12px;
    margin-top: 12px;
    cursor: pointer;
    &:hover {
      color: #386cca;
    }
  }
  .no-data {
    text-align: center;
    font-size: 14px;
    cursor: default;
    margin-top: 40px;
    &:hover {
      color: #48576a;
    }
  }
  ol {
    margin-top: 12px;
    list-style: none;
    position: relative;
    height: 190px;
    overflow: hidden;
    &.height-range {
      height: 80%;
      overflow-y: scroll;
    }
    li {
      padding: 0 40px;
      height: 38px;
      line-height: 38px;
      cursor: pointer;
      transition: 0.3s all ease;
      display: flex;
      position: relative;
      .iconfile {
        margin-right: 12px;
      }
      &:hover {
        background: #d1dbe5;
      }
      &.active {
        transform: translateX(-138px);
      }
      & > .alias {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .editDevice {
        position: absolute;
        right: 18px;
        top: 11px;
        width: 16px;
        height: 16px;
        font-size: 16px;
        line-height: 1;
      }
      .edit-wrap {
        position: absolute;
        right: -120px;
        top: 0;
        height: 100%;
        width: 120px;
        transition: 0.3s all ease;
        display: flex;
        &.active {
          display: flex;
        }
        p {
          height: 100%;
          font-size: 12px;
          line-height: 38px;
          color: #333;
          padding: 0;
          margin: 0;
          flex: 1;
          text-align: center;
          color: #fff;
          &:hover {
            opacity: 0.8;
          }
          &:first-child {
            background: #5c8ce5;
          }
          &:last-child {
            background: #f74a4a;
          }
        }
      }
    }
  }
}
</style>

