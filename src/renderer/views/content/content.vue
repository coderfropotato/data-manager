<template>
  <div id="content-root">
    <router-view name="ContentHeader"></router-view>
    <router-view name="ContentBottom"></router-view>
  </div>
</template>
<script>
  export default {
    name: 'Content'
  }
</script>
<style lang="scss">
  #content-root {
    position: relative;
    height: 100%;
    .header {
      height: 3em;
      line-height: 3em;
      background-color: #eef1f6;
      // 按钮样式
    }
  }

  // 下拉菜单
  .el-dropdown-menu {
    span {
      margin-left: 1em;
    }
  }

  #column {
    transform: rotate(90deg);
  }

  // List 组件
  #list-root {
    // margin-top: 1em;
  }
</style>
