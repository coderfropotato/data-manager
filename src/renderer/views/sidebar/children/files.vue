<template>
  <div id="directory-root">
    <FileManager :clickEvent="clickEvent">
    </FileManager>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import bus from '@/utils/bus'
  import FileManager from '@/components/fileManager'

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
        // FileManager 组件的点击事件对象
        clickEvent: {
          onDiskFileClick: this.loadDiskFileTree,
          onCategoryClick: this.loadCategory,
          onTrashClick: this.loadTrashContent,
          onIgnoreClick: this.loadIgnoreContent
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
      // 加载磁盘（包含我的电脑）文件树
      loadDiskFileTree (index) {
        let serialNumber
        // 获取路径，去除磁盘path中的 * 和序列号
        let path = this.allFiles[index]
        if (path.indexOf('*') > -1) {
          let tempPath = path.split('*')
          path = tempPath[0]
        }
        path = path + '/'

        if (index === 0) {
          serialNumber = 'myComputer'
        } else {
          serialNumber = this.allFiles[index].split('*').pop()
        }
        this.$store.dispatch('getDiskFileTree', serialNumber)
        this.$router.push('/files/diskdirectory')
        this.$store.commit('setCurrentPath', path)
        // 加载动画
        bus.$emit('loading-content')
      },

      // 用户点击侧边栏分类树，加载分类文件列表
      loadCategory (nodeObj, node) {
        // 重置文件列表数组
        this.$store.commit('setFileList', [])
        this.page = 0
        this.loadFlag = 1
        // 获取当前的路由信息，进行重定向
        let routerPath = this.$router.currentRoute.fullPath
        if (routerPath !== '/files/list') {
          this.$router.push('/files/list?type=category')
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

      // 加载回收站的内容（需要重用List组件）
      loadTrashContent () {
        let routerPath = this.$router.currentRoute.fullPath
        if (routerPath !== '/files/list') {
          this.$router.push('/files/list?type=trash')
        }
        this.$store.dispatch('getTrash')
        // 重置列表数据，防止和搜索组件数据混合
        this.$store.commit('setFileList', [])
        this.$store.commit('setCurrentPath', '回收站/')
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
    },

    components: {
      FileManager
    }
  }
</script>
