<template>
  <div id="sidebar-root" v-loading.fullscreen.lock="fullScreenLoading">
    <!--固定加载区域-->
    <div class="nav-menu" ref="navMenu">
      <el-col :span="24">
        <!--router 激活导航，以index为path-->
        <el-menu class="menu" router>
          <el-menu-item index="/files" @click="openFile">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhuye"></use>
            </svg>
            <span>文件</span>
          </el-menu-item>
          <el-menu-item index="/search?type=search">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-sousuo"></use>
            </svg>
            <span>搜索</span>
          </el-menu-item>
          <el-menu-item index="/filestatus">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-import"></use>
            </svg>
            <!--角标，提醒文件更改数量，最大99-->
            <el-badge :value="modifiedFiles" :max="99" class="item">
              <span>文件状态</span>
            </el-badge>
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

    <!--根据选择加载组件-->
    <div class="middle" ref="middle">
      <div class="middle-inner" ref="middleInner">
        <!--默认路由，和 content.vue 的命名路由共同组成基本的路由管理-->
        <router-view></router-view>
      </div>
    </div>

    <!--添加目录，点击打开新的窗口-->
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
      <!--添加文件按钮，点击弹出窗口-->
      <el-button type="text" class="add" v-popover:popoverAdd>+</el-button>
      <!-- TODO 设置功能，未实现-->
      <svg class="icon" aria-hidden="true" style="display: none;">
        <use xlink:href="#icon-setting"></use>
      </svg>
    </div>
  </div>
</template>

<script>
  import {ipcRenderer} from 'electron'
  import bus from '@/utils/bus'
  import {mapGetters} from 'vuex'

  export default {
    name: 'Sidebar',
    data () {
      return {
        // 加号弹窗列表内容
        newDirList: {
          1: {
            title: '新增数据目录',
            url: '/newdiskdir'
          },
          2: {
            title: '新增分类',
            url: '/newcategorydir'
          },
          3: {
            title: '新增智能分类',
            url: '/newsmartsortdir'
          },
          4: {
            title: '从Excel模板导入文件',
            url: '/excelimport'
          }
          // TODO 未实现功能
//          4: {
//            title: '从搜索结果新建分类',
//            url: '/newsortformsearch'
//          },
//          5: {
//            title: '从搜索结果新建智能分类',
//            url: '/newsamrtsortformsearch'
//          }
        },
        // TODO：无法使用计算属性，不能响应窗口大小变化，未来可做更深的考虑
        middleHeight: 400,
        // 加载动画
        fullScreenLoading: false
      }
    },
    computed: mapGetters({
      // 更改的文件数量，文件状态的角标
      modifiedFiles: 'modifiedNum'
    }),
    mounted () {
      // 判断目录区域是否需要滚动
      this.updateStyle()
      // 设置中间文件树区域的高度
      this.setMiddleHeight()
      this.$refs.middle.style.height = this.middleHeight + 'px'

      // 当窗口大小发生改变时重新设置高度
      window.addEventListener('resize', () => {
        this.setMiddleHeight()
        this.$refs.middle.style.height = this.middleHeight + 'px'
      }, false)

      // 如果请求出现错误，结束加载动画
      bus.$on('error', () => {
        this.fullScreenLoading = false
      })

      // 等文件树展开完成后再获取高度
      bus.$on('tree-height-changed', () => {
        setTimeout(() => {
          this.updateStyle()
        }, 500)
      })
    },
    methods: {
      // 打开新的窗口
      openNewWindow (indexPath) {
        // 新建分类选项不打开新的窗口
        if (indexPath === '/newcategorydir') {
          bus.$emit('newCategory')
        } else {
          // 嵌套路由
          let url = '/newfile' + indexPath
          ipcRenderer.send('addFile', {
            API: 'open',
            URL: url
          })
        }
      },
      // 更新文件目录区域滚动样式
      updateStyle () {
        if (this.$refs.middleInner.clientHeight > this.middleHeight) {
          this.$refs.middle.style.overflowY = 'overlay'
        } else {
          this.$refs.middle.style.overflowY = 'hidden'
        }
      },
      // 计算并设置中间区域（文件目录）的高度
      setMiddleHeight () {
        this.middleHeight = window.innerHeight -
          this.$refs.navMenu.clientHeight -
          this.$refs.line.clientHeight -
          this.$refs.bottom.clientHeight -
          32
      },
      // 获取文件
      openFile () {
        // this.fullScreenLoading = true
        // 手动点击时，如果已存在数据，则不再次请求数据（其他有新数据产生的情况下，需调用action请求）
        if (this.$store.state.files.allFiles.length && Object.keys(this.$store.state.files.sortDirRowData).length) {
          this.fullScreenLoading = false
        } else {
          this.$store.dispatch('openFile').then(() => {
            this.fullScreenLoading = false
          })
        }
      }
    }
  }
</script>
<style lang="scss">
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
    // 文件更改状态角标样式
    .el-badge__content {
      top: 1em;
      right: 4px;
    }
  }
</style>
