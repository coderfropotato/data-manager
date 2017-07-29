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
    <div class="middle">
      <router-view></router-view>
      <!--<div class="bar"></div>-->
    </div>
    <div class="bottom">
      <el-popover
          ref="popoverAdd"
          placement="right"
          width="200"
          trigger="click">
        <el-menu>
          <el-menu-item v-for="(item, index) in addList" :key="item" :index="index" @click="openNewWindow">{{item}}
          </el-menu-item>
        </el-menu>
      </el-popover>
      <el-button type="text" class="add" v-popover:popoverAdd>+</el-button>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-setting"></use>
      </svg>
    </div>
  </div>
</template>
<script>
  import {ipcRenderer} from 'electron'

  export default {
    name: 'Sidebar',
    data () {
      return {
        addList: {
          1: '新增数据目录',
          2: '新增分类',
          3: '新增智能分类',
          4: '从搜索结果新建分类',
          5: '从搜索结果新建智能分类'
        }
      }
    },
    methods: {
      showContent (indexPath) {
        this.$router.push({path: indexPath})
      },
      openNewWindow () {
        ipcRenderer.send('addFile', {
          API: 'open',
          URL: '/addremotefile',
          fileType: ''
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  $backgroundColor: #F7F9F9;
  #sidebar-root {
    position: relative;
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

  .middle {
    position: relative;
    width: 100%;
    .bar {
      position: absolute;
      right: 0.1em;
      top: 0;
      width: 8px;
      height: 5em;
      background-color: #48576a;
    }
    .wrapper {
      width: 300px;
      height: 300px;
    }
  }

  .bottom {
    position: absolute;
    transform: translateY(0.5em);
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4em;
    line-height: 4em;
    .el-button {
      position: absolute;
      bottom: 0.4em;
      left: 1em;
      font-size: 2em;
    }
    .icon {
      position: absolute;
      bottom: 1em;
      right: 1em;
      font-size: 1.5em;
    }
  }

  .el-popover {
    padding: 0 !important;
    .el-menu-item {
      font-size: 1.2em;
      padding-left: 1em !important;
    }
  }
</style>
