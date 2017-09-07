<template>
  <div id="fileInfo-root" v-if="show">
    <div class="info-title">
      <span>文件详情</span>
      <router-link to="/filestatus">
        <el-button size="mini">编辑</el-button>
      </router-link>
    </div>
    <div class="basic-info" v-if="basicInfo">
      <span class="title">基本信息</span>
      <div class="basic-info-items">
        <el-tooltip :content="basicInfo.filename" placement="top">
          <span class="item-name">{{basicInfo.filename | formatName(10)}}</span>
        </el-tooltip>
        <span>文件类型：{{basicInfo.type}}</span>
        <span>文件大小：{{basicInfo.size | formatSize}}</span>
        <span>创建时间：{{basicInfo.ctime | formatDate}}</span>
      </div>
    </div>
    <div class="organization">
      <div class="title">
        组织分类
      </div>
      <div class="sort">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-wenjian"></use>
        </svg>
        <el-popover
            ref="addSort"
            placement="left-end"
            width="260">
          <div class="popover-sort-tree">
            <div class="popover-title">
              分类
            </div>
            <div class="sort-tree">
              <el-tree
                  node-key="id"
                  :data="sortFileTree"
                  show-checkbox
                  ref="sortTree"
                  check-strictly
                  :default-expanded-keys="tempData"
                  @check-change="setSortDir">
              </el-tree>
            </div>
          </div>
        </el-popover>
        <!--当分类条目较多时，条目和按钮为一个整体，计算样式-->
        <div class="item-wrapper">
          <!--分类的条目-->
          <div class="sort-items">
            <el-button size="mini" v-for="item in sorts" :key="item">{{item}}</el-button>
            <el-button size="mini" v-if="!sorts.length" @click="addFileSort" v-popover:addSort>
              添加分类
            </el-button>
            <el-button size="mini" v-if="sorts.length" v-popover:addSort @click="setCheckNode">
              +
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  let tempData = ['1/1.txt/', '1/2.2/3.2/', '1/2.4/3/', '1/2.txt/']
  let tempSort = []

  export default {
    name: 'FileInfo',
    data () {
      return {
        // 记录分类的数组
        sorts: [],
        tempData
      }
    },
    computed: mapGetters([
      'show',
      'basicInfo',
      'otherInfo',
      'sortFileTree'
      // sorts: state => state.fileInfo.fileSorts
    ]),
    watch: {
      show () {
        for (let node in tempData) {
          let path = tempData[node].split('/')
          path.pop()
          tempSort.push(path.join('>'))
        }
        this.sorts = tempSort
      }
    },
    filters: {
      // 格式化文件名，如果文件名大于某个长度，则做截断处理
      formatName (name, maxLength) {
        if (name !== undefined) {
          return name.length > maxLength ? name.substr(0, maxLength - 1) + '...' : name
        }
      },
      // 格式化文件大小，将
      formatSize (size) {
        if (size <= 0) {
          return '0 bytes'
        }
        const abbreviations = ['bytes', 'kB', 'MB', 'GB']
        const index = Math.floor(Math.log(size) / Math.log(1024))
        return `${+(size / Math.pow(1024, index)).toPrecision(3)} ${abbreviations[index]}`
      },
      // 格式化时间，将秒转化成 XXXX/XX/XX 形式
      formatDate (date) {
        let d = new Date(date * 1000)
        let month = '' + (d.getMonth() + 1)
        let day = '' + d.getDate()
        let year = d.getFullYear()
        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day
        return [year, month, day].join('/')
      }
    },
    methods: {
      addFileSort () {
      },
      setCheckNode () {
        // node-key 必须是唯一的，否则无法设置节点
        this.$refs.sortTree.setCheckedKeys(tempData)
      },
      // 设置分类的目录
      setSortDir () {
        // 清空分类数组
        this.sorts = []
        let checkedNodes = this.$refs.sortTree.getCheckedNodes()
        for (let node in checkedNodes) {
          let path = checkedNodes[node].id.split('/')
          path.pop()
          this.sorts.push(path.join('>'))
        }
      }
    }
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
      .item-name {
        font-size: 0.9em;
        font-weight: 500;
        margin: 1em 0;
      }
    }
  }

  .organization {
    .sort {
      position: relative;
      margin: 1em;
      .icon {
        float: left;
        font-size: 1.4em;
      }
      .item-wrapper {
        position: absolute;
        top: 0;
        left: 2em;
        .el-button {
          font-size: 0.8em;
          margin: 0.2em 0.5em 0.5em 0;
        }
      }
    }
  }

  .popover-sort-tree {
    .popover-title {
      margin: 0.5em 0;
      text-align: center;
      letter-spacing: 1.5em;
      font-size: 1.2em;
      font-weight: 600;
    }
    .el-checkbox {
      float: right;
    }
  }
</style>
