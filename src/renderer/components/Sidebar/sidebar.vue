<template>
  <div id="sidebar-root">
    <div class="nav-menu" ref="navMenu">
      <el-col :span="24">
        <!--router 激活导航，以index为path-->
        <el-menu class="menu" router>
          <el-menu-item index="/files">
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
            <span>文件状态</span>
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
    <div class="line" ref="line"></div>

    <!--根据选择加载视图-->
    <div class="middle" ref="middle">
      <div class="middle-inner" ref="middleInner">
        <router-view></router-view>
      </div>
    </div>

    <div class="bottom" ref="bottom">
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
        },
        middleHeight: 400
      }
    },
    mounted () {
      this.setMiddleHeight()
      // 设置中间文件树区域的高度
      this.$refs.middle.style.height = this.middleHeight + 'px'
      // 当窗口大小发生改变时重新设置高度
      window.addEventListener('resize', () => {
        this.setMiddleHeight()
        this.$refs.middle.style.height = this.middleHeight + 'px'
      }, false)
    },
    methods: {
      openNewWindow (indexPath) {
        // 嵌套路由
        let url = '/newfile' + indexPath
        console.log(url)
        ipcRenderer.send('addFile', {
          API: 'open',
          URL: url,
          fileType: ''
        })
      },
      updateStyle () {
        if (this.$refs.middleInner.clientHeight > this.middleHeight) {
          console.log('ff')
          this.$refs.middle.style.overflowY = 'scroll'
        } else {
          console.log('dd')
          // this.$refs.middle.style.overflowY = 'visible'
        }
      },
      setMiddleHeight () {
        this.middleHeight = window.innerHeight -
          this.$refs.navMenu.clientHeight -
          this.$refs.line.clientHeight -
          this.$refs.bottom.clientHeight -
          32
      }
    }
  }
</script>
<!--分离SCSS文件-->
<style src="../../assets/SCSS/sidebar.scss" lang="scss" scoped></style>
