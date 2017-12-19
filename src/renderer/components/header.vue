<template>
  <div id="header">
      <div class="header-context">
        <div class="left">
          <!-- @click="root" -->
          <img src="../assets/images/logo.png" alt="" @dragstart="drag">
          <span>数据管理系统</span>
        </div>
        <ol class="right">
            <li @click="hide" title="最小化"></li>
            <li @click="zoom" title="切换大小"></li>
            <li @click="close" title="关闭"></li>
        </ol>
      </div>
      
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    drag(){
      return false;
    },
    root() {
      this.$router.push("./root");
      this.$store.dispatch('setGlobalNavIndex',0);
      this.$store.dispatch('setRouteStatus','root');
    },
    hide() {
      this.$electron.ipcRenderer.send("hide-window");
    },
    zoom() {
      this.$electron.ipcRenderer.send("change-window");
    },
    close() {
      this.$electron.ipcRenderer.send("window-all-closed");
    }
  }
};
</script>

<style lang="scss" scoped>
#header {
  .header-context {
    height: 66px;
    display: flex;
    background: #386cca;
    top: 0;
    left: 0;
    color: #fff;
    width: 100%;
    font-size: 18px;
    line-height: 66px;
    padding: 0 20px 0 30px;
    justify-content: space-between;
    .left {
      display: flex;
      flex: 1;
      img {
        width: 40px;
        height: 40px;
        margin-right: 20px;
        display: block;
        margin-top: 13px;
        // cursor: pointer;
      }
      span {
        color: #fff;
        font-size: 18px;
        flex: 1;
        -webkit-app-region: drag;
      }
    }
    .right {
      display: flex;
      list-style: none;
      height: 66px;
      li {
        flex: 1;
        width: 22px;
        margin-right: 16px;
        background-size: 16px 16px;
        background-repeat: no-repeat;
        background-position: center;
        transition: 0.1s all ease;
        cursor: pointer;
        opacity: 0.8;
        margin-top: 22px;
        height: 22px;
        &:first-child {
          background-image: url("../assets/images/hide.png");
        }
        &:nth-child(2) {
          background-image: url("../assets/images/zoom.png");
        }
        &:nth-child(3) {
          background-image: url("../assets/images/close.png");
        }
        &:hover {
          opacity: 1;
        }
      }
    }
  }
}
</style>
