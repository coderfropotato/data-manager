<template>
  <div id="searchHeader-root">
    <!--搜索栏-->
    <div class="header">
      <el-row type="flex" class="header-inner">
        <el-col :span="1"></el-col>
        <!--下拉菜单-->
        <el-col :span="4">
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
        <!--搜索框-->
        <el-col :span="17">
          <div class="grid-content">
            <div class="search-input" id="scrollBar">
              <div class="scrollBar-inner">
                <el-button v-for="(item,index) in selectedCondition" :key="item" size="mini">{{item}}
                  <i class="el-icon-circle-close" @click="deleteItem(index)"></i>
                </el-button>
                <input v-model="searchInput" @click="focus" id="searchInput">
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="2">
          <i class="el-icon-search" @click="search"></i>
        </el-col>
      </el-row>
    </div>
    <!--搜索条件-->
    <div class="middle">
      <div class="search-condition-header">
        <span class="condition-title">搜索条件</span>
        <el-button size="small" @click="fold">{{conditionShowName}}</el-button>
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
  import scrollBar from '@/utils/searchScrollbar'

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
        conditionShow: false,
        conditionShowName: '展开',
        // 所有可选的搜索条件
        searchConditionOptions: [
          {
            label: '数据类别',
            name: 'type',
            // 映射英文名
            value: ['public', 'private', 'share'],
            options: ['公共数据', '私有数据', '共享数据']
          },
          {
            label: '文件类型',
            name: 'filetype',
            // 映射英文名
            value: ['FASTA', 'FASTQ', 'BAM', 'SAM', 'VCF'],
            options: ['FASTA', 'FASTQ', 'BAM', 'SAM', 'VCF']
          }
        ],
        // 用户选择的搜索条件
        selectedCondition: [],
        // 最后的搜索条件合集
        searchCondition: [],
        // 用户输入的搜索条件
        searchInput: ''
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
    watch: {
      // DOM刷新，重新计算滚动区宽度
      selectedCondition () {
        this.$nextTick(function () {
          scrollBar()
        })
      }
    },
    mounted () {
      scrollBar()
      // 重置列表数据，防止和文件组件数据混合
      this.$store.commit('setFileList', [])
    },
    methods: {
      // 点击收起按钮，折叠搜索条件区域
      fold () {
        this.conditionShow = !this.conditionShow
        if (this.conditionShow === true) {
          this.conditionShowName = '收起'
        } else {
          this.conditionShowName = '展开'
        }
      },
      // @item 类型
      // @index 序号（从左到右）
      showItem (item, index) {
        let option = item.options[index]
        let text = item.label + '|' + option

        // 放入最终的搜索条件中
        let condition = {}
        condition[item.name] = item.value
        this.searchCondition.push(condition)

        // 转化成 Set，保证数据唯一性
        let set = new Set(this.selectedCondition)
        set.add(text)
        this.selectedCondition = []
        for (let item in Array.from(set.values())) {
          this.selectedCondition.push(Array.from(set.values())[item])
        }
        console.log(this.selectedCondition)
      },
      // 删除所选搜索条件
      deleteItem (index) {
        this.searchCondition.splice(index, 1)
        this.selectedCondition.splice(index, 1)
      },
      // 用户点击搜索框，自动聚焦到搜索框
      focus () {
        document.querySelector('#searchInput').focus()
      },
      // 向后台发送搜索条件，获取搜索结果
      search () {
        // 合并自定义输入数据选择搜索条件
        let conditions = {
          'customize': {
            'customize': this.searchInput
          },
          'options': this.searchCondition
        }
        // 调用方法，获取数据
        this.$store.dispatch('getSearchResult', conditions)
      }
    }
  }
</script>

<style lang="scss">
  #searchHeader-root {
    .header {
      .search-input {
        margin: 0.5em 1em 0.5em 1em;
        height: 2em;
        border: 1px solid #bfcbd9;
        background-color: #fff;
        .el-button {
          position: relative;
          top: -0.9em;
          height: 2em;
          margin-left: 0.1em;
          font-size: 0.8em;
        }
        input {
          width: 300px;
          height: 3em;
          font-size: 1em;
          position: relative;
          top: -0.55em;
          left: 0.5em;
          border: none;
          outline: none;
        }
      }
      .el-icon-search {
        cursor: pointer;
      }
    }
    #scrollBar {
      position: relative;
      overflow: hidden;
      .scrollBar-inner {
        position: relative;
        height: 2em;
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
