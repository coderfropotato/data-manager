<template>
  <div id="sidebar-root">
    <div class="nav-menu">
      <el-col :span="24">
        <el-menu class="menu" @select="showContent">
          <el-menu-item index="allfiles">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhuye"></use>
            </svg>
            <span>文件</span>
          </el-menu-item>
          <el-menu-item index="search">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-sousuo"></use>
            </svg>
            <span>搜索</span>
          </el-menu-item>
          <el-menu-item index="recentimport">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-import"></use>
            </svg>
            <span>最近导入</span>
          </el-menu-item>
          <el-menu-item index="collection">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shoucang"></use>
            </svg>
            <span>收藏</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </div>
    <div class="line"></div>
    <!--根据选择加载视图-->
    <div class="bottom">
      <router-view></router-view>
      <!--<div class="bar"></div>-->
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Sidebar',
    methods: {
      showContent (indexPath) {
        this.$router.push({path: indexPath})
      }
    }
  }
</script>
<style lang="scss" scoped>
  $backgroundColor: #F7F9F9;
  #sidebar-root {
    background-color: $backgroundColor;
    height: 100%;
    .nav-menu {
      overflow: hidden;
      .el-menu {
        background-color: $backgroundColor;
      }
    }
  }

  .el-menu-item {
    font-size: 1em;
    padding-left: 2em !important;
    span {
      margin-left: 0.3em;
    }
    .icon {
      position: relative;
      font-size: 1.5em;
      display: inline-block;
    }
  }

  .line {
    height: 1px;
    width: 90%;
    background-color: #48576a;
    margin: 1em auto;
  }

  .bottom{
    position: relative;
    width: 100%;
    .bar{
      position: absolute;
      right: 0.1em;
      top: 0;
      width: 8px;
      height: 5em;
      background-color: #48576a;
    }
    .wrapper{
      width: 300px;
      height: 300px;
    }
  }
</style>
