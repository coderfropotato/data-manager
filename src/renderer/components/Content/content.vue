<template>
  <div id="content-root">
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
        <el-col :span="16">
          <div class="grid-content">
            <el-breadcrumb separator=">" class="pathArea">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>活动管理</el-breadcrumb-item>
              <el-breadcrumb-item>活动列表</el-breadcrumb-item>
              <el-breadcrumb-item>活动详情</el-breadcrumb-item>
              <el-breadcrumb-item>活动详情</el-breadcrumb-item>
            </el-breadcrumb>
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
    name: 'Content',
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
  #content-root {
    height: 100%;
    .header {
      height: 3em;
      line-height: 3em;
      background-color: #eef1f6;
      button {
        font-size: 16px;
        height: 1.8em;
        width: 3.6em;
        margin: 0.6em 1em;
        background-color: #eef1f6;
        border-radius: 0.2em;
        border: 1px solid #48576a;
        outline: 1px solid #eef1f6;
        cursor: pointer;
        .icon {
          font-size: 1.2em;
        }
      }
    }
  }

  .el-dropdown-menu {
    span {
      margin-left: 1em;
    }
  }

  #column {
    transform: rotate(90deg);
  }

  .pathArea {
    display: inline-block;
    font-size: 0.9em;
    vertical-align: -0.2em;
  }
</style>
