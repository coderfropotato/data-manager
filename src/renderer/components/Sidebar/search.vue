<template>
  <div id="search-root">
    <div class="search-engines">
      <div class="search-title">
        <span class="title">搜索引擎</span>
        <el-checkbox :indeterminate="isIndeterminateAll" v-model="checkAll"
                     @change="handleCheckAllChange"></el-checkbox>
        <!--全选按钮-->
      </div>
      <div class="local-data">
        <div class="data-title">
          <span>本地数据</span>
          <el-checkbox :indeterminate="isIndeterminateLocal" v-model="checkAllLocal"
                       @change="handleCheckAllLocalChange"></el-checkbox>
          <!--全选按钮-->
        </div>
        <el-checkbox-group v-model="localCheckedSearch" @change="handleLocalCheckedSearchChange">
          <div class="disk" v-for="search in localSearchEngines" :key="search">
            <div class="disk-title">
              <span>{{search}}</span>
              <el-checkbox :label="search"></el-checkbox>
            </div>
          </div>
        </el-checkbox-group>
      </div>
      <!--网络搜索引擎-->
      <div class="web-data">
        <el-checkbox-group v-model="webCheckedSearch" @change="handleWebCheckedSearchChange">
          <div class="website" v-for="web in webSearchEngines" :key="web">
            <span>{{web}}</span>
            <el-checkbox :label="web"></el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'

  let localSearchOptions = ['HKFDKUIYER', 'JFLDLKLNKLJ', 'JILFD']
  let webSearchOptions = []
  export default {
    data () {
      return {
        // 所有搜索是否全部选中
        checkAll: false,
        // 本地搜索是否全部选中
        checkAllWeb: false,
        // 网络搜索引擎是否全部选中
        checkAllLocal: false,
        // 已选择的本地搜索磁盘
        localCheckedSearch: [],
        // 已选择的网络搜索引擎
        webCheckedSearch: [],
        // 本地搜索引擎选项
        localSearchEngines: localSearchOptions,
        // 网络搜索引擎选项
        webSearchEngines: webSearchOptions,
        // 所有搜索全选样式，有全选，非全选和全不选
        isIndeterminateAll: false,
        // 本地搜索全选样式，有全选和非全选和全不选
        isIndeterminateLocal: false,
        isIndeterminateWeb: false
      }
    },
    computed: mapState({
      // localSearchEngines: state => state.files.allFiles
    }),
    watch: {
      webCheckedSearch () {
        this.setCheckedOptions()
      },
      localCheckedSearch () {
        this.setCheckedOptions()
      }
    },
    mounted () {
      this.checkAllWeb = this.webSearchEngines.length === 0
      this.checkAllLocal = this.localSearchEngines.length === 0
    },
    methods: {
      // 全部搜索全选
      handleCheckAllChange (event) {
        this.localCheckedSearch = event.target.checked ? this.localSearchEngines : []
        this.webCheckedSearch = event.target.checked ? this.webSearchEngines : []
        this.checkAllLocal = event.target.checked
        this.checkAllWeb = event.target.checked
        // 设置选框状态
        this.isIndeterminateWeb = false
        this.isIndeterminateLocal = false
        this.isIndeterminateAll = false
      },
      // 本地搜索全选
      handleCheckAllLocalChange (event) {
        this.localCheckedSearch = event.target.checked ? this.localSearchEngines : []
        this.isIndeterminateLocal = false
        this.checkAll = this.checkAllLocal && this.checkAllWeb
        // 标志全部搜索选框状态
        this.isIndeterminateAll =
          this.localCheckedSearch.length + this.webCheckedSearch.length < this.webSearchEngines.length + this.localSearchEngines.length &&
          this.localCheckedSearch.length + this.webCheckedSearch.length > 0
      },
      // 选择本地磁盘搜索时
      handleLocalCheckedSearchChange (value) {
        let checkedCount = value.length
        // 本地搜索是否为全选状态
        this.checkAllLocal = checkedCount === this.localSearchEngines.length
        // 标志本地搜索全选框状态
        this.isIndeterminateLocal = checkedCount > 0 && checkedCount < this.localSearchEngines.length
        // 标志所有全选框状态
        this.checkAll = this.checkAllLocal && this.checkAllWeb
        // 标志全部搜索选框状态
        this.isIndeterminateAll =
          this.localCheckedSearch.length + this.webCheckedSearch.length < this.webSearchEngines.length + this.localSearchEngines.length &&
          this.localCheckedSearch.length + this.webCheckedSearch.length > 0
      },
      // 选择网络搜索引擎时
      handleWebCheckedSearchChange (value) {
        let checkedCount = value.length
        // 网络搜索引擎是否为全选
        this.checkAllWeb = checkedCount === this.webSearchEngines.length
        // 标志网络搜索引擎的全选框状态（不存在）
        this.isIndeterminateWeb = checkedCount > 0 && checkedCount < this.webSearchEngines.length
        // 标志所有全选框状态
        this.checkAll = this.checkAllLocal && this.checkAllWeb
        // 标志全部搜索选框状态
        this.isIndeterminateAll =
          this.localCheckedSearch.length + this.webCheckedSearch.length < this.webSearchEngines.length + this.localSearchEngines.length &&
          this.localCheckedSearch.length + this.webCheckedSearch.length > 0
      },
      // 设置状态管理搜索范围
      setCheckedOptions () {
        let options = this.localCheckedSearch.concat(this.webCheckedSearch)
        this.$store.commit('setSearchRange', options)
      }
    }
  }
</script>
<style lang="scss">
  #search-root {
    .search-engines {
      margin: 0 1em;
    }
    .el-checkbox {
      float: right;
      margin-right: 2em;
    }
    .el-checkbox__label {
      display: none;
    }
    .search-title {
      .title {
        margin: 1em;
        font-size: 1.1em;
        font-weight: 500;
      }
    }

    .local-data,
    .web-data {
      padding-left: 1em;
      margin: 1em 0;
      width: 100%;
      .disk {
        padding: 0.3em 0em 0.3em 1em;
      }
      .website {
        margin: 0.3em 0;
      }
    }
  }
</style>
