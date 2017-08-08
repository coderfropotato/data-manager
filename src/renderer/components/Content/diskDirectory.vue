<template>
  <div class="diskDirectory-root">
    <div class="grid-display">
      <div class="grid-items">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(item,index) in displayData" :key="index">
            <!--TODO：添加编辑按钮-->
            <div class="grid-item" @click="getNextDirectory(item)">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-wenjian"></use>
              </svg>
              <div class="file-name">
                <el-tooltip :content="item" placement="top">
                  <span>{{item}}</span>
                </el-tooltip>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'

  export default {
    name: 'DiskDirectory',
    data () {
      return {
        dirData: {},
        displayData: []
      }
    },
    computed: mapState({
      rowDirData: state => state.files.currentDiskDirTree
    }),
    watch: {
      rowDirData () {
        this.displayData = []
        for (let item in this.rowDirData) {
          this.dirData = this.rowDirData[item]
        }
        for (let item in this.dirData) {
          if (item.indexOf('*') >= 0) {
            item = item.split('*')[0]
          }
          if (item === '__info__') {
            continue
          }
          this.displayData.push(item)
        }
      }
    },
    methods: {
      getNextDirectory (selectedItem) {
        // 判断是否为文件夹
        if (Object.keys(this.dirData[selectedItem]).length === 1) {
          return
        }
        this.dirData = this.dirData[selectedItem]
        this.displayData = []
        for (let item in this.dirData) {
          if (item.indexOf('*') >= 0) {
            item = item.split('*')[0]
          }
          if (item === '__info__') {
            continue
          }
          this.displayData.push(item)
        }
      }
    }
  }
</script>
<style lang="scss">
  .diskDirectory-root {
    .grid-display {
      .grid-item {
        text-align: center;
        margin: 1em;
        .icon {
          font-size: 3em;
        }
        .file-name {
          font-size: 0.8em;
          margin: 1em;
        }
      }
    }
  }
</style>
