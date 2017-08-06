<template>
  <div id="file-status-info-root" v-if="show">
    <!--标题-->
    <div class="info-title">
      <span>文件详情</span>
    </div>
    <!--基本信息-->
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
                      :data="popoverTreeData"
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
    <!--各种可以更改的属性-->
    <div id="file-status-aside-modified-attributes">
      <el-select
              v-model="attribute1"
              filterable
              allow-create
              placeholder="你TM选啊还是写啊">
        <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
        </el-option>
      </el-select>

      <el-select
              v-model="attribute2"
              filterable
              allow-create
              placeholder="你TM选啊还是写啊">
        <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
        </el-option>
      </el-select>
    </div>
    <!--底部各种按钮-->
    <div id="file-status-aside-buttons">
      <div>hhh</div>
      <div>hhh</div>
      <div>hhh</div>
      <div>hhh</div>
      <el-button type="primary" size="small" @click="addNewTaggedFile">更改属性</el-button>
      <el-button size="small">自动识别</el-button>
      <el-button size="small">忽略此文件</el-button>
      <el-button size="small">放弃修改</el-button>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'

  let tempData = ['1/1.txt/', '1/2.2/3.2/', '1/2.4/3/', '1/2.txt/']
  let tempSort = []

  export default {
    name: 'FileInfo',
    data () {
      return {
        // 记录分类的数组
        sorts: [],
        tempData,
        attribute1: '',
        attribute2: '',
        options1: [
          {
            value: '1',
            label: '1'
          },
          {
            value: '2',
            label: '2'
          }
        ]
      }
    },

    computed: mapState({
      show: state => state.modified.showFileInfo,
      basicInfo: state => state.fileInfo.basicInfo,
      otherInfo: state => state.fileInfo.otherInfo,
      popoverTreeData: state => state.files.sortFileTree,
      taggedModifiedFiles: state => state.modified.taggedModifiedFiles
      // sorts: state => state.fileInfo.fileSorts
    }),

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

    methods: {
      ...mapActions([
        'addTaggedModifiedFile' // 增加该打好标签的文件
      ]),

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
      },

      // 添加打好标签的选中文件/文件夹
      addNewTaggedFile () {
        let newAttributes = {attribute1: this.attribute1, attribute2: this.attribute2}
        let payload = {path: '/', newAttributes: newAttributes}
        this.addTaggedModifiedFile(payload)
        console.log(this.taggedModifiedFiles.get('/'))
      }
    }
  }
</script>

<style lang="scss" scoped>
  #file-status-info-root {
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
