<template>
  <div id="fileHeader-root">
    <div class="breadcrumb">
     <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/filescale' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
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
      searchValue: ""
    };
  },
  mounted() {}
};
</script>
<style lang="scss" >
.el-breadcrumb{
  margin-top: 10px;
}
.el-button {
  border-radius: 0;
  color: #fff !important;
}
.el-input-group__append {
  background: #386cca;
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
