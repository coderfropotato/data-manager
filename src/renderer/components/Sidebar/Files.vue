<template>
  <div id="fileDirectory-root">
    <div class="allFiles">
      <div class="title">
        <span>所有文件</span>
        <el-button size="mini" @click="trigShow" data-name="allFiles">{{content.allFiles}}</el-button>
        <el-button size="mini">+</el-button>
      </div>
      <div class="disks" v-show="show.allFiles">
        <!--遍历后台传送的磁盘数组，默认第一个为我的电脑-->
        <div class="disk" v-for="(disk, index) in diskDir">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-diannao" v-if="!index"></use>
            <use xlink:href="#icon-harddisk" v-if="index"></use>
          </svg>
          <div class="item-title" @click="diskLoadFileList">
            <el-button type="text">
              {{disk}}
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="sortFiles">
      <div class="title">
        <span>分类</span>
        <el-button size="mini" @click="trigShow" data-name="sortFiles">{{content.sortFiles}}</el-button>
        <el-button size="mini">+</el-button>
      </div>
      <el-tree
          :data="sortFileTree"
          node-key="id"
          :expand-on-click-node="false"
          @node-click="treeLoadFileList"
          @node-expand="treeHeightChanged"
          @node-collapse="treeHeightChanged"
          v-show="show.sortFiles">
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
  import Tree from '@/components/Sidebar/tree'
  import {mapState} from 'vuex'
  import bus from '@/assets/JS/bus'
  export default {
    name: 'AllFiles',
    data () {
      return {
        count: 1,
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
        }
      }
    },
    mounted () {
      // this.insertFileIcon()
    },
    computed: mapState({
      // 所有文件选项的数据，即管理的磁盘
      diskDir: state => state.files.allFiles,
      // 分类文件夹树
      sortFileTree: state => state.files.sortFileTree
    }),
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
        this.$store.dispatch('getIgnore')
      },
      // 加载回收站的内容
      loadTrashContent () {
        this.$store.dispatch('getTrash')
      },
      // 加载所有文件的文件列表
      diskLoadFileList (e) {
        let diskName = e.target.innerText
        this.$store.dispatch('getFileTree', diskName)
      },
      // 加载分类文件列表
      treeLoadFileList (nodeObj) {
        let path = nodeObj.id
        // 根据用户的选择，设置状态管理中的当前路径
        this.$store.commit('setCurrentPath', path)
        // 发送获取文件列表请求
        this.$store.dispatch('getFileList', path, '18401839')
        // 通过空的 Vue 实例作为中央时间总线，发送路径更改信息
      },
      // 当节点展开或关闭时，树的高度会发生变化，需要发出相关事件，通知 sidebar 组件改变scrollbar样式
      treeHeightChanged () {
        // 会触发MaxListenersExceededWarning 错误
        // TODO 解决当点击展开与收起次数过多时触发 MaxListenersExceededWarning
        bus.$emit('tree-height-changed')
      }
    },
    components: {
      Tree
    }
  }
</script>

<style lang="scss" scoped>
  #fileDirectory-root {
    margin: 0 2em 0 1.5em;
  }

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
  .ignore{
    height: 2.4em;
    line-height: 2.4em;
    .icon {
      float: left;
      font-size: 1em;
      margin: 0.5em 0.5em 0.5em 1.5em;
    }
    .item-title{
      font-size: 0.8em;
      float: left;
    }
  }

  .el-tree {
    background-color: inherit;
    border: none;
    margin: 0.3em 1em;
  }
</style>
