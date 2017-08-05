<template>
  <div class="searchHeader-root">
    <div class="header">
      <el-row type="flex" class="header-inner">
        <el-col :span="1"></el-col>
        <!--下拉菜单-->
        <el-col :span="5">
          <div class="grid-content">
            <el-select v-model="displayStatus">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="1"></el-col>
        <!--搜索框-->
        <el-col :span="20">
          <div class="grid-content">
            <div class="search-input" @click="focus">
              <el-button v-for="item in selectedCondition" :key="item" size="mini">{{item}}<i class="el-icon-circle-close" @click="deleteItem"></i></el-button>
              <input type="text" id="searchInput" @keyup.enter="search" v-model="input">
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
  import $ from 'jquery'
  export default {
    name: 'FileHeader',
    data () {
      return {
        show: true,
        condition: ['公共数据', '私有数据', '共享数据', 'FASTA', 'FASTQ', 'BAM', 'SAM', 'VCF'], // 列出的条件
        selectedCondition: [],
        // 用户选择的条件，通过v-for遍历这个集合以显示用户点击的条件。输入框条件的增加删除，也是通过向这个集合添加或者删除元素来实现
        i: 0,
        searchValue: '',
        options: [
          {
            value: 'Lists',
            label: 'List'
          },
          {
            value: 'Columns',
            label: 'Column'
          },
          {
            value: 'Grid',
            label: 'Grid'
          }
        ],
        input: ''
      }
    },
    computed: {
      displayStatus: {
        get: function () {
          return this.$store.state.showControl.listDisplayStatus
        },
        // 提供 setter ，使组件能够设置 displayStatus 的值
        set: function (value) {
          this.$store.commit('setFileDisplayStatus', value)
        }
      }
    },
    methods: {
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
      },
      search () {
        console.log(this.input)
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
          position: relative;
          bottom: 0.7em;
          margin-left: 0.1em;
          font-size: 0.8em;
        }
      margin-top: 0.5em;
      input{
        position: relative;
        bottom: 0.5em;
        height: 1.5em;
        outline: none;
        border: none;
        vertical-align: baseline;
        font-size: 1em;
      }
      height: 2em;
      border: 1px solid #bfcbd9;
      background-color: #fff;

    }
  }
</style>
