<template>
  <div id="fileHeader-root">
    <div class="breadcrumb">
     <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/filescale' }">文件</el-breadcrumb-item>
      <el-breadcrumb-item  v-for="(item,index) in navText" :key="index">
        <span @click="navBarJump(item,index)">{{item.filename || item.alias}}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    </div>
    <div class="search">
       <el-input ref="search" size="small" placeholder="请输入关键词" v-model="searchValue">
          <el-button slot="append" icon="search">搜索</el-button>
      </el-input>
      <div class="tag-group">
          <el-tag   v-for="(tag,index) in tags"  @close="closeTag(tag,index)"  :key="tag.name" :closable="true">{{tag.name}}</el-tag>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "fileHeader",
  data() {
    return {
      searchValue: "",
      tags: [{ name: "current" }]
    };
  },
  computed: {
    ...mapGetters(["navText"])
  },
  methods: {
    closeTag(tag, index) {
      tag.name === "current"
        ? (this.tags[0].name = "global")
        : (this.tags[0].name = "current");
    },
    navBarJump(item, index) {
      let path = item.path;
      this.$store.dispatch("getDirTree", { path }).then(res => {
        this.$store.dispatch("delNavBar", index);
      });
    }
  }
};
</script>
<style lang="scss">
.el-breadcrumb {
  margin-top: 10px;
}

#fileHeader-root {
  display: flex;
  padding: 12px 12px;
  height: 58px;
  .el-input-group__append {
    background-color: #386cca !important;
    border: none;
    .el-button {
      border-radius: 0;
      color: #fff !important;
    }
  }
  .breadcrumb {
    p {
      line-height: 35px;
      font-size: 14px;
      white-space: nowrap;
      overflow-x: hidden;
      text-overflow: ellipsis;
    }
    width: 40%;
    padding-right: 12px;
    box-sizing: border-box;
  }
  .search {
    width: 60%;
    position: relative;
    .el-input__inner {
      padding-left: 76px;
      border: none;
      background: #f5f5f5;
    }
    .tag-group {
      left: 4px;
      top: 3px;
      position: absolute;
      .el-tag {
        background: #fff;
        border: 1px solid #ccc;
        color: #666;
      }
    }
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
