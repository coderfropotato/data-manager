<template>
  <div id="directory-root">
      <div class="title">所有文件</span><i @click="addDevice" class="iconfont icon-tianjia"></i></div>
      <ol>
        <!-- icon-wodeyingpan -->
        <router-link v-for="(item,index) in deviceList" :key="index" tag="li" :to="{ path: '/searchfiles', query: { type: item.name }}" ><i class="iconfont iconfile" :class="{'icon-wodeyingpan':item.isDisk,'icon-diannao':!item.isDisk}"></i>{{item.name}}</router-link>
        <li>更多设备&nbsp;></li>
      </ol>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import bus from "@/utils/bus";

export default {
  name: "AllFiles",
  data() {
    return {
      deviceList: [
        {
          "name":"我的电脑",
          "isDisk":false
        },
        {
          "name":"我的磁盘",
          "isDisk":true
        }
      ],
      selectedIndex: 0
    };
  },
  computed: mapGetters([]),
  mounted() {},
  filters: {},
  methods: {
    addDevice(){
      this.$electron.ipcRenderer.send('addFile',{API:"open",URL:'/newfile/newdiskdir'})
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
      cursor:pointer;
      line-height: 18px;
    }
  }
  ol {
    margin-top: 12px;
    list-style: none;
    li {
      padding-left: 50px;
      height: 38px;
      line-height: 38px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      cursor: pointer;
      .iconfile{
        margin-right:12px;
      }
      &:hover {
        background: #386cca;
        color: #fff;
      }
      &.active {
        background: #386cca;
        color: #fff;
      }
      &:last-child {
        font-size: 12px;
        text-align: right;
        &:hover {
          background: #fff;
          color: #386cca;
        }
      }
    }
  }
}
</style>

