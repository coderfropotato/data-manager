<template>
  <div id="diskDirectory-root">
    <div class="grid-display">
      <div class="grid-items">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(item,index) in displayData" :key="index">
            <!--TODO：添加编辑按钮-->
            <div class="grid-item" @dblclick="getNextDirectory(item.item, item)">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-wenjian1" v-if="!item.isFile"></use>
                <use xlink:href="#icon-file" v-if="item.isFile"></use>
              </svg>
              <div class="file-name">
                <el-tooltip :content="item.name" placement="top" :open-delay="2000">
                  <span>{{item.name | formatName(10)}}</span>
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
  import {mapGetters} from 'vuex'
  import scrollBar from '@/utils/headerScrollbar'
  import bus from '@/utils/bus'

  export default {
    name: 'DiskDirectory',
    data () {
      return {
        // 记录当前浏览界面的文件夹树的信息对象
        dirData: {},
        displayData: [],
        // 记录浏览记录
        historyMap: new Map()
      }
    },
    computed: mapGetters({
      rowDirData: 'currentDiskDirTree',
      currentPath: 'currentPath'
    }),
    watch: {
      rowDirData () {
        bus.$emit('loading-end')
        // 当原始数据发生变化时，重新刷新计算（第一次请求加载数据）
        this.dirData = {}
        this.historyMap = new Map()
        this.displayData = []

        // 去除磁盘层，记录磁盘序列号
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
          if (isRoot === 0) {
            name = this.dirData[item].__info__.alias
          }
          // 记录真实路径和磁盘序列号
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
        // 路径变化，重新计算路径长度
        scrollBar()
        // 如果历史记录中存在所选路径，则进行浏览，否则不做任何处理
        if (this.historyMap.has(this.currentPath)) {
          this.displayData = this.historyMap.get(this.currentPath).displayData
          this.dirData = this.historyMap.get(this.currentPath).dirData
        }
      }
    },
    filters: {
      formatName (name, maxLength) {
        if (name !== undefined) {
          return name.length > maxLength ? name.substr(0, maxLength - 1) + '...' : name
        }
      }
    },
    methods: {
      /*
      * 进入文件夹的下一层
      * 先通过对象属性的长度判断是否为文件夹，若不是，直接返回
      * 记录磁盘序列号，以赋值给下一层需要显示的数据，方便直接获取文件或文件夹的信息
      * 记录真实的路径，以利用 dirData 对象读取某个文件夹内的文件信息对象
      * 然后把下一层的文件信息对象赋值给 dirData，遍历 dirData 的属性，生成显示数组，添加路径，序列号等需要的属性
      * 将浏览记录放如 historyMap，以实现回滚浏览器
      * */
      getNextDirectory (name, selectedItem) {
        // 判断是否为文件夹
        if (Object.keys(this.dirData[name]).length === 1) {
          return
        }

        // 先记录磁盘序列号
        let serialNumber = selectedItem.serialNumber
        // 记录真实的路径，currentPath 记录的导航面包屑路径，不是真实的路径
        let parentPath = selectedItem.path

        // 读取下一层的信息对象
        this.dirData = this.dirData[name]
        // 设置下一层次的磁盘序列号
        this.dirData.serialNumber = serialNumber

        // 设置导航面包屑路径，面包屑路径需要用别名（name），而不是 item
        let path = this.currentPath + selectedItem.name + '/'
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
            path: parentPath + item + '/',
            isFile: false
          }
          if (Object.keys(this.dirData[item]).length === 1) {
            obj.isFile = true
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
  #diskDirectory-root {
    height: 100%;
    .grid-display {
      position: relative;
      height: 90%;
      -webkit-overflow-y: overlay;
      overflow-x: hidden;
      // 隐藏滚动条
      &::-webkit-scrollbar {
        display: none;
      }

      .grid-item {
        text-align: center;
        margin: 1em;
        height: 6em;
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
