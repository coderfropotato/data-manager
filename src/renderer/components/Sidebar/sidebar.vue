<template>
  <div id="sidebar-root">
    <div class="nav-menu" ref="navMenu">
      <el-col :span="24">
        <!--router 激活导航，以index为path-->
        <el-menu class="menu" router>
          <el-menu-item index="/files" @click="openFile">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhuye"></use>
            </svg>
            <span>文件</span>
          </el-menu-item>
          <el-menu-item index="/search">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-sousuo"></use>
            </svg>
            <span>搜索</span>
          </el-menu-item>
          <el-menu-item index="/recentimport">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-import"></use>
            </svg>
            <span>文件状态</span>
          </el-menu-item>
          <el-menu-item index="/collection">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shoucang"></use>
            </svg>
            <span>收藏</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </div>
    <div class="line" ref="line"></div>

    <!--根据选择加载视图-->
    <div class="middle" ref="middle" @click="updateStyle">
      <div class="middle-inner" ref="middleInner">
        <router-view></router-view>
      </div>
    </div>

    <div class="bottom" ref="bottom">
      <el-popover
          ref="popoverAdd"
          placement="right"
          width="200"
          trigger="click">
        <el-menu @select="openNewWindow">
          <el-menu-item
              v-for="(item, index) in newDirList"
              :key="item.title" :index="item.url">
            {{item.title}}
          </el-menu-item>
        </el-menu>
      </el-popover>
      <!--添加文件按钮 这里IDE可能会显示红色-->
      <el-button type="text" class="add" v-popover:popoverAdd>+</el-button>

      <!--设置-->
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-setting"></use>
      </svg>
    </div>
  </div>
</template>
<!--分离JS文件-->
<script src="../../assets/JS/Sidebar/sidebar.js"></script>
<!--分离SCSS文件-->
<style src="../../assets/SCSS/sidebar.scss" lang="scss" scoped></style>
