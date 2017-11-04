<template>
  <div id="searchIndex">
      <div class="search-wrap">
          <div class="search-top">
              <input type="text" v-model.trim="searchVal" placeholder="请输入关键词">
            <span @click="search">搜索</span>
          </div>
          <p>搜索历史记录</p>
          <ul>
              <li v-for="(val,index) in searchHistory" :key="index">
                  <p @click="searchVal = val">{{val}}</p>
                  <span @click="deleteHis(index)">ｘ</span>
              </li>
          </ul>
      </div>
  </div>
</template>

<script>
import localforage from "localforage";
export default {
  data() {
    return {
      searchVal: "",
      searchHistory: []
    };
  },
  methods: {
    search() {
      if (this.searchVal) {
        let _this = this;
        this.$router.push("/search");

        //设置搜索历史
        this.searchHistory.unshift(this.searchVal);
        this.searchHistory.length = 10;
        this.searchVal = "";
        localforage.setItem("searchHistory", _this.searchHistory);
      }else{
        this.$message('请输入关键词');
      }
    },
    deleteHis(index) {
      this.searchHistory.splice(index, 1);
    }
  },
  activated() {
    let _this = this;
    this.searchHistory = localforage.getItem("searchHistory", (err, res) => {
      if (!err) {
        _this.searchHistory = res;
      }
    });
  }
};
</script>

<style lang="scss" scoped >
.search-wrap {
  width: 520px;
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
      padding-left: 12px;
      border: none;
      background: #f5f5f5;
    }
    span {
      position: absolute;
      width: 110px;
      height: 100%;
      font-size: 14px;
      color: #fff;
      background: #386cca;
      top: 0;
      right: 0;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
      border-radius: 0 4px 4px 0;
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
      &:hover span {
        display: block;
      }
      p {
        font-size: 14px;
        cursor: pointer;
        &:hover {
          color: #386cca;
        }
      }
      span {
        display: none;
        width: 12px;
        height: 12px;
        text-align: center;
        font-size: 12px;
        line-height: 12px;
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
</style>

