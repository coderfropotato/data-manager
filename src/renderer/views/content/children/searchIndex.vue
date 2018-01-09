<template>
<div class="xx">
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
  <div id="searchIndex">
      <div class="search-wrap">
          <div class="search-top">
              <div class="tag-group" v-if="searchRangeLength!==fileList.length"><el-tag  color="#f5f5f5" type="gray">{{`在${searchRangeLength}个位置搜索`}}</el-tag></div>
              <input type="text"  v-model.trim="searchVal" @keyup.enter="search" :placeholder="searchRangeLength===fileList.length?'请输入全局搜索关键词':'请输入搜索关键词'">
              <!-- <div class="tag-group"  v-if="searchRangeLength===fileList.length"><el-tag color="#f5f5f5" type="gray">{{`在全局搜索`}}</el-tag></div> -->
              <em @click="search">搜索</em>
          </div>
          <p v-if="searchHistory.length">历史搜索记录：</p>
          <ul>
              <li @click="searchHis(val)" v-for="(val,index) in searchHistory" :key="index">
                  <p >{{val}}</p>
                  <i @click.stop="deleteHis(index)" class="iconfont icon-shanchu"></i>
              </li>
          </ul>
      </div>
      <div class="recommend">
          <div class="title">
            <p>推荐</p>
            <span>以下信息根据您的兴趣推荐</span>
          </div>
          <div class="rec-wrap">
            <div class="no-data"></div>
            <img src="../../../assets/images/no-recommend.png" alt="">
            <p>暂无文章推送,敬请期待</p>
          </div>
      </div>
      <!-- <img class="search-img" src="../../../assets/images/search-index.png" alt=""> -->
  </div>
</div>
</template>

<script>
import { mapGetters } from "vuex";
import localforage from "localforage";
import bus from "@/utils/bus";
import $ from "jquery";
export default {
  data() {
    return {
      searchVal: "",
      searchHistory: [],
      isMessage: false
    };
  },
  computed: {
    ...mapGetters(["searchRangeLength", "fileList", "searchRange"])
  },
  methods: {
    searchHis(his) {
      this.searchVal = his;
      this.search();
    },
    computedInput() {
      let oW = $("#searchIndex .tag-group").width();
      $("#searchIndex  input").css("padding-left", oW + "px");
    },
    search() {
      if (this.searchVal) {
        let _this = this;
        //设置搜索历史
        let flag = false;
        let index = null;
        for (var i = 0; i < _this.searchHistory.length; i++) {
          if (_this.searchHistory[i] === _this.searchVal) {
            flag = true;
            index = i;
            break;
          }
        }
        if (!flag) {
          this.searchHistory.unshift(this.searchVal);
          this.searchHistory.length > 10
            ? (this.searchHistory.length = 10)
            : (this.searchHistory.length = this.searchHistory.length);
        } else {
          let item = this.searchHistory.slice(index, index + 1);
          this.searchHistory.splice(index, 1);
          this.searchHistory.unshift(item[0]);
        }
        localforage.setItem("searchHistory", _this.searchHistory);
        this.$store.dispatch("setSearchValue", this.searchVal);
        //global
        let context = this.searchVal;
        if (!this.searchRange.length) {
          if (!this.isMessage) {
            this.isMessage = true;
            this.$message({
              message: "请选择一个搜索范围",
              duration: 1200,
              type: "warning",
              onClose: _ => {
                this.isMessage = false;
              }
            });
          }
        } else {
          this.$router.push("/search");
          this.$store.dispatch("searchFile", { context }).then(
            _ => {
              //console.log(_);
              this.searchVal = "";
              this.$store.dispatch("setRouteStatus", "search");
              this.$store.dispatch("setTotalCount", _.length);
              // reset selected cpuont
              this.$store.dispatch("setSelected", { count: 0, size: 0 });
              // reset search pos
              this.$store.dispatch("setSearchPos", "");
            },
            err => {}
          );
        }
      } else {
        if (!this.isMessage) {
          this.isMessage = true;
          this.$message({
            message: "请输入关键词",
            duration: 1200,
            onClose: _ => {
              this.isMessage = false;
            }
          });
        }
      }
    },
    deleteHis(index) {
      this.searchHistory.splice(index, 1);
      localforage.setItem("searchHistory", this.searchHistory);
    }
  },
  deactivated() {
    this.$store.dispatch("removeRightView", false);
  },
  activated() {
    // this.computedInput();
    let _this = this;
    this.searchHistory = localforage.getItem("searchHistory", (err, res) => {
      if (res != null) {
        _this.searchHistory = res;
      } else {
        _this.searchHistory = [];
        localforage.setItem("searchHistory", []);
      }
    });
    this.$store.dispatch("removeRightView", true);
    this.$store.dispatch("checkAllSwitch", true);
  }
};
</script>

<style lang="scss" scoped >
.xx {
  height: 100%;
  .search-wrap {
    .el-tag {
      left: 0px;
      top: 0px;
      border: none;
      padding-left: 10px;
      padding-right: 0;
    }
    .tag-group {
      height: 40px;
      background: #f5f5f5;
      border-radius: 4px 0 0 4px;
      flex: 1;
      line-height: 40px;
      position: static;
    }
    position: relative;
    width: 50%;
    margin: 120px auto;
    .search-top {
      width: 100%;
      height: 40px;
      position: relative;
      display: flex;
      input {
        width: 100%;
        height: 100%;
        outline: none;
        padding-right: 120px;
        padding-left: 10px;
        border: none;
        background: #f5f5f5;
        transition: 0.3s all ease;
        border-radius: 4px 0 0 4px;
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
        line-height: 40px;
        cursor: pointer;
        border-radius: 0 4px 4px 0;
        transition: 0.3s all ease;
        &:hover {
          opacity: 0.8;
        }
      }
    }
    & > p {
      margin-top: 20px;
      font-size: 12px;
      color: #999;
    }
    ul {
      display: flex;
      margin-top: 12px;
      list-style: none;
      flex-wrap: wrap;
      li {
        margin-top: 6px;
        padding-right: 12px;
        margin-right: 12px;
        justify-content: flex-start;
        position: relative;
        background: #ebf0f9;
        border-radius: 4px;
        padding: 4px 8px;
        cursor: pointer;
        transition: 0.3s all ease;
        &:hover i {
          display: block;
        }
        &:hover p {
          font-size: 14px;
          cursor: pointer;
          color: #386cca;
        }
        i {
          display: none;
          width: 12px;
          height: 12px;
          text-align: center;
          font-size: 12px;
          position: absolute;
          right: -4px;
          top: -6px;
          color: #999;
          background: #fff;
          border-radius: 50%;
          cursor: pointer;
          &:hover {
            color: #333;
          }
        }
      }
    }
  }
  .search-img {
    width: 30%;
    position: absolute;
    bottom: 100px;
    right: 80px;
  }
  /*
  <div class="recommend">
          <div class="title">
            <p>推荐</p>
            <span>以下信息根据您的兴趣推荐</span>
          </div>
          <div class="rec-wrap">
            <div class="no-data"></div>
          </div>
      </div>*/
  .recommend {
    width: 70%;
    margin: 0 auto;
    .title {
      &:after {
        content: "";
        display: block;
        clear: both;
        margin-bottom: 20px;
      }
      p {
        font-size: 16px;
        color: #333;
        line-height: 1;
        float: left;
        margin-right: 30px;
      }
      span {
        font-size: 12px;
        color: #999;
        line-height: 1;
        margin-top: 4px;
        float: left;
      }
    }
    .rec-wrap {
      border: 1px solid #e8e8e8;
      height: 360px;
      text-align: center;
      img {
        width: 160px;
        height: 160px;
        margin: 82px 0 20px 0;
      }
      p {
        color: #999;
        font-size: 16px;
      }
    }
  }
}
</style>

