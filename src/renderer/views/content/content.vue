<template>
  <div id="content-root">
    <keep-alive>
      <router-view name="ContentHeader"></router-view>
    </keep-alive>
    <keep-alive>
      <router-view name="ContentBottom"></router-view>
    </keep-alive>
  </div>
</template>
<script>
export default {
  name: "Content"
};
</script>
<style lang="scss" scoped>
#content-root {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
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
