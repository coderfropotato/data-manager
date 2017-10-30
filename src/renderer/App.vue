<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script>
export default {
  name: "data-manager-desktop",
  mounted() {
    // 禁用浏览器默认拖拽事件，防止用户拖拽的文件被打开
    document.addEventListener(
      "drop",
      e => {
        e.preventDefault();
      },
      false
    );
    document.addEventListener(
      "dragenter",
      e => {
        e.preventDefault();
      },
      false
    );
    document.addEventListener(
      "dragleave",
      e => {
        e.preventDefault();
      },
      false
    );
    document.addEventListener(
      "dragover",
      e => {
        e.preventDefault();
      },
      false
    );
  }
};
</script>

<style lang="scss">
@import "./assets/SCSS/common";
</style>
