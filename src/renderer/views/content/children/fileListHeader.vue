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
        <el-col :span="12" id="scrollBar">
          <div class="scrollBar-inner">
            <div class="grid-content">
              <el-breadcrumb separator=">" class="pathArea">
                <el-breadcrumb-item v-for="(item, index) in pathArray" :key="item" @click.native="setPath(index)">
                  {{item}}
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </div>
        </el-col>
        <!--搜索框-->
        <el-col :span="8">
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
    <!--导入文件按钮-->
    <div class="import-button">
      <router-link to="/files/importfile">
        <el-button type="primary" icon="plus"></el-button>
      </router-link>
    </div>
  </div>
</template>
<script>
  import scrollBar from '@/utils/headerScrollbar'
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
      },
      // 点击路径面包屑后设置路径
      setPath (index) {
        this.pathArray.splice(index + 1)
        let path = this.pathArray.join('/') + '/'
        this.$store.commit('setCurrentPath', path)
      }
    }
  }
</script>
<style lang="scss">
  #fileHeader-root {
    // 上级组件content.vue position 设置为relative
    #scrollBar {
      position: relative;
      overflow: hidden;
      margin-right: 1em;
      .scrollBar-inner {
        position: relative;
      }
    }
    // 导航路径面包屑
    .pathArea {
      font-size: 14px;
      display: inline-block;
      vertical-align: -0.2em;
    }

    // 导入文件按钮
    .import-button {
      position: absolute;
      z-index: 100;
      bottom: 2em;
      right: 2em;
      .el-button {
        height: 3em;
        width: 3em;
        border-radius: 4em;
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .2);
      }
      .el-icon-plus {
        margin-left: -0.1em;
      }
    }
  }
</style>
