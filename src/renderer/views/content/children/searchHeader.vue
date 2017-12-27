<template>
  <div id="searchHeader-root">
    <div class="search-top">
        <div class="tag-group" v-if="searchPos"><el-tag color="#f5f5f5" @close="curClose" >{{`在"${searchPos}"搜索`}}</el-tag></div>
        <div class="tag-group" v-if="searchRangeLength!==fileList.length && !searchPos"><el-tag color="#f5f5f5" type="gray">{{`在${searchRangeLength}个位置搜索`}}</el-tag></div>
        <!-- <div class="tag-group"  v-if="searchRangeLength===fileList.length && !searchPos"><el-tag color="#f5f5f5" type="gray">{{`在全局搜索`}}</el-tag></div> -->
        <input :class="{'active':searchRangeLength===fileList.length && !searchPos}" type="text" @keyup.enter="search" v-model.trim="searchValue" :placeholder="(searchRangeLength===fileList.length && !searchPos)?'请输入全局搜索关键词':'请输入搜索关键词'">
        <em @click="search">搜索</em>
    </div>
  </div>
</template>
<script>
import scrollBar from "@/utils/searchScrollbar";
import { mapGetters } from "vuex";
import $ from "jquery";
import bus from "@/utils/bus";
export default {
  name: "SearchHeader",
  data() {
    return {
      isMessage:false
    };
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
    ...mapGetters(["searchRangeLength", "fileList", "searchPos"])
  },
  // mounted() {
  //   bus.$on("computedInput", _ => {
  //     this.computedInput();
  //   });
  // },
  // activated() {
  //   this.computedInput();
  // },
  methods: {
    curClose() {
      this.$store.dispatch("setSearchPos", "");
      // computed input padding
      // this.$nextTick(_ => {
      //   bus.$emit("computedInput");
      // });
    },
    search() {
      let context = this.searchValue;
      if (this.searchPos) {
        this.$store.dispatch("searchCurrentDisk", context).then(res => {
          this.$store.dispatch("setTotalCount", res.length);
          this.$store.dispatch("setSelected", { count: 0, size: 0 });
          this.$store.dispatch("setRouteStatus", "search");
        });
      } else {
        this.$store.dispatch("searchFile", { context }).then(
          _ => {
            //console.log(_);
            this.searchVal = "";
            this.$store.dispatch("setTotalCount", _.length);
            this.$store.dispatch("setRouteStatus", "search");
          },
          err => {
            if(!this.isMessage){
              this.isMessage = true;
              this.$message({
                message: "请选择一个搜索范围",
                duration:1200,
                onClose:_=>{this.isMessage = false;}
              });
            }
          }
        );
      }
    },
    // computedInput() {
    //   let oW = $("#searchHeader-root .tag-group").width();
    //   $("#searchHeader-root .search-top input").css(
    //     "padding-left",
    //     oW + 10 + "px"
    //   );
    // }
  }
};
</script>

<style lang="scss">
#searchHeader-root {
  padding: 13px 12px;
  .search-top {
    .el-tag{
      height: 34px;
      line-height: 34px;
      border: none;
      padding: 0 10px;
    }
    .tag-group {
      top: 0px;
      left: 0;
      background-color: #f5f5f5;
    }
    width: 80%;
    height: 34px;
    position: relative;
    margin: 0 auto;
    input {
      width: 100%;
      height: 100%;
      outline: none;
      padding-right: 120px;
      padding-left: 12px;
      border: none;
      background: #f5f5f5;
      padding-left: 100px;
      border-radius: 4px 0 0 4px;
      &.active{
        padding-left: 10px;
      }
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
      transition: .3s all ease;
      &:hover{
        opacity: .8;
      }
    }
  }
  .tag-group {
    position: absolute;
  }
  .el-button {
    border-radius: 0;
    color: #fff !important;
  }
  .el-input-group__append {
    background: #386cca;
    border: none;
  }
  .search {
    position: relative;
    width: 60%;
    margin: 0 auto;
    .el-input__inner {
      border: none;
      background: #f5f5f5;
    }
  }
}
</style>
