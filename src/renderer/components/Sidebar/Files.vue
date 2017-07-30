<template>
  <div id="fileDirectory-root">
    <div class="allFiles">
      <div class="title">
        <span>所有文件</span>
        <el-button size="mini" @click="trigShow" data-name="allFiles">{{content.allFiles}}</el-button>
        <el-button size="mini">+</el-button>
      </div>
      <div class="disks" v-show="show.allFiles">
        <div class="disk">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-diannao"></use>
          </svg>
          <div class="disk-title">
            我的电脑
          </div>
        </div>
        <div class="disk">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-harddisk"></use>
          </svg>
          <div class="disk-title">
            HRTLLFLFLKDS
          </div>
        </div>
      </div>
    </div>
    <div class="sortFiles">
      <div class="title">
        <span>分类</span>
        <el-button size="mini" @click="trigShow" data-name="sortFiles">{{content.sortFiles}}</el-button>
        <el-button size="mini">+</el-button>
      </div>
      <el-tree :data="data" :props="defaultProps" v-show="show.sortFiles"></el-tree>
    </div>
    <div class="others">
      <div class="title">
        <span>其他</span>
        <el-button size="mini" @click="trigShow" data-name="others">{{content.others}}</el-button>
      </div>
      <div class="trash" v-show="show.others">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-huishouzhan"></use>
        </svg>
        <div class="trash-title">
          回收站
        </div>
      </div>
    </div>
  </div>
</template>
<!--分离JS文件-->
<script src="../../assets/JS/Sidebar/files.js"></script>

<style lang="scss" scoped>
  #fileDirectory-root{
    margin: 0 2em 0 1.5em;
  }
  .title {
    margin: 0.5em 0;
    span {
      font-size: 0.8em;
      margin: 0 1em;
    }
    .el-button {
      float: right;
      margin: 0 0.5em;
    }
    .el-button:nth-child(2) {
      width: 4em;
    }
  }
  .disk,
  .trash{
    height: 2.4em;
    line-height: 2.4em;
    .icon{
      float: left;
      font-size: 1em;
      margin: 0.5em 0.5em 0.5em 1.5em;
    }
    .disk-title,
    .trash-title{
      font-size: 0.8em;
      float: left;
    }
  }
  .el-tree {
    background-color: inherit;
    border: none;
    margin: 0.3em 1em;
  }
</style>
