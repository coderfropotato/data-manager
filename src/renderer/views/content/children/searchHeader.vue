<template>
  <div id="searchHeader-root">
    <div class="search">
       <el-input size="small" placeholder="请输入关键词" v-model="searchValue">
          <el-button slot="append" icon="search">搜索</el-button>
      </el-input>
    </div>
  </div>
</template>
<script>
import scrollBar from "@/utils/searchScrollbar";

export default {
  name: "SearchHeader",
  data() {
    return {
      searchValue: ""
    };
  },
  computed: {},

  mounted() {
    // scrollBar()
    // 重置列表数据，防止和文件组件数据混合
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
#searchHeader-root {
  padding: 24px 12px;
  .el-button {
    border-radius: 0;
    color: #fff !important;
  }
  .el-input-group__append {
    background: #386cca;
    border: none;
  }
  .search {
    width: 60%;
    margin: 0 auto;
  }
}
</style>
