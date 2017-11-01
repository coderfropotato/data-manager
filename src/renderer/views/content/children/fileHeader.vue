<template>
  <div id="fileHeader-root">
    <div class="breadcrumb">
      <p title="index>computer>files"><span>当前位置：</span>index>computer>files</p>
    </div>
    <div class="search">
       <el-input size="small" placeholder="请输入关键词" v-model="searchValue">
          <el-button slot="append" icon="search">搜索</el-button>
      </el-input>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "fileHeader",
  data() {
    return {
      searchValue: "",
    };
  },
  mounted() {}
};
</script>
<style lang="scss">
.el-button{
  border-radius: 0;
  color: #fff!important;
}
.el-input-group__append{
  background:#386cca;
  border: none;
}
#fileHeader-root {
  display: flex;
  padding: 12px 12px;
  height: 58px;
  .breadcrumb {
    p {
      line-height: 35px;
      font-size: 14px;
      white-space: nowrap;
      overflow-x: hidden;
      text-overflow: ellipsis;
    }
    width: 55%;
    padding-right: 12px;
    box-sizing: border-box;
  }
  .search {
    width: 45%;
  }
  #scrollBar {
    position: relative;
    overflow: hidden;
    margin-right: 1em;
    .scrollBar-inner {
      position: relative;
    }
  }
}
</style>
