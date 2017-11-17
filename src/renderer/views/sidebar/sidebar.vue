<template>
  <div id="sidebar-root" v-loading.fullscreen.lock="fullScreenLoading">
    <!--固定加载区域-->
    <div class="nav-menu" ref="navMenu">
      <el-col :span="24">
        <!-- <el-menu  class="menu" router >
          <el-menu-item @click="Jump('0')" index="/files" >
            <i class="iconfont icon-wenjian"></i>
            <span>文件</span>
          </el-menu-item>
          <el-menu-item  @click="Jump('1')" index="/searchindex">
            <i class="iconfont icon-sousuo"></i>
            <span>搜索</span>
          </el-menu-item>
          <el-menu-item  @click="Jump('2')" index="/filestatus">
            <i class="iconfont icon-wenjianzhuangtai"></i>
            <el-badge :value="modifiedFiles" :max="99" class="item">
              <span>文件状态</span>
            </el-badge>
          </el-menu-item>
          <el-menu-item @click="Jump('3')" index="/collection">
            <i class="iconfont icon-wenjian"></i>
            <span>小工具</span>
          </el-menu-item>
          <el-menu-item  @click="Jump('4')" index="/database">
            <i class="iconfont icon-shujuku"></i>
            <span>数据库</span>
          </el-menu-item>
        </el-menu> -->
        <ul>
          <li :class="{'active':globalNavIndex===1}" @click="jump(1)" >
            <i class="iconfont icon-wenjian"></i>
            <span>文件</span>
          </li>
          <li :class="{'active':globalNavIndex===2}" @click="jump(2)">
            <i class="iconfont icon-sousuo"></i>
            <span>搜索</span>          
          </li>
          <li :class="{'active':globalNavIndex===3}" @click="jump(3)">
            <i class="iconfont icon-wenjianzhuangtai"></i>
            <el-badge :value="modifiedNumber" :max="99" class="item">
              <span>文件状态</span>
            </el-badge>
          </li>
          <li :class="{'active':globalNavIndex===4}" @click="jump(4)">
            <i class="iconfont icon-wenjian"></i>
            <span>小工具</span>
          </li>
          <li :class="{'active':globalNavIndex===5}" @click="jump(5)">
            <i class="iconfont icon-shujuku"></i>
            <span>数据库</span>
          </li>
        </ul>
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
import $ from "jquery";
export default {
  name: "Sidebar",
  data() {
    return {
      fullScreenLoading: false
    };
  },
  computed: {
    ...mapGetters(["modifiedNumber", "globalNavIndex"])
  },
  mounted() {
    $(".nav-menu ul li")
      .on("mouseover", function() {
        if ($(this).hasClass("active")) {
          $(".nav-menu ul li").removeClass("hover");
          return;
        } else {
          $(".nav-menu ul li").removeClass("hover");
          $(this).addClass("hover");
        }
      })
      .on("mouseout", function() {
        $(".nav-menu ul li").removeClass("hover");
      });
  },
  methods: {
    jump(index) {
      this.$store.dispatch("setGlobalNavIndex", index).then(_ => {
        switch (this.globalNavIndex) {
          case 1:
            this.$router.push("/files");
            this.$store.dispatch("resetFileInfo");
            this.$store.dispatch("setRouteStatus", "file");
            //重新获取设备列表
            //this.$store.dispatch("getImportTargetDisks");
            break;
          case 2:
            this.$router.push("/searchindex");
            this.$store.dispatch("resetFileInfo");
            this.$store.dispatch("setRouteStatus", "search");
            //重新获取设备列表
            //this.$store.dispatch("getImportTargetDisks").then(_ => {
              //default selected all
              this.$store.dispatch("checkAllSwitch", true);
            //});
            break;
          case 3:
            this.$router.push("/filestatus");
            this.$store.dispatch("resetFileInfo");
            this.$store.dispatch("setRouteStatus", "status");
            //重新获取设备列表
            this.$store.dispatch("getImportTargetDisks").then(_=>{
              this.$store.dispatch('getModifiedFiles')
            })
            break;
          case 4:
            this.$router.push("/collection");
            this.$store.dispatch("setRouteStatus", "tools");
            break;
          case 5:
            this.$router.push("/database");
            this.$store.dispatch("setRouteStatus", "database");
            break;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
$backgroundColor: #f7f9f9;
#sidebar-root {
  position: relative;
  background-color: $backgroundColor;
  height: 100%;
  ul {
    width: 100%;
    li {
      height: 60px;
      line-height: 48px;
      padding: 6px 40px;
      cursor: pointer;
      &.active {
        color: #fff;
        background: #386cca;
        span {
          color: #fff;
        }
      }
      &.hover {
        background-color: #d1dbe5;
      }
      i {
        margin-right: 12px;
      }
    }
  }
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
    &.is-fixed {
      top: 2em;
      right: -4px;
    }
  }
}
</style>
