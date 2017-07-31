<template>
  <div id="fileHeader-root">
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
        <!--路径面包屑-->
        <el-col :span="16" id="scrollBar">
          <div class="scrollBar-inner">
            <div class="grid-content">
              <el-breadcrumb separator=">" class="pathArea">
                <el-breadcrumb-item :to="{ path: '/allfiles' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>活动管理</el-breadcrumb-item>
                <el-breadcrumb-item>活动列表</el-breadcrumb-item>
                <el-breadcrumb-item>活动详情</el-breadcrumb-item>
                <el-breadcrumb-item>活动详情</el-breadcrumb-item>
                <el-breadcrumb-item>活动详情</el-breadcrumb-item>
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
  export default {
    name: 'FileHeader',
    data () {
      return {
        searchValue: ''
      }
    },
    mounted () {
      scrollBar()
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
