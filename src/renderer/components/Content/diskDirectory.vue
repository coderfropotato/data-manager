<template>
  <div class="diskDirectory-root">
    <div class="grid-display">
      <div class="grid-items">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(item,index) in displayData" :key="index">
            <!--TODO：添加编辑按钮-->
            <div class="grid-item" @click="getNextDirectory(item.item, item)">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-wenjian"></use>
              </svg>
              <div class="file-name">
                <el-tooltip :content="item.name" placement="top">
                  <span>{{item.name}}</span>
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
  // import bus from '@/assets/JS/bus'

  export default {
    name: 'DiskDirectory',
    data () {
      return {
        dirData: {},
        displayData: [],
        // 记录浏览记录
        historyMap: new Map()
      }
    },
    computed: mapState({
      rowDirData: state => state.files.currentDiskDirTree,
      currentPath: state => state.files.currentPath
    }),
    watch: {
      rowDirData () {
        this.displayData = []
        // 去除磁盘层
        for (let item in this.rowDirData) {
          Object.assign(this.dirData, this.rowDirData[item])
          // 在根目录上附加磁盘序列号
          this.dirData.serialNumber = item.split('*').pop()
        }
        // 解析根目录
        for (let item in this.dirData) {
          // 去除信息条目
          if (item === '__info__' || item === 'serialNumber') {
            continue
          }
          // 判断是否为根目录（根目录含有'/'和别名）
          // 记录根目录的别名
          let name
          let isRoot = item.indexOf('/')
          if (isRoot >= 0) {
            name = this.dirData[item].__info__.alias
          }
          // 记录路径和磁盘序列号
          let obj = {
            name,
            item,
            serialNumber: this.dirData.serialNumber,
            path: item + '/'
          }
          this.displayData.push(obj)
        }
        // 记录当前浏览文件夹的数据
        this.historyMap.set(this.currentPath, {
          displayData: this.displayData,
          dirData: this.dirData
        })
      },
      currentPath () {
        // 如果历史记录中存在所选路径，则进行浏览，否则不做任何处理
        if (this.historyMap.has(this.currentPath)) {
          this.displayData = this.historyMap.get(this.currentPath).displayData
          this.dirData = this.historyMap.get(this.currentPath).dirData
        }
      }
    },
    methods: {
      // 进入文件夹的下一层
      getNextDirectory (name, selectedItem) {
        // 判断是否为文件夹
        if (Object.keys(this.dirData[name]).length === 1) {
          return
        }

        // 先记录磁盘序列号
        let serialNumber = selectedItem.serialNumber
        // 记录真实的路径，currentPath 记录的导航面包屑路径，不是真实的路径
        let parentPath = selectedItem.path
        this.dirData = this.dirData[name]
        // 设置下一层次的磁盘序列号
        this.dirData.serialNumber = serialNumber

        // 设置导航面包屑路径
        if (name.indexOf('/') >= 0) {
          name = name.substr(name.indexOf('/') + 1)
        }
        let path = this.currentPath + name + '/'
        this.$store.commit('setCurrentPath', path)

        // 生成新的显示数组
        this.displayData = []
        for (let item in this.dirData) {
          if (item === '__info__' || item === 'serialNumber') {
            continue
          }
          let obj = {
            name: item,
            item,
            serialNumber: this.dirData.serialNumber,
            path: parentPath + item + '/'
          }
          this.displayData.push(obj)
        }
        // 记录当前浏览文件夹的数据
        this.historyMap.set(this.currentPath, {
          displayData: this.displayData,
          dirData: this.dirData
        })
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
