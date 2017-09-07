<template>
  <div id="list-root">
    <div class="list-root-inner" ref="ListRootInner">
      <div class="lists-display" v-if="status === 'Lists'">
        <div class="list-items">
          <div class="list-item" v-for="(item,index) in listData" :key="index" @click="showFileInfo(item)">
            <div class="file-name">
              <el-tooltip :content="item.basic.filename" placement="right-start" :open-delay="2000">
                <span>{{item.basic.filename | formatName(10)}}</span>
              </el-tooltip>
            </div>
            <div class="create-time">
              {{item.basic.ctime | formatDate}}
            </div>
            <div class="size">
              {{item.basic.size | formatSize}}
            </div>
            <div class="edit">
              <el-button type="text">
                编辑
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="columns-display" v-if="status === 'Columns'">
        <el-table
            :data="listData"
            highlight-current-row
            style="width: 100%;"
            @row-click="showFileInfo">
          <el-table-column
              type="index"
              label="序号"
              width="100"
              sortable>
          </el-table-column>
          <el-table-column
              label="文件名"
              sortable>
            <template scope="scope">
              <el-tooltip :content="scope.row.basic.filename" placement="right-start" :open-delay="2000">
                <span>{{scope.row.basic.filename | formatName(10)}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
              label="创建时间"
              sortable>
            <template scope="scope">
              <span>{{ scope.row.basic.ctime | formatDate}}</span>
            </template>
          </el-table-column>
          <el-table-column
              label="文件大小"
              sortable>
            <template scope="scope">
              <span>{{ scope.row.basic.size | formatSize}}</span>
            </template>
          </el-table-column>
          <el-table-column
              label="操作">
            <template scope="scope">
              <el-button type="text">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="grid-display" v-if="status === 'Grid'">
        <div class="grid-items">
          <el-row :gutter="20">
            <el-col :span="6" v-for="(item,index) in listData" :key="index">
              <!--TODO：添加编辑按钮-->
              <div class="grid-item" @click="showFileInfo(item)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-file"></use>
                </svg>
                <div class="file-name">
                  <el-tooltip :content="item.basic.filename" placement="top" :open-delay="2000">
                    <span>{{item.basic.filename | formatName(10)}}</span>
                  </el-tooltip>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="drag-zone">
      <div class="drag-inner" v-if="dragFiles">
        <span>导入文件</span>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import bus from '@/utils/bus'

  export default {
    name: 'List',
    props: {
      listData: {
        type: Array,
        default () {
          return []
        }
      },
      // 操作选项
      operation: {
        type: Object,
        default () {
          return {
            text: '编辑',
            event: () => {
            }
          }
        },
        validator (value) {
          if (value.text && value.event) {
            return true
          }
        }
      }
    },
    data () {
      return {
        // 记录拖入与拖出的次数
        count: 0,
        // 列表根元素的高度，即容器的高度
        listRootHeight: 0,
        // 用于滚动事件节流
        scrollTimer: 0,
        lastScrollFireTime: 0,
        lastPosition: 0
      }
    },
    computed: mapGetters({
      // 文件展示状态 list/column/grid
      status: 'listDisplayStatus',
      // 是否显示拖拽导入文件提示
      dragFiles: 'dragShow'
    }),
    mounted () {
      // 监听列表区拖拽，有拖入则显示导入提示，拖出则隐藏提示
      let list = document.getElementById('list-root')
      this.listRootHeight = list.clientHeight
      list.addEventListener('dragenter', e => {
        // drag-zone 也有监听拖拽事件，同时监听父子元素会导致拖出事件频繁触发，造成闪烁
        this.count++
        e.preventDefault()
        if (this.count > 0) {
          this.$store.commit('toggleDragShow', true)
        }
      }, false)
      list.addEventListener('dragleave', e => {
        console.log('leave')
        e.preventDefault()
        this.count--
        if (this.count <= 0) {
          this.$store.commit('toggleDragShow', false)
        }
      }, false)

      // 监听拖拽，对导入的文件进行处理
      this.dragEvent()
    },
    watch: {
      listData () {
        this.$nextTick(() => {
          setTimeout(() => {
            bus.$emit('loading-end')
          }, 1000)
        })
        // 如果列表容器高度为0，则获取列表容器的高度
        if (!this.listRootHeight) {
          this.listRootHeight = document.getElementById('list-root').clientHeight
        }
        this.$nextTick(() => {
          document.getElementById('list-root').addEventListener('scroll', this.loadContent, false)
        })
      }
    },
    filters: {
      // 格式化文件名，如果文件名大于某个长度，则做截断处理
      formatName (name, maxLength) {
        if (name !== undefined) {
          return name.length > maxLength ? name.substr(0, maxLength - 1) + '...' : name
        }
      },
      // 格式化文件大小，最近格式为相应的单位
      formatSize (size) {
        if (size <= 0) {
          return '0 bytes'
        }
        const abbreviations = ['bytes', 'kB', 'MB', 'GB']
        const index = Math.floor(Math.log(size) / Math.log(1024))
        return `${+(size / Math.pow(1024, index)).toPrecision(3)} ${abbreviations[index]}`
      },
      // 格式化时间，将秒转化成 XXXX/XX/XX 形式
      formatDate (date) {
        let d = new Date(date * 1000)
        let month = '' + (d.getMonth() + 1)
        let day = '' + d.getDate()
        let year = d.getFullYear()
        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day
        return [year, month, day].join('/')
      }
    },
    methods: {
      // 滚动事件节流
      loadContent (e, minScrollTime, minDistance) {
        // 最小触发时间
        minScrollTime = minScrollTime || 100
        // 最小触发加载距离
        minDistance = minDistance || 300
        // 在切换列表显示模式，列表高度会发生变化，但数据不会更新，需要在在滚动时获取
        let listHeight = this.$refs.ListRootInner.clientHeight
        let listRootHeight = document.getElementById('list-root').clientHeight
        let now = new Date().getTime()

        // 滚动时需要的处理事件
        function loadMoreContent (self) {
          let scrollHeight = document.querySelector('#list-root').scrollTop
          // 防止回滚请求
          if (self.lastPosition > scrollHeight) {
            return
          }
          self.lastPosition = scrollHeight
          let distance = listHeight - scrollHeight - minDistance

          if (distance / listHeight < 0.25 || distance < listRootHeight) {
            // 发送加载内容的通知
            bus.$emit('load-content')
          }
        }

        if (!this.scrollTimer) {
          if (now - this.lastScrollFireTime > (2 * minScrollTime)) {
            loadMoreContent(this)
            this.lastScrollFireTime = now
          }
          this.scrollTimer = setTimeout(() => {
            this.scrollTimer = null
            this.lastScrollFireTime = new Date().getTime()
            loadMoreContent(this)
          }, minScrollTime)
        }
      },

      // 点击文件，显示文件信息
      showFileInfo (file) {
        // 获取文件的具体信息
        this.$store.dispatch({
          type: 'getFileInfo',
          path: file.basic.path,
          serialNumber: file.serial_number
        })
        // 显示文件信息区
        this.$store.commit('showFileInfo')
      },

      // 处理导入文件夹操作
      dropHandler (e) {
        e.stopPropagation()
        e.preventDefault()
        let importDirectory = e.dataTransfer.files
        let fileCount = 0
        // 计算文件的个数， Chrome only
        if (e.dataTransfer.items && e.dataTransfer.items.length) {
          for (let item of e.dataTransfer.items) {
            let entry = item.webkitGetAsEntry()
            if (entry && entry.isFile) {
              fileCount++
              break
            }
          }
        }
        // fileCount 大于 0，则含有文件，报错，否则传递数据，进行重定向
        if (fileCount) {
          // 不能导入文件
          this.$message({
            message: '不能导入文件',
            type: 'error',
            showClose: true,
            duration: 4000
          })
          this.$store.commit('toggleDragShow', false)
        } else {
          // 将文件夹加入到状态管理中的记录导入文件夹的数组
          this.$store.commit('addImportFiles', importDirectory)
          // 重定向到导入文件页面
          // 设置拖拽区域隐藏
          this.$store.commit('toggleDragShow', false)
          this.$router.push('/files/importfile')
        }
        // 放下后，缺少拖出的计数，需重置为 0， 防止下次无法隐藏
        this.count = 0
      },

      // 拖拽事件监听
      dragEvent () {
        let dragZone = document.querySelector('.drag-zone')
        dragZone.addEventListener('dragover', function (e) {
          e.preventDefault()
          e.stopPropagation()
          e.dataTransfer.dragEffect = 'copy'
        }, false)
        dragZone.addEventListener('drop', this.dropHandler, false)
      },

      // 编辑事件
      editEvent () {
      }
    }
  }
</script>

<style lang="scss">
  #list-root {
    position: relative;
    -webkit-overflow-y: overlay;
    overflow-x: hidden;
    height: 95%;
    min-height: 400px;
    .list-root-inner {
      position: relative;
    }
    .el-table__body-wrapper {
      overflow: hidden;
    }
    .drag-zone {
      .drag-inner {
        position: absolute;
        z-index: 100;
        display: flex;
        flex-direction: column;
        justify-content: center;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        font-size: 2em;
        font-weight: 600;
        text-align: center;
        color: #edf7ff;
        background-color: rgba(1, 1, 1, 0.5);
      }

    }

    .el-upload-dragger {
      .el-icon-plus {
        vertical-align: middle;
        text-align: center;
        font-size: 48px;
      }
    }

    .lists-display {
      .list-item {
        position: relative;
        width: 100%;
        height: 4em;
        padding: 0 2em;
        overflow: hidden;
        cursor: pointer;
        .file-name {
          font-size: 1.1em;
          font-weight: 500;
          margin: 0.25em 0;
        }
        .create-time,
        .size {
          display: inline-block;
          margin-right: 1em;
        }
        .edit {
          position: absolute;
          top: 1em;
          vertical-align: -0.5em;
          right: 2em;
        }
      }
      .list-item:nth-child(even) {
        background-color: #eef1f6;
      }
    }

    .grid-display {
      .grid-item {
        text-align: center;
        margin: 1em;
        .icon {
          font-size: 3em;
        }
        .file-name {
          font-size: 0.8em;
          margin: 1em;
        }
      }
    }
  }
</style>
