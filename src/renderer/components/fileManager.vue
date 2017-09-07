<template>
  <div id="fileManager-root">

    <!--所有文件-->
    <div class="allFiles">
      <div class="title">
        <!--角标-->
        <el-badge :value="badgeData.allFiles" :hidden="!hasBadge">
          <span>所有文件</span>
        </el-badge>
        <el-button size="mini" @click="trigShow" data-name="allFiles">{{content.allFiles}}</el-button>
        <el-button size="mini" class="button-inner-plus" @click="openNewDirWin" v-if="hasNewButton">+</el-button>
      </div>
      <div class="disks" v-show="show.allFiles">
        <!--遍历后台传送的磁盘数组，默认第一个为我的电脑-->
        <div class="disk" v-for="(disk, index) in allFiles">
          <!--根据index设置不同的 Icon-->
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-diannao" v-if="!index"></use>
            <use xlink:href="#icon-harddisk" v-if="index"></use>
          </svg>
          <div class="item-title" @click="diskEvent(index)">
            <el-button type="text">
              {{disk | formatDiskName}}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!--分类-->
    <div class="categoryFiles">
      <div class="title">
        <!--角标-->
        <el-badge :value="badgeData.categoryFiles" :hidden="!hasBadge">
          <span>分类</span>
        </el-badge>
        <el-button size="mini" @click="trigShow" data-name="categoryFiles">{{content.categoryFiles}}</el-button>
        <!--输入新建分类的文件名-->
        <el-popover
            ref="addSortPop"
            placement="top-start"
            width="200"
            trigger="click">
          <el-input placeholder="请输入文件夹名称" v-model="newCategoryDirName"></el-input>
          <el-button type="primary" @click="appendNode">添加</el-button>
        </el-popover>
        <el-button size="mini" class="button-inner-plus" v-popover:addSortPop v-if="hasNewButton">+</el-button>
      </div>
      <el-tree
          :data="sortFileTree"
          node-key="id"
          highlight-current
          :expand-on-click-node="false"
          @node-click="categoryEvent"
          @node-expand="treeHeightChanged"
          @node-collapse="treeHeightChanged"
          v-show="show.categoryFiles"
          :render-content="renderContent">
      </el-tree>
    </div>

    <!--其他-->
    <div class="others">
      <div class="title">
        <!--角标-->
        <el-badge :value="badgeData.others" :hidden="!hasBadge">
          <span>其他</span>
        </el-badge>
        <el-button size="mini" @click="trigShow" data-name="others">{{content.others}}</el-button>
      </div>
      <div class="other-item" v-show="show.others">
        <div class="trash">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-huishouzhan"></use>
          </svg>
          <div class="item-title" @click="trashEvent">
            <el-button type="text">
              回收站
            </el-button>
          </div>
        </div>
        <div class="ignore">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-wenjian1"></use>
          </svg>
          <div class="item-title" @click="ignoreEvent">
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
  import {mapGetters} from 'vuex'
  import bus from '@/utils/bus'
  import {ipcRenderer} from 'electron'

  export default {
    name: 'FileManager',
    props: {
      hasNewButton: {
        type: Boolean,
        default: true
      },
      hasBadge: {
        type: Boolean,
        default: false
      },
      badgeData: {
        type: Object,
        default () {
          return {
            allFiles: 0,
            categoryFiles: 0,
            others: 0
          }
        }
      },
      clickEvent: {
        type: Object,
        default () {
          return {
            onDiskFileClick: null,
            onCategoryClick: null,
            onTrashClick: null,
            onIgnoreClick: null
          }
        }
      }
    },
    data () {
      return {
        // count: 1,
        // 控制面板折叠与展开
        show: {
          allFiles: true,
          categoryFiles: true,
          others: true
        },
        // 折叠或展开按钮的状态
        content: {
          allFiles: '收起',
          categoryFiles: '收起',
          others: '收起'
        },
        // 记录当前选中的高亮节点，用于添加新节点时定位父节点
        currentNode: {},
        // 记录新建目录的名字
        newCategoryDirName: '新建分类',
        // 原始分类树的数据
        rowFileTree: [],
        // 记录列表第几页（分类）
        page: 0,
        // 一次请求加载多少条数据（分类）
        size: 50,
        // 防止多次请求的标志，每次接到加载内容的消息后，置此标志为0，数据加载完成后再置为1
        loadFlag: 1
      }
    },
    computed: mapGetters([
      // 所有文件选项的数据，即管理的磁盘
      'allFiles',
      // 智能分类列表
      'smartSortList',
      // 分类文件夹树
      'sortFileTree',
      // 当前路径，面包屑导航
      'currentPath'
    ]),
    mounted () {
      // 重置列表数据，防止和搜索组件等其他共用List的组件的数据混合
      this.$store.commit('setFileList', [])
      // 插入文件小图标
      // this.insertFileIcon()
      // 接受 sidebar 新建按钮的新建分类通知
      bus.$on('newCategory', () => {
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
      // 格式化名字（所有文件的磁盘名含有别名和序列号，以*分隔，需要提取别名）
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
      // 在文件树条目的名字前插入文件Icon
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

      // 加载磁盘（包含我的电脑）文件树
      diskEvent (index) {
        if (typeof this.clickEvent.onDiskFileClick === 'function') {
          this.clickEvent.onDiskFileClick(index)
        }
      },

      // 用户点击侧边栏分类树，加载分类文件列表
      categoryEvent (nodeObj, node) {
        if (typeof this.clickEvent.onCategoryClick === 'function') {
          this.clickEvent.onCategoryClick(nodeObj, node)
        }
      },

      // 加载忽略的内容
      ignoreEvent () {
        if (typeof this.clickEvent.onIgnoreClick === 'function') {
          this.clickEvent.onIgnoreClick()
        }
      },

      // 加载回收站的内容（需要重用List组件）
      trashEvent () {
        if (typeof this.clickEvent.onTrashClick === 'function') {
          this.clickEvent.onTrashClick()
        }
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
      // TODO element 组件不会修改 tree 组件的原始数据，需要在用户确认后向后台发送修改信息，再重新请求数据
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
          let nodeId = nodeObj.id + this.newCategoryDirName + '/'
          let data = {
            label: this.newCategoryDirName,
            id: nodeId,
            children: []
          }
          // 调用源代码中的方法增加节点，但是不会更新原始数据（非API）
          node.store.append(data, nodeObj)
        } else {
          // 直接在原始数据中添加新节点
          // 不能直接更改，需要通过 store 进行更改
          let data = {
            label: this.newCategoryDirName,
            id: this.newCategoryDirName,
            children: [],
            inputShow: 'none',
            labelShow: 'inline-block'
          }
          this.$store.commit('addSortDirectory', data)
        }
      },

      // TODO 删除节点
      removeNode (node, data) {
        // 调用源代码中的方法删除节点，单是不会更新源数据（非API）
        node.store.remove(data)
      },

      // TODO 确认编辑节点的结果
      confirmEditNode (node, data) {
        console.log(node.data.label)
      },

      // 树节点渲染函数 vue-render
      // TODO 点击修改后，重复点击输入框会触发加载文件列表的函数
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
                    // 不能直接更改 node 的状态，需要通过 store
                    this.$store.commit('setTreeNode', node)
                    this.$store.commit({
                      type: 'toggleTreeNodeDisplay',
                      inputShow: 'inline-block',
                      labelShow: 'none'
                    })
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
                  // 输入框失去焦点后，确认编辑状态
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
  #fileManager-root {
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
      // 增大下拉图标大小
      .el-tree-node__expand-icon {
        border: 8px solid transparent;
        border-left-color: #97a8be;
        border-left-width: 8px;
      }
      // 叶子节点没有下拉图标
      .el-tree-node__expand-icon.is-leaf {
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
    .smartSortList-warpper {
      height: 100px;
      overflow-y: scroll;
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

  // 修改节点
  .el-tree-node {
    .el-input {
      display: none;
      width: 80%;
      input {
        border: none;
        // 考虑是否设置输入框的背景色，设置后无法明显看到输入状态
        // background-color: inherit;
        padding: 0;
        font-size: 1.1em;
      }
    }
  }
</style>
