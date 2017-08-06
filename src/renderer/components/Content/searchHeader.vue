<template>
  <div id="searchHeader-root">
    <!--搜索栏-->
    <div class="header">
      <el-row type="flex" class="header-inner">
        <el-col :span="1"></el-col>
        <!--下拉菜单-->
        <el-col :span="5">
          <div class="grid-content">
            <el-select v-model="displayStatus">
              <el-option
                  v-for="item in displayOptions"
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
              <el-button v-for="(item,index) in selectedCondition" :key="item" size="mini">{{item}}<i
                  class="el-icon-circle-close" @click="deleteItem(index)"></i></el-button>
              <input type="text" id="searchInput" @keyup.enter="search" v-model="input">
            </div>
          </div>
        </el-col>
        <!--左间距-->
        <el-col :span="1">
        </el-col>
      </el-row>
    </div>
    <!--搜索条件-->
    <div class="middle">
      <div class="search-condition-header">
        <span class="condition-title">搜索条件</span>
        <el-button size="small" @click="fold">收起</el-button>
      </div>
      <div class="search-condition" v-if="conditionShow">
        <div class="condition" v-for="(item,index) in searchConditionOptions" :key="index">
          <span class="item-title">
            {{item.label}}
          </span>
          <el-button @click="showItem(item, optionIndex)" type="text" v-for="(option, optionIndex) in item.options"
                     :key="optionIndex">
            {{option}}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'FileHeader',
    data () {
      return {
        // 下拉菜单显示的选项
        displayOptions: [
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
        // 搜索条件区域是否显示
        conditionShow: true,
        // 所有可选的搜索条件
        searchConditionOptions: [
          {
            label: '数据类别',
            name: 'dataType',
            options: ['公共数据', '私有数据', '共享数据']
          },
          {
            label: '文件类型',
            name: 'fileType',
            options: ['FASTA', 'FASTQ', 'BAM', 'SAM', 'VCF']
          }
        ],
        // v-for 暂不支持迭代 map，需要转化成一个数组
        selectedCondition: [],
        // 用户选择的条件，通过v-for遍历这个集合以显示用户点击的条件。输入框条件的增加删除，也是通过向这个集合添加或者删除元素来实现
        i: 0,
        searchValue: '',
        input: ''
      }
    },
    computed: {
      // 获取文件列表显示状态 list/column/grid
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
      // 点击收起按钮，折叠搜索条件区域
      fold () {
        this.conditionShow = !this.conditionShow
      },
      // @item 类型
      // @index 序号（从左到右）
      showItem (item, index) {
        // 转化成 Set，保证数据唯一性
        let set = new Set(this.selectedCondition)
        let option = item.options[index]
        let text = item.label + '|' + option
        set.add(text)
        this.selectedCondition = []
        for (let item in Array.from(set.values())) {
          this.selectedCondition.push(Array.from(set.values())[item])
        }
      },
      // 删除所选搜索条件
      deleteItem (index) {
        this.selectedCondition.splice(index, 1)
      },
      // 用户点击搜索框，自动聚焦到搜索框
      focus () {
        document.querySelector('#searchInput').focus()
      },
      search () {
        console.log(this.input)
      }
    }
  }
</script>

<style lang="scss">
  #searchHeader-root {
    .header {
      .search-input {
        margin-top: 0.5em;
        height: 2em;
        border: 1px solid #bfcbd9;
        background-color: #fff;
        .el-button {
          position: relative;
          bottom: 0.7em;
          margin-left: 0.1em;
          font-size: 0.8em;
        }
        input {
          position: relative;
          bottom: 0.5em;
          height: 1.5em;
          outline: none;
          border: none;
          vertical-align: baseline;
          font-size: 1em;
        }
      }
    }
    .middle {
      padding: 1em 1.5em;
    }
    // 搜索条件标题样式
    .search-condition-header {
      .condition-title {
        font-size: 1.1em;
      }
      .el-button {
        float: right;
        margin-right: 1.5em;
        padding: 4px 7px;
      }
    }

    // 搜索条件样式
    .search-condition {
      margin: 1em 0;
      .item-title {
        font-size: 1em;
        margin: 1em 1em 1em 0;
      }
      span {
        margin: 0 0.5em;
      }
    }
  }
</style>
