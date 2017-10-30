<template>
  <div id="fileHeader-root">
    <div class="breadcrumb">
      <p title="index>computer>files"><span>当前位置：</span>index>computer>files</p>
    </div>
    <div class="search">
       <el-input placeholder="请输入内容" v-model="input4">
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
      //el data
      input4: ""
    };
  },
  mounted() {}
};
</script>
<style lang="scss">
#fileHeader-root {
  display: flex;
  padding: 24px 12px;
  .breadcrumb {
    p {
      line-height: 35px;
      font-size: 14px;
      white-space: nowrap;
      overflow-x: hidden;
      text-overflow: ellipsis;
    }
    width: 30%;
    padding-right: 12px;
    box-sizing: border-box;
  }
  .search {
    width: 70%;
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
