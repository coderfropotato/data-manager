<template>
  <div id="fileHeader-root">
    <div class="breadcrumb">
     <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/filescale' }">文件</el-breadcrumb-item>
      <el-breadcrumb-item  v-for="(item,index) in navList" :key="index">
        <span @click="navBarJump(item,index)">{{item.filename || item.alias}}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    </div>
    <div class="search">
       <el-input ref="search" size="small" placeholder="请输入关键词" v-model.trim="searchValue">
          <el-button @click="search" slot="append" icon="search">搜索</el-button>
      </el-input>
      <div class="tag-group">
          <el-tag  @close="closeTag"  :closable="true">{{tag.name}}</el-tag>
      </div>
    </div>
  </div>
</template>
<script>
import fetchData from "@/api/getData";
import { mapGetters } from "vuex";
export default {
  name: "fileHeader",
  data() {
    return {
      searchValue: "",
      tag: { name: "current" }
    };
  },
  computed: {
    ...mapGetters(["navList"])
  },
  activated() {
    this.tag.name = "current";
  },
  methods: {
    closeTag() {
      this.tag.name === "current"
        ? (this.tag.name = "global")
        : (this.tag.name = "current");
    },
    navBarJump(item, index) {
      let path = item.path;
      this.$store.dispatch("getDirTree", { path }).then(res => {
        this.$store.dispatch("delNavBar", index);
      });
    },
    search() {
      // isGlobal searchRange content
      if (!this.searchValue) {
        this.$message("请输入关键词");
      } else {
        switch (this.tag.name) {
          case "current":
            //当前搜索
            this.$store
              .dispatch("searchCurrentDisk", this.searchValue)
              .then(_ => {
                let temp = [];
                this.searchValue = "";
                temp.push(this.navList[0]);
                this.$router.push("/search");
                this.$store.dispatch("setSearchRange", temp);
                this.$store.dispatch("setTotalCount", _.total);
                this.$store.dispatch("resetFileInfo");
                this.$store.dispatch("setGlobalType", "search");
              });
            break;
          case "global":
            //全局搜索
            let context = this.searchValue;
            let type = "files";
            this.$store.dispatch("searchFile", { context, type }).then(_ => {
              this.$router.push("/search");
              this.$store.dispatch("checkAllSwitch", true);
              this.$store.dispatch("setTotalCount", _.length);
              this.$store.dispatch("resetFileInfo");
              this.$store.dispatch("setGlobalType", "search");
            });
            break;
        }
        this.$store.dispatch("setSearchValue", this.searchValue);
      }
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
