<template>
  <div id="directory-root">
      <div class="title">所有文件</span><i @click="addDevice" class="iconfont icon-tianjia"></i></div>
      <ol :class="{'height-range':fileList.length>=5 && isShow}">
        <!-- icon-wodeyingpan -->
        <!-- <li @click="jumpToSearch(item.name)" v-for="(item,index) in fileList" :key="index"><i class="iconfont iconfile" :class="{'icon-wodeyingpan':item.isDisk,'icon-diannao':!item.isDisk}"></i>{{item.name}}</li> -->
        <li @click="jumpToSearch(item.alias,item.serial_number,item.path)" v-for="(item,index) in fileList" :key="index"><i class="iconfile iconfont icon-wodeyingpan"></i>{{item.alias}}</li>
      </ol>
      <p @click="isShow=true;" v-show="fileList.length>5 && !isShow">更多设备&nbsp;></p>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import bus from "@/utils/bus";

export default {
  name: "AllFiles",
  data() {
    return {
      isShow: false,
      selectedIndex: 0
    };
  },
  computed: {
    ...mapGetters(["fileList"])
  },
  mounted() {},
  filters: {},
  methods: {
    addDevice() {
      this.$electron.ipcRenderer.send("addFile", {
        API: "open",
        URL: "/newfile/newdiskdir"
      });
    },
    jumpToSearch(alias, serialNumber, path) {
      bus.$emit('reciveData');
      //编程式导航
      this.$router.push(`/searchfiles?type=${serialNumber}`);
      //设置面包屑
      this.$store.dispatch("setNavBar", alias);
      //设置序列号
      this.$store.dispatch("setSerialNumber", serialNumber);
      //设置根路径
      this.$store.dispatch("setRootPath", path).then(() => {
        //获取数据
        this.$store
          .dispatch("getDirTree", { type: "root", path, serialNumber })
          .then(() => {});
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
  .title {
    display: flex;
    justify-content: space-between;
    padding: 0 18px;
    i {
      cursor: pointer;
      line-height: 18px;
    }
  }
  p{
    font-size: 12px;
    text-align: right;
    padding-right:12px;
    margin-top:12px;
    cursor: pointer;
    &:hover{
      color:#386cca;
    }
  }
  ol {
    margin-top: 12px;
    list-style: none;
    position: relative;
    height:190px;
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
      &:first-child {
        &:hover {
          background: #fff;
          color: #386cca;
        }
      }
    }
  }
}
</style>

