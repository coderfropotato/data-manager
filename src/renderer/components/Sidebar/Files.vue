<template>
  <div id="fileDirectory-root">
    <div class="allFiles">
      <div class="title">
        <span>所有文件</span>
        <el-button size="mini" @click="trigShow" data-name="allFiles">{{content.allFiles}}</el-button>
        <el-button size="mini" class="button-inner-plus" @click="openNewDirWin">+</el-button>
      </div>
      <div class="disks" v-show="show.allFiles">
        <!--遍历后台传送的磁盘数组，默认第一个为我的电脑-->
        <div class="disk" v-for="(disk, index) in diskDir">
          <!--根据index设置不同的 Icon-->
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-diannao" v-if="!index"></use>
            <use xlink:href="#icon-harddisk" v-if="index"></use>
          </svg>
          <div class="item-title" @click="loadDiskFileTree(index)">
            <el-button type="text">
              {{disk | formatDiskName}}
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="sortFiles">
      <div class="title">
        <span>分类</span>
        <el-button size="mini" @click="trigShow" data-name="sortFiles">{{content.sortFiles}}</el-button>
        <!--输入新建分类的文件名-->
        <el-popover
            ref="addSortPop"
            placement="top-start"
            width="200"
            trigger="click">
          <el-input placeholder="请输入文件夹名称" v-model="newSortDirName"></el-input>
          <el-button type="primary" @click="appendNode">添加</el-button>
        </el-popover>
        <el-button size="mini" class="button-inner-plus" v-popover:addSortPop>+</el-button>
      </div>
      <div v-for="(item,index) in smartSortList" :key="item" class="smartSortList">
        <el-button size="small" @click="showSmartSort" type="text">{{item}}</el-button>
      </div>
      <el-tree
          :data="sortFileTree"
          node-key="id"
          highlight-current
          :expand-on-click-node="false"
          @node-click="loadSortFileList"
          @node-expand="treeHeightChanged"
          @node-collapse="treeHeightChanged"
          v-show="show.sortFiles"
          :render-content="renderContent">
      </el-tree>

    </div>
    <div class="others">
      <div class="title">
        <span>其他</span>
        <el-button size="mini" @click="trigShow" data-name="others">{{content.others}}</el-button>
      </div>
      <div class="other-item" v-show="show.others">
        <div class="trash">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-huishouzhan"></use>
          </svg>
          <div class="item-title" @click="loadTrashContent">
            <el-button type="text">
              回收站
            </el-button>
          </div>
        </div>
        <div class="ignore">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-wenjian1"></use>
          </svg>
          <div class="item-title" @click="loadIgnoreContent">
            <el-button type="text">
              忽略
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import {mapState} from 'vuex'
  import bus from '@/assets/JS/bus'
  import {ipcRenderer} from 'electron'

  export default {
    name: 'AllFiles',
    data () {
      return {
        // count: 1,
        // 控制面板折叠与展开
        show: {
          allFiles: true,
          sortFiles: true,
          others: true
        },
        // 折叠或展开按钮的状态
        content: {
          allFiles: '收起',
          sortFiles: '收起',
          others: '收起'
        },
        // 记录当前选中的高亮节点，用于添加新节点时定位父节点
        currentNode: {},
        newSortDirName: '新建分类',
        rowFileTree: [],
        // 记录列表第几页（分类）
        page: 0,
        // 一次请求加载多少条数据（分类）
        size: 50,
        // 防止多次请求的标志，每次接到加载内容的消息后，置此标志为0，数据加载完成后再置为1
        loadFlag: 1
      }
    },
    computed: mapState({
      // 所有文件选项的数据，即管理的磁盘
      diskDir: state => state.files.allFiles,
      // 智能分类列表
      smartSortList: state => state.files.smartSortList,
      // 分类文件夹树
      sortFileTree: state => state.files.sortFileTree,
      currentPath: state => state.files.currentPath
    }),
    mounted () {
      // 重置列表数据，防止和搜索组件数据混合
      this.$store.commit('setFileList', [])
      // 插入文件小图标
      // this.insertFileIcon()
      // 接受 sidebar 加弹窗的新建分类
      bus.$on('newSort', () => {
        this.appendNode()
      })
      // 接受加载更多内容的通知
      bus.$on('load-content', () => {
        if (this.loadFlag) {
          this.loadFlag = 0
          this.loadMoreContent()
        }
      })
    },
    filters: {
      formatDiskName (name) {
        if (name !== undefined) {
          let index = name.indexOf('*')
          if (index > -1) {
            return name.substr(0, index)
          } else {
            return name
          }
        }
      }
    },
    methods: {
      // 插入文件Icon
      insertFileIcon () {
        let Icon = '<svg class="icon" aria-hidden="true">\n' + '<use xlink:href="#icon-wenjian"></use>\n' + '</svg>'
        let downIcon = $('.el-tree-node__expand-icon')
        $(Icon).insertAfter(downIcon)
        $('.el-tree-node__content > .icon')
          .css('font-size', '1.2em')
          .css('margin-right', '0.5em')
          .css('vertical-align', '-0.25em')
      },
      // 文件夹展开或收起
      trigShow (e) {
        let dir
        if ($(e.target).data('name')) {
          dir = $(e.target).data('name')
          // 收起
          if (this.show[dir]) {
            this.content[dir] = '展开'
          } else {
            // 展开
            this.content[dir] = '收起'
          }
          this.show[dir] = !this.show[dir]
        } else if ($(e.target).parent().data('name')) {
          dir = $(e.target).parent().data('name')
          if (this.show[dir]) {
            this.content[dir] = '展开'
          } else {
            this.content[dir] = '收起'
          }
          this.show[dir] = !this.show[dir]
        }
      },
      // 加载忽略的内容
      loadIgnoreContent () {
        this.$router.push('/files/ignore')
        this.$store.dispatch('getIgnore')
        // 重置列表数据，防止和搜索组件数据混合
        this.$store.commit('setFileList', [])
        this.$store.commit('setCurrentPath', '忽略/')
        // 加载动画
        bus.$emit('loading-content')
      },
      // 加载回收站的内容
      loadTrashContent () {
        let routerPath = this.$router.currentRoute.fullPath
        if (routerPath !== '/files/list') {
          this.$router.push('/files/list')
        }
        this.$store.dispatch('getTrash')
        // 重置列表数据，防止和搜索组件数据混合
        this.$store.commit('setFileList', [])
        this.$store.commit('setCurrentPath', '回收站/')
        // 加载动画
        bus.$emit('loading-content')
      },

      // 加载磁盘（包含我的电脑）文件树
      loadDiskFileTree (index) {
        let serialNumber
        // 获取路径，去除磁盘path中的 * 和序列号
        let path = this.diskDir[index]
        if (path.indexOf('*') > -1) {
          let tempPath = path.split('*')
          path = tempPath[0]
        }
        path = path + '/'

        if (index === 0) {
          serialNumber = 'myComputer'
        } else {
          serialNumber = this.diskDir[index].split('*').pop()
        }
        this.$store.dispatch('getDiskFileTree', serialNumber)
        this.$router.push('/files/diskdirectory')
        this.$store.commit('setCurrentPath', path)
        // 加载动画
        bus.$emit('loading-content')
      },

      // 用户点击侧边栏分类树，加载分类文件列表
      loadSortFileList (nodeObj, node) {
        // 重置文件列表数组
        this.$store.commit('setFileList', [])
        this.page = 0
        this.loadFlag = 1
        // 获取当前的路由信息，进行重定向
        let routerPath = this.$router.currentRoute.fullPath
        if (routerPath !== '/files/list') {
          this.$router.push('/files/list')
        }
        // 获取当前节点，为添加节点提供父节点信息
        let path = nodeObj.id
        this.currentNode = {
          nodeObj,
          node
        }
        // 根据用户的选择，设置状态管理中的当前路径
        this.$store.commit('setCurrentPath', path)
        // 发送获取文件列表请求
        // 对路径进行处理，去除路径最后的一个 /
        let tempPath = path.split('/')
        tempPath.pop()
        let lastPath = tempPath.join('/')
        this.$store.dispatch({
          type: 'getSortFileList',
          lastPath,
          size: this.size,
          page: this.page++
        }).then(isLastPage => {
          this.loadFlag = 1
          bus.$emit('loading-end')
          // 如果是最后一页
          if (isLastPage) {
            this.$message({
              type: 'warning',
              message: '没有更多内容了',
              duration: 4000,
              showClose: true
            })
            this.loadFlag = 0
          }
        })
        // 加载动画
        bus.$emit('loading-content')
      },

      // 下拉，自动加载文件列表
      loadMoreContent () {
        // 开启加载动画
        bus.$emit('loading-content')
        let path = this.currentPath.split('/')
        path.pop()
        // 发送加载请求
        this.$store.dispatch({
          type: 'getSortFileList',
          lastPath: path.join('/'),
          size: this.size,
          page: this.page++
        }).then(isLastPage => {
          // 置加载标志为 1，可以进行下一内容加载
          setTimeout(() => {
            this.$nextTick(() => {
              this.loadFlag = 1
              // 加载动画结束
              bus.$emit('loading-end')
            })
          }, 1000)
          // 如果是最后一页
          if (isLastPage) {
            this.$message({
              type: 'warning',
              message: '没有更多内容了',
              duration: 4000,
              showClose: true
            })
            this.loadFlag = 0
          }
        })
      },

      // 当节点展开或关闭时，树的高度会发生变化，需要发出相关事件，通知 sidebar 组件改变scrollbar样式
      treeHeightChanged () {
        // 会触发MaxListenersExceededWarning 错误
        // TODO 解决当点击展开与收起次数过多时触发 MaxListenersExceededWarning
        bus.$emit('tree-height-changed')
      },

      // 打开新建目录窗口
      openNewDirWin () {
        ipcRenderer.send('addFile', {
          API: 'open',
          URL: '/newfile/newdiskdir'
        })
      },

      // 在当前选中节点下添加新的节点，如果没有选中，则新建一个分类树
      appendNode () {
        // 父节点信息
        let node = this.currentNode.node
        let nodeObj = this.currentNode.nodeObj
        console.log(node)
        // 判断父节点是否存在，即是否选中节点
        if (node) {
          // 判断文件夹名是否重复
          let set = new Set(nodeObj.children)
          if (set.size < nodeObj.children.length) {
            console.log('文件名重复')
            return
          }
          // 获取新建节点的 ID，即路径
          let nodeId = nodeObj.id + this.newSortDirName + '/'
          let data = {
            label: this.newSortDirName,
            id: nodeId,
            children: []
          }
          // 调用源代码中的方法增加节点，单是不会更新源数据（非API）
          node.store.append(data, nodeObj)
        } else {
          // 直接在源数据中添加新节点
          let data = {
            label: this.newSortDirName,
            id: this.newSortDirName,
            children: [],
            inputShow: 'none',
            labelShow: 'inline-block'
          }
          this.$store.commit('addSortDirectory', data)
        }
      },

      // 删除节点
      removeNode (node, data) {
        // 调用源代码中的方法删除节点，单是不会更新源数据（非API）
        node.store.remove(data)
      },

      // 确认编辑节点的结果
      confirmEditNode (node, data) {
        console.log(node.data.label)
      },

      // 树节点渲染函数 vue-render
      renderContent (h, {node, data, store}) {
        return h(
          'span',
          [
            h(
              'span',
              {
                style: {
                  display: data.labelShow
                }
              },
              [node.label]
            ),
            // 删除按钮
            h(
              'span',
              {
                attrs: {
                  class: 'icon-wrapper'
                },
                on: {
                  click: (e) => {
                    e.preventDefault()
                    this.removeNode(node, data)
                  }
                }
              },
              [
                h(
                  'i',
                  {
                    attrs: {
                      class: 'el-icon-delete'
                    }
                  }
                )
              ]
            ),
            // 编辑按钮
            h(
              'span',
              {
                attrs: {
                  class: 'icon-wrapper'
                },
                on: {
                  click: (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    data.labelShow = 'none'
                    data.inputShow = 'inline-block'
                    this.$store.commit('setTreeNode', node)
                    this.$store.commit('toggleTreeNodeDisplay', 'inline-block', 'none')
                  }
                }
              },
              [
                h(
                  'i',
                  {
                    attrs: {
                      class: 'el-icon-edit'
                    }
                  }
                )
              ]
            ),
            h(
              'el-input',
              {
                style: {
                  display: data.inputShow
                },
                on: {
                  blur: e => {
                    e.stopPropagation()
                    e.preventDefault()
                    data.labelShow = 'inline-block'
                    data.inputShow = 'none'
                    data.label = e.target.value
                    this.confirmEditNode(node, data)
                  }
                },
                attrs: {
                  value: data.label
                }
              }
            )
          ])
      },
      showSmartSort (e) {
        let tableName = e.target.innerText
        let select = {}
        console.log(tableName)
        // 当点击一个新的智能视图时，smartSort数组会置空，重新向里面push数据
        this.$store.commit('setSmartSort')
        this.$store.dispatch('showSmartSort', {
          'tableName': tableName,
          'select': select
        })
        this.$router.push('/smartSort')
      }
    }
  }
</script>

<style lang="scss">
  #fileDirectory-root {
    margin: 0 2em 0 1.5em;
    .title {
      margin: 0.5em 0;
      span {
        font-size: 0.8em;
        margin: 0 1em;
      }
      .el-button {
        float: right;
        margin: 0 0.5em;
      }
      .el-button:nth-child(2) {
        width: 4em;
      }
    }

    .disk,
    .trash,
    .ignore {
      height: 2.4em;
      line-height: 2.4em;
      .icon {
        float: left;
        font-size: 1em;
        margin: 0.5em 0.5em 0.5em 1.5em;
      }
      .item-title {
        font-size: 0.8em;
        float: left;
      }
    }

    .el-tree {
      background-color: inherit;
      border: none;
      margin: 0.3em 1em;
      .el-tree-node__expand-icon{
        border: 8px solid transparent;
        border-left-color: #97a8be;
        border-left-width: 8px;
      }
      .el-tree-node__expand-icon.is-leaf{
        border-color: transparent;
        cursor: default;
      }
      // 删除小图标
      .icon-wrapper {
        display: inline-block;
        float: right;
        width: 2em;
        height: 2em;
        opacity: 0;
        line-height: 36px;
        cursor: pointer;
        &:hover {
          opacity: 1;
        }
      }
    }

    .el-button--text {
      color: #000;
    }
    //按钮中字体大小
    .el-button {
      span {
        font-size: 1em;
        margin: 0.6em;
      }
    }
    .button-inner-plus {
      span {
        margin: 0 0.2em;
      }
    }
    .smartSortList {
      .el-button {
        margin: 1em 0 0 4em;
        width: 10em;
      }
    }
  }

  // 新建文件夹弹窗
  .el-popover {
    width: 15em;
    .el-button {
      width: 4em;
      float: right;
    }
    .el-input {
      float: left;
      width: 10em;
    }
  }

  // 节点问题
  .el-tree-node {
    .el-input {
      display: none;
      width: 80%;
      input {
        border: none;
        // background-color: inherit;
        padding: 0;
        font-size: 1.1em;
      }
    }
  }
</style>
