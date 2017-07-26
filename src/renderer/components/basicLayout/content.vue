<template>
  <div id="content-root">
    <div class="header">
      <el-dropdown>
        <!--<el-button type="primary">-->
        <!--</el-button>-->
        <button>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-menu"></use>
          </svg>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xiala"></use>
          </svg>
        </button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Content'
  }
</script>
<style lang="scss" scoped>
  #content-root{
    height: 100%;
    .header{
      height: 3em;
      background-color: #eef1f6;
      button{
        font-size: 16px;
        height: 1.8em;
        width: 3.6em;
        margin: 0.6em 1em;
        background-color: #eef1f6;
        border-radius: 0.2em;
        border: 1px solid #48576a;
        outline: 1px solid #eef1f6;
        cursor: pointer;
        .icon{
          font-size: 1.2em;
        }
      }
    }
  }


</style>
