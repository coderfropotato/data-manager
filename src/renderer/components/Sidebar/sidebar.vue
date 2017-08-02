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
  import bus from '@/assets/JS/bus'
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
        // TODO：无法使用计算属性，不能响应窗口大小变化，未来可做更深的考虑
        middleHeight: 400
      }
    },
    mounted () {
      this.updateStyle()
      // 设置中间文件树区域的高度
      this.setMiddleHeight()
      this.$refs.middle.style.height = this.middleHeight + 'px'

      // 当窗口大小发生改变时重新设置高度
      window.addEventListener('resize', () => {
        this.setMiddleHeight()
        this.$refs.middle.style.height = this.middleHeight + 'px'
      }, false)

      // 等文件树展开完成后再获取高度
      bus.$on('tree-height-changed', () => {
        setTimeout(() => {
          this.updateStyle()
        }, 500)
      })
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
      // 更新滚动样式
      updateStyle () {
        if (this.$refs.middleInner.clientHeight > this.middleHeight) {
          this.$refs.middle.style.overflowY = 'overlay'
        } else {
          this.$refs.middle.style.overflowY = 'hidden'
        }
      },
      // 计算并设置中间区域的高度
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
    font-size: 0.9em;
    padding-left: 2em !important;
    span {
      margin-left: 0.3em;
    }
    .icon {
      position: relative;
      font-size: 1.4em;
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
    // 避免滚动条影响宽度，只在webkit内核中器作用
    -webkit-overflow-y: overlay;
    // 隐藏滚动条
    /*&::-webkit-scrollbar {*/
    /*display: none;*/
    /*}*/
  }

  .bottom {
    position: absolute;
    transform: translateY(0.5em);
    bottom: 0;
    left: 0;
    background-color: inherit;
    border-top: 1px solid #8c939d;
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
    .el-menu-item {
      font-size: 1.2em;
      padding-left: 1em !important;
    }
  }
</style>
