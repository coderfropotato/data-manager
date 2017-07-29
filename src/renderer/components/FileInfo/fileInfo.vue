<template>
  <div id="fileInfo-root">
    <div class="title">
      <span>文件详情</span>
      <el-button size="mini">编辑</el-button>
    </div>
    <div class="basicProperty">
      <span>基本属性</span>
      <div class="fileIcon">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-file"></use>
        </svg>
        <span>{{fileName}}</span>
        <span>文件类型：{{fileType}}</span>
        <span>文件大小：{{fileSize}}</span>
        <span>创建时间：{{creatTime}}</span>
      </div>
    </div>
    <div class="DataSoure">
      <span>数据来源</span>
      <span>类别：{{type}}</span>
      <span>数据源：{{fileType}}</span>
      <el-button size="mini" @click="url">访问<svg class="icon" aria-hidden="true"><use xlink:href="#icon-arrow"></use></svg></el-button>
    </div>
    <div class="genoGroup">
      <span>参考基因组</span>
      <span>名称：{{type}}</span>
      <span>数据源：{{fileType}}</span>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'FileInfo',
    data () {
      return {
        fileName: 'fileName',
        fileType: 'fileType',
        fileSize: 'fileSize',
        creatTime: 'creatTime',
        type: 'type',
        dataSource: 'dataSource',
        name: 'name',
        url: 'url'
      }
    }
  }
</script>
<style lang="scss" scoped>
  #fileInfo-root {
    height: 100%;
    width: 100%;
    background-color: rgba(242, 242, 242, 0.6);
  }
  .title {
    margin:1em 0;
    span {
      margin-left: 0.6em;
      font-size: 1.2em;
    }
    .el-button {
      float: right;
      margin-right: 1em;
      margin-top: 0.2em;
      width: 3.5em;
    }
  }
  .basicProperty {
    span:nth-child(1) {
      margin-left: 1em;
      font-size: 0.8em;
    }
    .fileIcon {
      margin: 0.5em 0 0 1.5em;
      .icon {
        font-size: 3em;
      }
      span:nth-child(2) {
        float: right;
        margin-right: 1.5em;
      }
      span {
        display: block;
        font-size: 0.8em;
      }
    }
  }
  .DataSoure {
    margin-top: 1em;
    .el-button {
      margin-left: 0.5em;
      width: 4em;
      font-size: 0.7em;
      .icon {
        font-size:0.8em;
      }
    }
    span:nth-child(1) {
      margin-left: 1em;
      font-size: 0.8em;
    }
    span:nth-child(2) {
      display: block;
      font-size: 0.8em;
      margin-left: 2em;
    }
    span:nth-child(3) {
      display: inline-block;
      font-size: 0.8em;
      margin-left: 2em;
    }
  }
  .genoGroup {
    margin-top: 1em;
    span:nth-child(1) {
      margin-left: 1em;
      font-size: 0.8em;
    }
    span:nth-child(n+2) {
      display: block;
      font-size: 0.8em;
      margin-left: 2em;
    }
  }
</style>
