<template>
  <div id="sidebar-root">
    <div class="nav-menu">
      <el-col :span="24">
        <el-menu class="menu" @select="showContent">
          <el-menu-item index="/allfiles">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhuye"></use>
            </svg>
            <span>文件</span>
          </el-menu-item>
          <el-menu-item index="/search">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-sousuo"></use>
            </svg>
            <span>搜索</span>
          </el-menu-item>
          <el-menu-item index="/recentimport">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-import"></use>
            </svg>
            <span>最近导入</span>
          </el-menu-item>
          <el-menu-item index="/collection">
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
        <el-menu @select="openNewWindow">
          <el-menu-item
              v-for="(item, index) in newDirList"
              :key="item.title" :index="item.url">
            {{item.title}}
          </el-menu-item>
        </el-menu>
      </el-popover>
      <!--添加文件按钮 这里IDE可能会显示红色-->
      <el-button type="text" class="add" v-popover:popoverAdd>+</el-button>
      <!--设置-->
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
        newDirList: {
          1: {
            title: '新增数据目录',
            url: '/newdiskdir'
          },
          2: {
            title: '新增分类',
            url: '/newsortdir'
          },
          3: {
            title: '新增智能分类',
            url: '/newsmartsortdir'
          },
          4: {
            title: '从搜索结果新建分类',
            url: '/newsortformsearch'
          },
          5: {
            title: '从搜索结果新建智能分类',
            url: '/newsamrtsortformsearch'
          }
        }
      }
    },
    methods: {
      showContent (indexPath) {
        let path = indexPath
        this.$router.push({path: path})
      },
      openNewWindow (indexPath) {
        // 嵌套路由
        let url = '/newfile' + indexPath
        console.log(url)
        ipcRenderer.send('addFile', {
          API: 'open',
          URL: url,
          fileType: ''
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/SCSS/sidebar";
</style>
