<!--划分三栏组件-->
<template>
  <div id='index-root' >
    <div class="header-wrap">
      <Header></Header>
    </div>
    <div id="index-content">
      <div class='sidebar-wrapper'>
        <Sidebar></Sidebar>
      </div>
      <div class="splitter-left"></div>
      <div class="right">
        <div  :class="{'content-wrapper':!  fileInfo.removeRightView,'content-wrapper-hide':fileInfo.removeRightView}">
          <ContentZone></ContentZone>
        </div>
        <div v-show="!fileInfo.removeRightView" class='splitter-right'></div>
        <div v-show="!fileInfo.removeRightView" class='file-wrapper'>
          <FileAside></FileAside>
        </div>
      </div>
    </div>
    <!-- 文件，搜索，文件状态需要显示bottom file status -->
    <div v-show="bottom.bottomShow" id="bottom">
      <Bottom></Bottom>
    </div>
  </div>
</template>

<script>
import Sidebar from "./sidebar/sidebar";
import ContentZone from "./content/content";
import FileAside from "./fileAside/fileAside";
import $ from "jquery";
import "jquery-resizable-dom/src/jquery-resizable";
import { mapState, mapGetters } from "vuex";

export default {
  name: "Index",
  mounted() {
    // 挂载可变区域
    $(".sidebar-wrapper").resizable({
      handleSelector: ".splitter-left",
      resizeWidth: true,
      resizeHeight: false
    });
    $(".content-wrapper").resizable({
      handleSelector: ".splitter-right",
      resizeWidth: true,
      resizeHeight: false
    });
  },
  created() {
    // if (!this.isLogin) {
    //   this.$router.push("/login");
    // }
      console.log()
  },
  computed: {
    ...mapState(["fileInfo", "bottom"]),
    ...mapGetters(["isLogin"])
  },
    mounted(){
      console.log("fileInfo")
      console.log(this.fileInfo);
    },
    // 局部注册组件
  components: {
    Sidebar,
    ContentZone,
    FileAside
  }
};
</script>

<style lang='scss' >
// 整体三栏可调布局
#index-root {
  display: flex;
  height: 100%;
  flex-direction: column;
  .header-wrap {
    height: 66px;
  }
}
#index-content {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
  border-top: 1px solid #fff;

  // 设置高度为 100%
  .sidebar-wrapper,
  .content-wrapper,
  .file-wrapper {
    border-bottom: 1px solid #ccc;
    height: 100%;
  }

  // 分隔条
  .splitter-left,
  .splitter-right {
    flex: 0 0 auto;
    width: 6px;
    cursor: col-resize;
    background-color: #eee;
  }

  // 侧边栏宽度
  .sidebar-wrapper {
    flex: 0 0 auto;
    width: 240px;
    min-width: 240px;
    max-width: 25%;
    * {
      cursor: normal;
    }
  }

  // 内容区宽度
  .content-wrapper {
    flex: 0 0 auto;
    width: 65%;
    max-width: 75%;
    min-width: 65%;
  }

  .content-wrapper-hide {
    flex: 0 0 auto;
    width: 100% !important;
  }

  // flex 布局右样式
  .right,
  .file-wrapper {
    display: flex;
    flex-direction: row;
    flex: 1 1 auto;
    width: 100%;
    min-width: 200px;
    cursor: default;
  }
}
</style>
