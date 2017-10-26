<template>
  <div id="header">
      <div class="left">
          <img src="../assets/images/logo.png" alt="">
            <span>数据管理系统</span>
      </div>
      <div class="right">
          <span @click="hide"></span>
          <span @click="zoom"></span>
          <span @click="close"></span>
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
        this.status = 'max';
      }else{
          this.$electron.ipcRenderer.send("orignal-window")
          this.status = 'min';
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
  -webkit-app-region: drag;
  .left {
    display: flex;
    img {
      width: 40px;
      height: 40px;
      margin-right: 20px;
      display: block;
      margin-top: 13px;
    }
  }
  .right {
    height: 26px;
    overflow: hidden;
    margin-top: 24px;
    span {
      width: 18px;
      height: 18px;
      margin-right: 16px;
      float: left;
      background-size: 100% 100%;
      background-repeat: none;
      background-position: center;
      cursor: pointer !important;
      margin-top: 3px;
      transition: 0.2s all ease;
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
        transform: scale(1.2);
      }
    }
  }
}
</style>
