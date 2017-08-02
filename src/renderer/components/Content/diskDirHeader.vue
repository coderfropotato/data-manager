<template>
  <div id="fileHeader-root">
    <div class="header">
      <el-row type="flex" class="header-inner" :gutter="10">
        <!--下拉菜单-->
        <el-col :span="1"></el-col>
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
        <!--路径面包屑-->
        <el-col :span="14" id="scrollBar">
          <div class="scrollBar-inner">
            <div class="grid-content">
              <el-breadcrumb separator=">" class="pathArea">
                <el-breadcrumb-item v-for="item in pathArray" :key="item">
                  {{item}}
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </div>
        </el-col>
        <!--搜索框-->
        <el-col :span="6">
          <div class="grid-content">
            <el-autocomplete
                class="inline-input"
                icon="search"
                size="small"
                v-model="searchValue"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                @select="handleSelect"
            ></el-autocomplete>
          </div>
        </el-col>
        <!--左间距-->
        <el-col :span="1">
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import scrollBar from '../../assets/JS/headerScrollbar'
  import {mapState} from 'vuex'

  export default {
    name: 'FileHeader',
    data () {
      return {
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
        ]
      }
    },
    mounted () {
      scrollBar()
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
      },
      ...mapState({
        pathArray: state => {
          let rowPath = state.files.currentPath.split('/')
          rowPath.pop()
          return rowPath
        }
      })
    },
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
      }
    }
  }
</script>
<style lang="scss" scoped>
  #scrollBar {
    position: relative;
    overflow: hidden;
    margin-right: 1em;
    .scrollBar-inner {
      position: relative;
    }
  }

  .pathArea {
    font-size: 14px;
    display: inline-block;
    vertical-align: -0.2em;
  }
</style>
