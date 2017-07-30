<template>
  <div id="content-root">
    <router-view name="ContentHeader"></router-view>
    <router-view name="ContentMiddle"></router-view>
    <router-view name="ContentList"></router-view>
  </div>
</template>
<script>
  export default {
    name: 'Content'
  }
</script>
<style lang="scss">
  #content-root {
    height: 100%;
    .header {
      height: 3em;
      line-height: 3em;
      background-color: #eef1f6;
      // 按钮样式
      button {
        font-size: 16px;
        height: 1.6em;
        width: 3.2em;
        margin: 0.6em 1em;
        background-color: #eef1f6;
        border-radius: 0.2em;
        border: 1px solid #48576a;
        outline: 1px solid #eef1f6;
        cursor: pointer;
        .icon {
          font-size: 1.2em;
        }
      }
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
  #list-root{
    margin-top: 1em;
  }
</style>
