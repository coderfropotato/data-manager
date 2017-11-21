<template>
  <div id="fileHeader-root">
    <div class="breadcrumb">
     <!-- <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/filescale' }">文件</el-breadcrumb-item>
      <el-breadcrumb-item  v-for="(item,index) in navList" :key="index">
        <span @click="navBarJump(item,index)">{{item.filename || item.alias}}</span>
      </el-breadcrumb-item>
    </el-breadcrumb> -->
    <div class="bread-wrap"></div>
    <p>
      <!-- <router-link tag="span" :to="{path:'/filescale'}">文件</router-link> -->
      <span @click="jumotoindex">文件</span>
      <span @click="navBarJump(item,index)" v-for="(item,index) in navList" :key="index"><em>&nbsp;<&nbsp;</em>{{item.filename || item.alias}}</span>
    </p>
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
import $ from "jquery";
export default {
  name: "fileHeader",
  data() {
    return {
      searchValue: "",
      tag: { name: "在当前搜索" }
    };
  },
  computed: {
    ...mapGetters(["navList"])
  },
  mounted() {
    let x = 0;
    let oWidth, oInner, scale;
    $(".bread-wrap")
      .on("mousemove", function(e) {
        oWidth = $(".bread-wrap").outerWidth();
        oInner = $(".breadcrumb > p").width();
        if (oInner <= oWidth) return;
        x = e.pageX - $(this).offset().left;
        scale = x / oWidth;
        let pos = scale * oInner;
        $(".breadcrumb > p").css({ left: -scale * (oInner - oWidth) });
      })
      .on("mouseleave", function() {
        if (oInner > oWidth) {
          $(".breadcrumb > p").css({ left: -x / oWidth * (oInner - oWidth) });
        } else {
          $(".breadcrumb > p").css({ left: 0 });
        }
      });
  },
  activated() {
    this.tag.name = "在当前搜索";
  },
  methods: {
    closeTag() {
      this.tag.name === "在当前搜索"
        ? (this.tag.name = "在全局搜索")
        : (this.tag.name = "在当前搜索");
    },
    navBarJump(item, index) {
      let path = item.path;
      this.$store.dispatch("getDirTree", { path }).then(res => {
        this.$store.dispatch("resetTableClickHistory").then(_ => {
          this.$store.dispatch("delNavBar", index);
          this.$store.dispatch("getFileInfo");
          this.$store.dispatch("setSelected", { count: 0, size: 0 });
        });
      });
    },
    jumotoindex() {
      this.$store.dispatch("resetFileInfo");
      this.$router.push("/filescale");
    },
    search() {
      // isGlobal searchRange content
      if (!this.searchValue) {
        this.$message("请输入关键词");
      } else {
        switch (this.tag.name) {
          case "在当前搜索":
            //当前搜索
            this.$store
              .dispatch("searchCurrentDisk", this.searchValue)
              .then(_ => {
                let temp = [];
                this.searchValue = "";
                temp.push(this.navList[0]);
                this.$router.push("/search?type=current");
                this.$store.dispatch("setSearchRange", temp);
                this.$store.dispatch("setTotalCount", _.length);
                this.$store.dispatch("setRouteStatus", "search");
              });
            break;
          case "在全局搜索":
            //全局搜索
            let context = this.searchValue;
            let type = "files";
            this.searchValue = "";
            this.$store.dispatch("searchFile", { context, type }).then(_ => {
              this.$router.push("/search?type=global");
              this.$store.dispatch("checkAllSwitch", true);
              this.$store.dispatch("setTotalCount", _.length);
              this.$store.dispatch("setRouteStatus", "search");
            });
            break;
        }
        this.$store.dispatch("setGlobalNavIndex", 2);
        this.$store.dispatch("resetFileInfo");
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
  padding: 0 12px;
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
    overflow: hidden;
    position: relative;
    cursor: pointer;
    .bread-wrap {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
      z-index: 20;
    }
    p {
      position: absolute;
      z-index: 30;
      left: 0;
      top: 0;
      line-height: 14px;
      margin-top: 22px;
      font-size: 14px;
      white-space: nowrap;
      -webkit-user-select: none;
      user-select: none;
      span {
        cursor: pointer;
        &:hover {
          color: #386cca;
        }
      }
    }
    width: 40%;
    padding-right: 12px;
    box-sizing: border-box;
  }
  .search {
    margin-top: 12px;
    padding-bottom: 12px;
    width: 60%;
    position: relative;
    .el-input__inner {
      padding-left: 100px;
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
