<template>
  <div id="header">
      <div class="header-context">
        <div class="left">
          <img src="../assets/images/logo.png" alt="">
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
    return {
      status: "min"
    };
  },
  methods: {
    hide() {
      this.$electron.ipcRenderer.send("hide-window");
    },
    zoom() {
      if (this.status === "min") {
        this.$electron.ipcRenderer.send("show-window");
        this.status = "max";
      } else {
        this.$electron.ipcRenderer.send("orignal-window");
        this.status = "min";
      }
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
      -webkit-app-region: drag;
      img {
        width: 40px;
        height: 40px;
        margin-right: 20px;
        display: block;
        margin-top: 13px;
      }
      span {
        color: #fff;
        font-size: 18px;
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
        transition: .3s all ease;
        cursor: pointer;
        opacity: .4;
        margin-top: 3px;
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
