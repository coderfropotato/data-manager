<template>
  <div id="fileStatus-root">
    <div class="title" @click="handlerAll"><span>所有文件</span></div>
      <ol class="height-range">
        <li @click="handlerClick(item.mark)" v-for="(item,index) in treeSideBar" :key="index"><i class="iconfile iconfont icon-wodeyingpan"></i>{{item.name}}</li>
      </ol>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import bus from "@/utils/bus";
export default {
  name: "fileStatusSidebar",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["treeSideBar"]),
  },
  methods: {
    handlerClick(mark) {
      bus.$emit("statueSideBarClick", mark);
    },
    handlerAll() {
      let pathArr = [];
      this.treeSideBar.map(val => {
        pathArr.push(val.mark);
        return '';
      });
      bus.$emit("statueSideBarClick", pathArr);
    }
  },
  activated(){
    //default select all
    this.handlerAll();
  }
};
</script>

<style lang="scss" scoped>
#fileStatus-root {
  height: 100%;
  width: 100%;
  font-size: 14px;
  color: #48576a;
  box-sizing: border-box;
  overflow-y: visible;
  .title {
    display: flex;
    justify-content: space-between;
    padding: 0 18px;
    span {
      cursor: pointer;
      &:hover {
        color: #386cca;
      }
    }
    i {
      cursor: pointer;
      line-height: 18px;
    }
  }
  p {
    font-size: 12px;
    text-align: right;
    padding-right: 12px;
    margin-top: 12px;
    cursor: pointer;
    &:hover {
      color: #386cca;
    }
  }
  ol {
    margin-top: 12px;
    list-style: none;
    position: relative;
    height: 190px;
    overflow: hidden;
    &.height-range {
      height: 80%;
      overflow-y: scroll;
    }
    li {
      padding-left: 50px;
      height: 38px;
      line-height: 38px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      cursor: pointer;
      .iconfile {
        margin-right: 12px;
      }
      &:hover {
        background: #386cca;
        color: #fff;
      }
    }
  }
}
</style>
