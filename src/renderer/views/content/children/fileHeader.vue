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
      <span :class="{'active':index+1===navList.length}" @click="navBarJump(item,index)" v-for="(item,index) in navList" :key="index"><em>&nbsp;< &nbsp;</em>{{item.filename || item.alias}}</span>
    </p>
    </div>
    <div class="search">
       <el-input ref="search" size="small" placeholder="请输入关键词"  @keyup.native.enter="search" v-model.trim="searchValue">
          <el-select v-model="searchType" size="small" slot="prepend" placeholder="请选择">
            <el-option label="当前搜索" value="0"></el-option>
            <el-option label="全局搜索" value="1"></el-option>
          </el-select>
          <el-button @click="search" slot="append">搜索</el-button>
      </el-input>
      <!-- <div class="tag-group">
          <el-tag type="gray" @close="closeTag"  :closable="true">{{tag.name}}</el-tag>
      </div> -->
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
      searchType: "0"
    };
  },
  computed: {
    ...mapGetters(["navList", "searchTableData", "history"])
  },
  mounted() {
    let x = 0;
    let oWidth, oInner, scale;
    $(".bread-wrap")
      .on("mousemove", function(e) {
        oWidth = $(".bread-wrap").outerWidth() - 4;
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
    this.searchType = "0";
  },
  methods: {
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
      //文件历史记录
      this.$store.dispatch("setGlobalHistory", false);
    },
    search() {
      // isGlobal searchRange content
      if (!this.searchValue) {
        this.$message("请输入关键词");
      } else {
        switch (this.searchType) {
          case "0":
            //当前搜索
            this.$store
              .dispatch("searchCurrentDisk", this.searchValue)
              .then(_ => {
                let temp;
                temp = this.navList[0].alias;
                this.$router.push("/search?type=current");
                this.$store.dispatch("setSearchRange", temp);
                //设置bottom info
                this.$store.dispatch(
                  "setTotalCount",
                  this.searchTableData.length
                );
                this.$store.dispatch("setSelected", { count: 0, size: 0 });
                this.$store.dispatch("setRouteStatus", "search");
                this.$store.dispatch(
                  "setSearchPos",
                  this.navList[this.navList.length - 1].filename ||
                    this.navList[this.navList.length - 1].alias
                );
              });
            break;
          case "1":
            //全局搜索
            let context = this.searchValue;
            let type = "files";
            this.$store.dispatch("searchFile", { context, type }).then(_ => {
              this.$router.push("/search?type=global");
              this.$store.dispatch("checkAllSwitch", true);
              //设置bottom info
              this.$store.dispatch(
                "setTotalCount",
                this.searchTableData.length
              );
              this.$store.dispatch('setSearchPos','');
              this.$store.dispatch("setSelected", { count: 0, size: 0 });
              this.$store.dispatch("setRouteStatus", "search");
            });
            break;
        }
        this.$store.dispatch("setGlobalNavIndex", 2);
        this.$store.dispatch("resetFileInfo");
        this.$store.dispatch("setSearchValue", this.searchValue);
        this.searchValue = '';
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
  justify-content: space-between;
  padding: 0 12px;
  height: 60px;
  .el-input-group__append {
    background-color: #386cca !important;
    width: 20%;
    text-align: center;
    border: none;
    border-radius: 0 4px 4px 0;
    &:hover {
      opacity: 0.8;
    }
    .el-button {
      border-radius: 0;
      color: #fff !important;
    }
  }
  .breadcrumb {
    overflow: hidden;
    position: relative;
    padding-right: 80px;
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
        &.active {
          color: #386cca;
        }
      }
    }
    width: 45%;
    padding-right: 12px;
    box-sizing: border-box;
  }
  .search {
    margin-top: 14px;
    padding-bottom: 12px;
    width: 50%;
    position: relative;
    .el-input__inner {
      // padding-left: 100px;
      border: none;
      background: #f5f5f5;
    }
    .el-select{
      width: 104px;
    }
    .el-input-group__prepend{
      border-left: none;
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
