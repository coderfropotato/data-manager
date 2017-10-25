<!--划分三栏组件-->
<template>
  <div id='index-root'>
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
</template>

<script>
// 侧边栏导航组件
import Sidebar from "./sidebar/sidebar";
// 内容区组件
import ContentZone from "./content/content";
// 文件详情区组件
import FileAside from "./fileAside/fileAside";
// jQuery 插件，可拖拽改变 div 宽度
import $ from "jquery";
import "jquery-resizable-dom/src/jquery-resizable";
import { mapState } from "vuex";
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
  computed: {
    ...mapState(["fileInfo"])
  },
  components: {
    Sidebar,
    ContentZone,
    FileAside
  }
};
</script>

<style lang='scss' scoped>
// 整体三栏可调布局
#index-root {
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;

  // 设置高度为 100%
  .sidebar-wrapper,
  .content-wrapper,
  .file-wrapper {
    height: 100%;
  }

  // 分隔条
  .splitter-left,
  .splitter-right {
    flex: 0 0 auto;
    width: 2px;
    height: 100%;
    cursor: col-resize;
    background-color: #5e7382;
  }

  // 侧边栏宽度
  .sidebar-wrapper {
    flex: 0 0 auto;
    width: 300px;
    min-width: 230px;
    max-width: 60%;
  }

  // 内容区宽度
  .content-wrapper {
    flex: 0 0 auto;
    width: 65%;
    max-width: 80%;
    min-width: 600px;
  }

  .content-wrapper-hide {
    flex: 0 0 auto;
    width: 100%;
  }

  // flex 布局右样式
  .right,
  .file-wrapper {
    display: flex;
    flex-direction: row;
    flex: 1 1 auto;
    width: 100%;
    min-width: 200px;
  }
}
</style>
