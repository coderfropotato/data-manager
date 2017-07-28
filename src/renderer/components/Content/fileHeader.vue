<template>
  <div id="fileHeader-root">
    <div class="header">
      <el-row type="flex" class="header-inner">
        <!--下拉菜单-->
        <el-col :span="4">
          <div class="grid-content">
            <el-dropdown menu-align="start">
              <button>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-menu"></use>
                </svg>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-xiala"></use>
                </svg>
              </button>
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
        <!--路径-->
        <el-col :span="16" id="scrollBar">
          <div class="scrollBar-inner">
            <div class="grid-content">
              <el-breadcrumb separator=">" class="pathArea">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
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
  export default {
    name: 'FileHeader',
    data () {
      return {
        searchValue: ''
      }
    },
    methods: {
      querySearch (queryString, cb) {
        let temp = [{
          value: '建议'
        }]
        cb(temp)
      },
      handleSelect () {
        // 处理选择
      }
    }
  }
</script>
<style lang="scss" scoped>
  #scrollBar {
    position: relative;
    overflow: hidden;
    .scrollBar-inner {
      position: relative;
    }
  }

  .pathArea {
    display: inline-block;
    font-size: 0.9em;
    vertical-align: -0.2em;
  }
</style>
