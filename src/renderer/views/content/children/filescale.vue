<template>
  <div id="filescale">
      <ol>
        <li @click="jumpToSearch(item)" v-for="(item,index) in fileList" :key="index">
          <img v-if="!item.isTelnet" src="../../../assets/images/computer.png" />
          <img v-else src="../../../assets/images/disk.png" />
          <p>{{item.alias}}</p>
        </li>
      </ol>
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
  methods: {
    jumpToSearch(item) {
      //编程式导航
      this.$router.push(`/searchfiles?type=${item.serial_number}`);
      //设置序列号
      this.$store.dispatch("setSerialNumber", item.serial_number).then(res => {
        //设置根路径
        this.$store.dispatch("setRootPath", item.path).then(res => {
          //重置fileInfo
          this.$store.dispatch('resetFileInfo');
          //获取数据
          let serialNumber = item.serial_number;
          this.$store.dispatch("getDirTree", { serialNumber }).then(res => {
            //设置面包屑
            this.$store.dispatch("setNavBar", item);
          });
        });
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
