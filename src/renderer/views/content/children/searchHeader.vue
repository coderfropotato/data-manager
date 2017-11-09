<template>
  <div id="searchHeader-root">
    <div class="search-top">
        <input type="text" v-model.trim="searchValue" placeholder="请输入关键词">
        <div class="tag-group" v-if="searchRangeLength!==fileList.length"><el-tag>{{`在${searchRangeLength}个位置搜索`}}</el-tag></div>
        <div class="tag-group"  v-if="searchRangeLength===fileList.length"><el-tag>{{`在全局搜索`}}</el-tag></div>
        <em @click="search">搜索</em>
    </div>
  </div>
</template>
<script>
import scrollBar from "@/utils/searchScrollbar";
import { mapGetters } from "vuex";
export default {
  name: "SearchHeader",
  data() {
    return {};
  },
  computed: {
    searchValue: {
      get() {
        return this.$store.state.search.searchValue;
      },
      set(val) {
        this.$store.commit("setSearchValue", val);
      }
    },
    ...mapGetters(["searchRangeLength", "fileList"])
  },

  mounted() {
    // scrollBar()
    // 重置列表数据，防止和文件组件数据混合
  },
  methods: {
    search() {
      let context = this.searchValue;
      this.$store.dispatch("searchFile", { context }).then(
        _ => {
          console.log(_);
          this.searchVal = "";
          this.$store.dispatch("setTotalCount", _.length);
          this.$store.dispatch("setGlobalType", "search");
        },
        err => {
          this.$message({
            message: "请选择一个搜索范围",
            type: "warning"
          });
        }
      );
    }
  }
};
</script>

<style lang="scss">
#searchHeader-root {
  padding: 24px 12px;
  .search-top {
    .tag-group {
      top: 5px;
    }
    width: 80%;
    height: 34px;
    background: #ccc;
    position: relative;
    margin: 0 auto;
    input {
      width: 100%;
      height: 100%;
      outline: none;
      padding-right: 120px;
      padding-left: 100px;
      border: none;
      background: #f5f5f5;
    }
    em {
      position: absolute;
      width: 110px;
      height: 100%;
      font-size: 14px;
      font-style: normal;
      color: #fff;
      background: #386cca;
      top: 0;
      right: 0;
      text-align: center;
      line-height: 34px;
      cursor: pointer;
      border-radius: 0 4px 4px 0;
    }
  }
  // .tag-group {
  //   position: absolute;
  // }
  // .el-button {
  //   border-radius: 0;
  //   color: #fff !important;
  // }
  // .el-input-group__append {
  //   background: #386cca;
  //   border: none;
  // }
  // .search {
  //   position: relative;
  //   width: 60%;
  //   margin: 0 auto;
  //   .el-input__inner {
  //     border: none;
  //     background: #f5f5f5;
  //   }
  // }
}
</style>
