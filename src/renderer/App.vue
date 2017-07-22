<template>
  <div id="app">
    <el-row class="menu">
      <el-col :span="24">
        <div class="grid-content">Electron-Python 连接测试</div>
      </el-col>
    </el-row>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'data-manager-desktop'
  }
</script>

<style lang="scss">
  $height: 60px;

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }

  * {
    margin: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    text-decoration: none;
  }

  .menu {
  a {
    color: #fff;
  }
  font-size: 1.2em;
  height: $height;
  line-height: $height;
  color: #fff;
  background-color: #20a0ff;
  }
  .logout-button{
    color: #fff !important;
    font-size: inherit !important;
  }
</style>
