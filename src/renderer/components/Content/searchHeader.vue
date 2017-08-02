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
              <span></span>
              <span></span>
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
          <el-button size="mini" @click="showItem" data-name="类别">公共数据</el-button>
          <el-button size="mini" @click="showItem" data-name="类别">私有数据</el-button>
          <el-button size="mini" @click="showItem" data-name="类别">共享数据</el-button>
        </div>
        <div>
          <span>文件类型：</span>
          <el-button size="mini" @click="showItem" data-name="FASTA">FASTA</el-button>
          <el-button size="mini" @click="showItem" data-name="FASTQ">FASTQ</el-button>
          <el-button size="mini" @click="showItem" data-name="BAM">BAM</el-button>
          <el-button size="mini" @click="showItem" data-name="SAM">SAM</el-button>
          <el-button size="mini" @click="showItem" data-name="VCF">VCF</el-button>
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
        condition: {
          publicData: '公共数据',
          privateData: '私有数据',
          sharedData: '共享数据',
          FASTA: 'FASTA',
          FASTQ: 'FASTQ',
          BAM: 'BAM',
          SAM: 'SAM',
          VCF: 'VCF'
        },
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
        console.log(e.target)
        let amount = $('.search-input').children('span').length
        if (this.i < amount) {
          if (text === '公共数据' || text === '私有数据' || text === '共享数据') {
            $('.search-input').children('span').eq(this.i).text('类别：' + text)
          } else {
            $('.search-input').children('span').eq(this.i).text('文件类型：' + text)
          }
          $('.search-input').children('span').eq(this.i).css('border', '1px solid #000')
          this.i++
        }
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
    .el-button {
      border-color: #FFFFFF;
    }
  }

  .header{
    .search-input{
      margin-top: 0.7em;
      span {
        border-radius: 12px;
        padding: 1px 3px 1px;
        margin-left: 0.3em;
        font-size: 0.7em;
        position: relative;
        bottom: 1.3em;
      }
      input{
        position: relative;
        bottom: 1em;
        left: 0.2em;
        background-color: #eef1f6;
        height: 1.5em;
        outline: none;
        border: none;
        vertical-align: baseline;
        font-size: 0.8em;
      }
      height: 1.5em;
      border: 1px solid #000;
      border-radius: 15px;
    }
  }
</style>
