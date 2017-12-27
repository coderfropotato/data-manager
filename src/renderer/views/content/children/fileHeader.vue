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
    <div @click.stop="cancelBubble" class="search" :class="{'active':showDom}" >
        <el-input ref="search" size="small" :placeholder="showDom?'请输入关键词':'请输入全局搜索关键词'" @keyup.native.delete="del"  @keyup.native.enter="search" v-model.trim="searchValue">
          <!-- <el-select v-model="searchType" size="small" slot="prepend" placeholder="请选择">
            <el-option label="当前搜索" value=0></el-option>
            <el-option label="全局搜索" value=1></el-option>
          </el-select> -->
          <!-- <div class="tag-group">
              <el-tag type="gray" @close="closeTag"  :closable="true">{{tag.name}}</el-tag>
          </div> -->
        <el-button @click.stop="search" slot="append">搜索</el-button>
        </el-input>
        <div class="tag-group" v-if="showDom">
          <el-tag type="gray" color="#f5f5f5">当前搜索</el-tag>
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
      isMessage: false,
      showDom: true,
      count: 0
    };
  },
  computed: {
    ...mapGetters(["navList", "searchTableData", "history"]),
    searchType() {
      //0 当前 1 全局
      return this.showDom ? 0 : 1;
    }
  },
  mounted() {
    let x = 0;
    let oWidth, oInner, scale;
    let _this = this;
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

    // document
    $(document).on("click", function() {
      _this.showDom = true;
    });
  },
  methods: {
    del() {
      if (this.searchValue === "") {
        this.count++;
        if (this.count >= 2) this.showDom = false;
      } else {
        this.count = 0;
      }
    },
    cancelBubble() {},
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
        if (!this.isMessage) {
          this.isMessage = true;
          this.$message({
            showClose: true,
            message: "请输入关键词",
            duration: 1200,
            onClose: _ => {
              this.isMessage = false;
            }
          });
        }
      } else {
        switch (this.searchType) {
          case 0:
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
          case 1:
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
              this.$store.dispatch("setSearchPos", "");
              this.$store.dispatch("setSelected", { count: 0, size: 0 });
              this.$store.dispatch("setRouteStatus", "search");
            });
            break;
        }
        this.$store.dispatch("setGlobalNavIndex", 2);
        this.$store.dispatch("resetFileInfo");
        this.$store.dispatch("setSearchValue", this.searchValue);
        this.searchValue = "";
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
    transition: 0.3s all ease;
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
    &.active {
      .el-input__inner {
        padding-left: 76px;
      }
    }
    .el-input__inner {
      transition: 0.3s all ease;
      border: none;
      background: #f5f5f5;
    }
    .el-select {
      width: 104px;
    }
    .el-input-group__prepend {
      border-left: none;
    }
    .tag-group {
      position: absolute;
      left: 0;
      top: 0;
    }
    .el-tag {
      padding: 0 10px;
      line-height: 30px;
      font-size: 14px;
      height: 30px;
      border: none;
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
