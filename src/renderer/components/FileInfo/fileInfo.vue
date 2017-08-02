<template>
  <div id="fileInfo-root" v-if="show">
    <div class="info-title">
      <span>文件详情</span>
      <el-button size="mini">编辑</el-button>
    </div>
    <div class="basic-info" v-if="basicInfo">
      <span class="title">基本信息</span>
      <div class="basic-info-items">
        <span class="item-name">{{basicInfo.name}}</span>
        <span>文件类型：{{basicInfo.type}}</span>
        <span>文件大小：{{basicInfo.size}}</span>
        <span>创建时间：{{basicInfo.createTime}}</span>
      </div>
    </div>
    <!--<div class="DataSource" v-if="otherInfo">-->
    <!--<span>数据来源</span>-->
    <!--<span>类别：{{otherInfo.sourceData.type}}</span>-->
    <!--<span>数据源：{{otherInfo.sourceData.name}}</span>-->
    <!--<el-button size="mini" @click="otherInfo.sourceData.url">-->
    <!--<span>访问</span>-->
    <!--<svg class="icon" aria-hidden="true">-->
    <!--<use xlink:href="#icon-arrow"></use>-->
    <!--</svg>-->
    <!--</el-button>-->
    <!--</div>-->
    <div class="organization">
      <div class="title">
        组织分类
      </div>
      <div class="sort">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-wenjian"></use>
        </svg>
        <!--当分类条目较多时，条目和按钮为一个整体，计算样式-->
        <div class="item-wrapper">
          <!--分类的条目-->
          <div class="sort-items">
            <el-button size="mini">一二fasdfadsf</el-button>
            <el-button size="mini">一二fasfsad</el-button>
            <el-button size="mini">一二</el-button>
            <el-button size="mini">一二fads</el-button>
            <el-button size="mini">添加分类</el-button>
            <el-button size="mini">+</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'

  export default {
    name: 'FileInfo',
    data () {
      return {}
    },
    computed: mapState({
      show: state => state.fileInfo.show,
      basicInfo: state => state.fileInfo.basicInfo,
      otherInfo: state => state.fileInfo.otherInfo
    })
  }
</script>
<style lang="scss" scoped>
  #fileInfo-root {
    height: 100%;
    width: 100%;
    background-color: rgba(242, 242, 242, 0.6);
    padding: 0.5em 1em;
  }
  // 所有子标题的公共样式
  .title {
    margin-top: 1em;
    font-size: 1.1em;
    font-weight: 500;
  }
  .info-title {
    margin: 1em 0;
    font-weight: 500;
    span {
      font-size: 1.2em;
    }
    .el-button {
      float: right;
      margin-right: 1em;
      margin-top: 0.2em;
      width: 3.5em;
    }
  }

  .basic-info {
    .basic-info-items {
      margin: 0.5em 0 0 1em;
      span {
        display: block;
        font-size: 0.8em;
        margin: 0.5em 0;
      }
      .item-name{
        font-size: 0.9em;
        font-weight: 500;
        margin: 1em 0;
      }
    }
  }

  .organization{
    .sort{
      position: relative;
      margin: 1em;
      .icon{
        float: left;
        font-size: 1.4em;
      }
      .item-wrapper{
        position: absolute;
        top: 0;
        left: 2em;
        .el-button{
          font-size: 0.8em;
          margin: 0.2em 0;
        }
      }
    }
  }
</style>
