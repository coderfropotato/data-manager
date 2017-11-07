<template>
  <div id="directory-root">
      <div class="title">所有文件</span><i @click="addDevice" class="iconfont icon-tianjia"></i></div>
      <ol :class="{'height-range':fileList.length>=5 && isShow}">
        <!-- icon-wodeyingpan -->
        <!-- <li @click="jumpToSearch(item.name)" v-for="(item,index) in fileList" :key="index"><i class="iconfont iconfile" :class="{'icon-wodeyingpan':item.isDisk,'icon-diannao':!item.isDisk}"></i>{{item.name}}</li> -->
        <li @contextmenu="contextmenu($event,item)" @click="jumpToSearch(item)" v-for="(item,index) in fileList" :key="index"><i class="iconfile iconfont icon-wodeyingpan"></i>{{item.alias}}</li>
      </ol>
      <p @click="isShow=true;" v-show="fileList.length>5 && !isShow">更多设备&nbsp;></p>
      <span @click="del" id="delete" ref="del" v-show="deleteShow">删除</span>
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
      deleteShow: false,
      isShow: true,
      selectedIndex: 0,
      listInfo: {} //当前设备信息
    };
  },
  computed: {
    ...mapGetters(["fileList"])
  },
  created(){
    document.addEventListener('click',()=>{
      this.deleteShow = false;
    })
  },
  methods: {
    addDevice() {
      this.$electron.ipcRenderer.send("addFile", {
        API: "open",
        URL: "/newfile/newdiskdir"
      });
    },
    contextmenu(e, item) {
      let top = e.target.offsetTop;
      $("#delete").css({ left: 110, top: top +40 });
      this.deleteShow = true;
      this.listInfo = item;
    },
    del() {
      this.deleteShow = false;
      // TODO delete device
      this.$confirm("此操作将永久删除"+this.listInfo.alias+", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          fetchData("deleteDisk", {
            serialNumber: this.listInfo.serial_number,
            path: this.listInfo.path
          }).then(() => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            //删除成功重新获取设备列表 路由跳转到file主页
            this.$store.dispatch('getImportTargetDisks');
            this.$router.push('/files');
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    jumpToSearch(item) {
      //编程式导航
      this.$router.push(`/searchfiles?type=${item.serial_number}`);
      //设置序列号
      this.$store.dispatch("setSerialNumber", item.serial_number).then(res => {
        //设置根路径
        this.$store.dispatch("setRootPath", item.path).then(res => {
          //重置fileInfo
          this.$store.dispatch("resetFileInfo");
          //获取数据
          let serialNumber = item.serial_number;
          this.$store.dispatch("getDirTree", { serialNumber }).then(res => {
            //设置面包屑
            this.$store.dispatch("setNavBar", item);
          });
        });
      });
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
    i {
      cursor: pointer;
      line-height: 18px;
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
      padding-left: 50px;
      height: 38px;
      line-height: 38px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      cursor: pointer;
      .iconfile {
        margin-right: 12px;
      }
      &:hover {
        background: #386cca;
        color: #fff;
      }
      &.active {
        background: #386cca;
        color: #fff;
      }
    }
  }
}
</style>

