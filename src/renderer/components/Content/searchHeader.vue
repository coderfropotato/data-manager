<template>
  <div class="searchHeader-root">
    <div class="header">
      <el-row type="flex" class="header-inner">
        <!--下拉菜单-->
        <el-col :span="4">
          <div class="grid-content">
            <el-dropdown menu-align="start">
              <!--按钮-->
              <button>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-menu"></use>
                </svg>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-xiala"></use>
                </svg>
              </button>
              <!--下拉列表-->
              <el-dropdown-menu slot="dropdown" menu-align="end">
                <el-dropdown-item>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-list"></use>
                  </svg>
                  <span>List</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <svg class="icon" aria-hidden="true" id="column">
                    <use xlink:href="#icon-list"></use>
                  </svg>
                  <span>Columns</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-liebiao"></use>
                  </svg>
                  <span>Grid</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
        <!--搜索框-->
        <el-col :span="20">
          <div class="grid-content">
            <div class="search-input" @click="focus">
              <el-button v-for="item in selectedCondition" size="mini">{{item}}<i class="el-icon-circle-close" @click="deleteItem"></i></el-button>
              <input type="text" id="searchInput">
            </div>
          </div>
        </el-col>
        <!--左间距-->
        <el-col :span="1">
        </el-col>
      </el-row>
    </div>
    <div class="middle">
      <span>搜索条件</span>
      <el-button size="mini" v-on:click="fold">收起</el-button>
      <div class="searchCondition" v-if="show">
        <div class="line" ref="line"></div>
        <div name="类别">
          <span>类别：</span>
          <el-button size="mini" @click="showItem" type="text" data-name="类别">公共数据</el-button>
          <el-button size="mini" @click="showItem" type="text" data-name="类别">私有数据</el-button>
          <el-button size="mini" @click="showItem" type="text" data-name="类别">共享数据</el-button>
        </div>
        <div>
          <span>文件类型：</span>
          <el-button size="mini" @click="showItem" type="text" data-name="FASTA">FASTA</el-button>
          <el-button size="mini" @click="showItem" type="text" data-name="FASTQ">FASTQ</el-button>
          <el-button size="mini" @click="showItem" type="text" data-name="BAM">BAM</el-button>
          <el-button size="mini" @click="showItem" type="text" data-name="SAM">SAM</el-button>
          <el-button size="mini" @click="showItem" type="text" data-name="VCF">VCF</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import $ from 'jquery'
  export default {
    name: 'FileHeader',
    data () {
      return {
        searchValue: '',
        show: true,
        condition: ['公共数据', '私有数据', '共享数据', 'FASTA', 'FASTQ', 'BAM', 'SAM', 'VCF'], // 列出的条件
        selectedCondition: [],
        // 用户选择的条件，通过v-for遍历这个集合以显示用户点击的条件。输入框条件的增加删除，也是通过向这个集合添加或者删除元素来实现
        i: 0
      }
    },
    computed: mapState({
      pathArray: state => {
        let rowPath = state.files.currentPath.split('/')
        rowPath.pop()
        return rowPath
      }
    }),
    methods: {
      // 搜索框搜索结果建议
      querySearch (queryString, cb) {
        let temp = [{
          value: '建议'
        }]
        cb(temp)
      },
      // 处理选择搜索结果建议
      handleSelect () {
      },
      fold () {
        this.show = !this.show
      },
      showItem (e) {
        let text = e.target.innerText
        let count = 0
        let length = this.selectedCondition.length
        // 如果用户还未选择条件，则直接添加
        if (length === 0) {
          if (text === '公共数据' || text === '私有数据' || text === '共享数据') {
            this.selectedCondition.push('类别：' + text)
          } else {
            this.selectedCondition.push('文件类型：' + text)
          }
        } else { // 如果已经有选择的条件，判断用户点击的条件是否重复
          for (this.i = 0; this.i < length; this.i++) {
            if (this.selectedCondition[this.i].indexOf(text) !== -1) {
              count++
            }
          } // 如果没有重复，则向selectedCondition添加元素
          if (count === 0) {
            if (text === '公共数据' || text === '私有数据' || text === '共享数据') {
              this.selectedCondition.push('类别：' + text)
            } else {
              this.selectedCondition.push('文件类型：' + text)
            }
          }
        }
      },
      deleteItem (e) {
        let text = $(e.target).parent().parent().text()
        for (this.i = 0; this.i < this.selectedCondition.length; this.i++) {
          if (text === this.selectedCondition[this.i]) {
            var index = this.i
          }
        }
        this.selectedCondition.splice(index, 1)
      },
      focus () {
        document.querySelector('#searchInput').focus()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-autocomplete {
    width: 22em;
  }
  .middle {
    font-size: 0.8em;
    span {
      margin-left: 1.2em;
    }
    >.el-button:nth-child(2) {
      float: right;
      margin-right: 1.5em;
    }
    .line {
      height: 1px;
      width: 95%;
      background-color: #48576a;
      margin: 1em auto;
    }
  }
  .header{
    .search-input{
        .el-button {
          border-radius: 12px;
          margin-left: 0.3em;
          font-size: 1em;
        }
      margin-top: 0.7em;
      input{
        position: relative;
        bottom: 0.5em;
        left: 0.5em;
        background-color: #eef1f6;
        height: 1.5em;
        outline: none;
        border: none;
        vertical-align: baseline;
        font-size: 1em;
      }
      height: 2em;
      border: 1px solid #000;
      border-radius: 15px;
    }
  }
</style>
