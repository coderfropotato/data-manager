<template>
  <div id="filescale">
      <ol v-if="fileList.length">
        <li @click="jumpToSearch(item)" v-for="(item,index) in fileList" :key="index">
          <img v-if="!item.isTelnet" src="../../../assets/images/computer.png" />
          <img v-else src="../../../assets/images/disk.png" />
          <p>{{item.alias}}</p>
        </li>
      </ol>
      <div v-if="!fileList.length" class="no-data">
        <p>您还没有添加任何设备，赶紧去<span @click="addDevice">添加</span>吧</p>
      </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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
      ]
    };
  },
  created() {
    //默认获取文件列表
    this.$store.dispatch("getImportTargetDisks")
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
    addDevice() {
      this.$electron.ipcRenderer.send("addFile", {
        API: "open",
        URL: "/newfile/newdiskdir"
      });
    }
  },
  computed: {
    ...mapGetters(["fileList"])
  }
};
</script>

<style lang="scss" scoped>
#filescale {
  height: 100%;
  .no-data {
    text-align: center;
    margin-top: 200px;
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
      margin-bottom: 20px;
      text-align: center;
      padding-top: 10px;
      cursor: pointer;
      box-sizing: border-box;
      border-radius: 10px;
      opacity: 0.9;
      &:hover {
        background: #386cca;
      }
      &:hover p {
        color: #fff;
      }
      img {
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
