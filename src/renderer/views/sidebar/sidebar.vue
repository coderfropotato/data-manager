<template>
  <div id="sidebar-root" v-loading.fullscreen.lock="fullScreenLoading">
    <!--固定加载区域-->
    <div class="nav-menu" ref="navMenu">
      <el-col :span="24">
        <!--router 激活导航，以index为path-->
        <el-menu class="menu" router>
          <el-menu-item index="/files" @click="openFile">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-wenjian"></use>
            </svg>
            <span>文件</span>
          </el-menu-item>
          <el-menu-item index="/search?type=search">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-search1"></use>
            </svg>
            <span>搜索</span>
          </el-menu-item>
          <el-menu-item index="/filestatus">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-wenjianjia"></use>
            </svg>
            <!--角标，提醒文件更改数量，最大99-->
            <el-badge :value="modifiedFiles" :max="99" class="item">
              <span>文件状态</span>
            </el-badge>
          </el-menu-item>
          <el-menu-item index="/collection">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-star-empty"></use>
            </svg>
            <span>收藏</span>
          </el-menu-item>
          <el-menu-item index="/database">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shujuku"></use>
            </svg>
            <span>数据库</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </div>

    <div class="line" ref="line"></div>
    <!--根据选择加载组件-->
    <div class="middle" ref="middle">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
    </div>
  </div>
  
</template>

<script>
import { ipcRenderer } from "electron";
import bus from "@/utils/bus";
import { mapGetters } from "vuex";

export default {
  name: "Sidebar",
  data() {
    return {
      fullScreenLoading: false
    };
  },
  computed: mapGetters({
    modifiedFiles: "modifiedNum"
  }),
  methods: {
    // 获取文件
    openFile() {
      // this.fullScreenLoading = true
      if (
        this.$store.state.files.allFiles.length &&
        Object.keys(this.$store.state.files.categoryDirRowData).length
      ) {
        this.fullScreenLoading = false;
      } else {
        this.$store.dispatch("openFile").then(() => {
          this.fullScreenLoading = false;
        });
      }
    }
  }
};
</script>
<style lang="scss">
$backgroundColor: #f7f9f9;
#sidebar-root {
  position: relative;
  background-color: $backgroundColor;
  height: 100%;
  .nav-menu {
    overflow: hidden;
    height: 45%;
    .el-menu {
      background-color: $backgroundColor;
    }
  }
  .el-menu-item {
    font-size: 0.9em;
    padding-left: 2em !important;
    span {
      margin-left: 0.3em;
    }
    .icon {
      position: relative;
      font-size: 1.4em;
      display: inline-block;
    }
  }

  .line {
    height: 1px;
    width: 90%;
    background-color: #ccc;
    margin: 1em auto;
  }

  .middle {
    position: relative;
    width: 100%;
    height: 48%;
    overflow-y: scroll;
  }

  .el-popover {
    .el-menu-item {
      font-size: 1.2em;
      padding-left: 1em !important;
    }
  }
  // 文件更改状态角标样式
  .el-badge__content {
    top: 1em;
    right: 4px;
  }
}


</style>
