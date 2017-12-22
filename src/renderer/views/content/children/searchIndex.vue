<template>
<div class="xx">
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
  <div id="searchIndex">
      <div class="search-wrap">
          <div class="search-top">
              <input type="text" v-model.trim="searchVal" @keyup.enter="search" placeholder="请输入关键词">
              <div class="tag-group" v-if="searchRangeLength!==fileList.length"><el-tag color="#f5f5f5" type="gray">{{`在${searchRangeLength}个位置搜索`}}</el-tag></div>
              <div class="tag-group"  v-if="searchRangeLength===fileList.length"><el-tag color="#f5f5f5" type="gray">{{`在全局搜索`}}</el-tag></div>
              <em @click="search">搜索</em>
          </div>
          <p>历史搜索记录：</p>
          <ul>
              <li v-for="(val,index) in searchHistory" :key="index">
                  <p @click="searchVal = val">{{val}}</p>
                  <span @click="deleteHis(index)">ｘ</span>
              </li>
          </ul>
      </div>
      <img class="search-img" src="../../../assets/images/search-index.png" alt="">
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
    ...mapGetters(["searchRangeLength", "fileList"])
  },
  watch: {
    searchRangeLength: function() {
      this.computedInput();
    }
  },
  mounted() {
    bus.$on("computedInput", _ => {
      this.computedInput();
    });
  },
  methods: {
    computedInput() {
      let oW = $("#searchIndex .tag-group").width();
      $("#searchIndex  input").css("padding-left", oW + 10 + "px");
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
        this.$store.dispatch("searchFile", { context }).then(
          _ => {
            //console.log(_);
            this.searchVal = "";
            this.$store.dispatch("setRouteStatus", "search");
            this.$router.push("/search");
            this.$store.dispatch("setTotalCount", _.length);
            // reset search pos
            this.$store.dispatch("setSearchPos", "");
          },
          err => {
            if (!this.isMessage) {
              this.isMessage = true;
              this.$message({
                message: "请选择一个搜索范围",
                duration: 1200,
                onClose: _ => {
                  this.isMessage = false;
                }
              });
            }
          }
        );
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
    this.computedInput();

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
      padding: 0 10px;
    }
    .tag-group {
      height: 40px;
      line-height: 40px;
    }
    position: relative;
    width: 50%;
    margin: 120px auto;
    .search-top {
      width: 100%;
      height: 40px;
      background: #ccc;
      position: relative;
      input {
        width: 100%;
        height: 100%;
        outline: none;
        padding-right: 120px;
        padding-left: 100px;
        border: none;
        background: #f5f5f5;
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
        &:hover span {
          display: block;
        }
        &:hover p {
          font-size: 14px;
          cursor: pointer;
          color: #386cca;
        }
        span {
          display: none;
          width: 12px;
          height: 12px;
          text-align: center;
          font-size: 12px;
          line-height: 11.5px;
          position: absolute;
          right: -4px;
          top: -6px;
          color: #fff;
          background: #ccc;
          border-radius: 50%;
          cursor: pointer;
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
}
</style>

