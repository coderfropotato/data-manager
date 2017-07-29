<template>
  <div id="fileDirectory-root">
    <div class="allFiles">
      <div class="title">
        <span>所有文件</span>
        <el-button size="mini" @click="trigShow" data-name="allFiles">{{content.allFiles}}</el-button>
        <el-button size="mini">+</el-button>
      </div>
      <div class="disks">
        <div class="disk">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-diannao"></use>
          </svg>
          <div class="disk-title">
            我的电脑
          </div>
        </div>
        <div class="disk">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-harddisk"></use>
          </svg>
          <div class="disk-title">
            HRTLLFLFLKDS
          </div>
        </div>
      </div>
    </div>
    <div class="sortFiles">
      <div class="title">
        <span>分类</span>
        <el-button size="mini" @click="trigShow" data-name="sortFiles">{{content.sortFiles}}</el-button>
        <el-button size="mini">+</el-button>
        <el-tree :data="data" :props="defaultProps" v-show="show.sortFiles"></el-tree>
      </div>
    </div>
    <div class="others">
      <div class="title">
        <span>其他</span>
        <el-button size="mini" @click="trigShow" data-name="others">{{content.others}}</el-button>
      </div>
      <div class="trash">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-huishouzhan"></use>
        </svg>
        <div class="trash-title">
          回收站
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'

  export default {
    name: 'AllFiles',
    data () {
      return {
        // 模拟数据
        data: [
          {
            label: '一级 1',
            children: [{
              label: '二级 1-1',
              children: [{
                label: '三级',
                children: [
                  {
                    label: '四级'
                  }
                ]
              }]
            }]
          },
          {
            label: '一级 2',
            children: [{
              label: '二级 2-1',
              children: [{
                label: '三级 2-1-1'
              }]
            }, {
              label: '二级 2-2',
              children: [{
                label: '三级 2-2-1'
              }]
            }, {
              label: '二级 2-2',
              children: [{
                label: '三级 2-2-1'
              }]
            }]
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        count: 0,
        show: {
          allFiles: true,
          sortFiles: true,
          others: true
        },
        content: {
          allFiles: '收起',
          sortFiles: '收起',
          others: '收起'
        }
      }
    },
    mounted () {
      this.travelTree(this.data[1])
      this.insertFileIcon()
    },
    methods: {
      // 遍历树
      travelTree (obj) {
        for (let name in obj) {
          // console.log(this.count + ':' + name)
          if (obj[name] instanceof Array) {
            this.count++
            for (let i = 0; i < obj[name].length; i++) {
              this.travelTree(obj[name][i])
            }
            this.count--
          }
        }
      },
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
      // 文件展开或收起
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
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/SCSS/animate";
  #fileDirectory-root{
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
  .trash{
    height: 2.4em;
    line-height: 2.4em;
    .icon{
      float: left;
      font-size: 1.2em;
      margin: 0.5em 0.5em 0.5em 1.5em;
    }
    .disk-title,
    .trash-title{
      font-size: 0.9em;
      float: left;
    }
  }
  .el-tree {
    background-color: inherit;
    border: none;
    margin: 0.3em 1em;
  }
</style>
