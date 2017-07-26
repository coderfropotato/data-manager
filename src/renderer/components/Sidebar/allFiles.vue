<template>
  <div id="fileDirectory-root">
    <el-row class="box">
      <el-col :span="8"><span>所有文件</span></el-col>
      <el-col :span="8">
        <el-button>+</el-button>
      </el-col>
      <el-col :span="8">
        <el-button>收起</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    name: 'AllFiles'
  }
</script>
<style lang="scss" scoped>
  .box {
    width: 14em;
  }
</style>
