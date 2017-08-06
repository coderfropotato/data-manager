<template>
  <div class="newSmartSort-root">
    <div class="search-input">
      <el-button v-for="item in selectedCondition" :key="item" size="mini">{{item}}<i class="el-icon-circle-close"
                                                                                      @click="deleteItem"></i>
      </el-button>
      <el-popover
          ref="popoverAdd"
          placement="right"
          width="200"
          trigger="click">
        <el-menu @select="showItem">
          <el-menu-item
              v-for="(item, index) in newDirList"
              :key="item.title" :index="item.title">
            {{item.title}}
          </el-menu-item>
        </el-menu>
      </el-popover>
    </div>
    <el-button class="add" size="small" v-popover:popoverAdd>Add</el-button>
    <el-button class="add" size="small" @click="addSmartSort">创建</el-button>
  </div>
</template>
<script>
  import $ from 'jquery'
  import {ipcRenderer} from 'electron'

  export default {
    data () {
      return {
        selectedCondition: [],
        newDirList: {
          1: {
            title: '负责人'
          },
          2: {
            title: '年份'
          },
          3: {
            title: '项目'
          },
          4: {
            title: '文件类型'
          }
        }
      }
    },
    mounted () {
    },
    methods: {
      showItem (index) {
        let text = index
        console.log(text)
        let count = 0
        let length = this.selectedCondition.length
        // 如果用户还未选择条件，则直接添加
        if (length === 0) {
          this.selectedCondition.push(text)
        } else { // 如果已经有选择的条件，判断用户点击的条件是否重复
          for (this.i = 0; this.i < length; this.i++) {
            if (this.selectedCondition[this.i].indexOf(text) !== -1) {
              count++
            }
          } // 如果没有重复，则向selectedCondition添加元素
          if (count === 0) {
            this.selectedCondition.push(text)
          }
        }
      },
      deleteItem (e) {
        let text = $(e.target).parent().parent().text()
        for (this.i = 0; this.i < this.selectedCondition.length; this.i++) {
          if (text === this.selectedCondition[this.i]) {
            var index = this.i
          }
        }
        this.selectedCondition.splice(index, 1)
      },
      addSmartSort () {
        console.log(this.selectedCondition)
        let temp = {
          id: '',
          label: '智能视图'
        }
        let call = {
          mode: 'action',
          API: 'addSmartSort'
        }
        ipcRenderer.send('change-data', call, temp)
        console.log(this.$store.state)
      }
    }
  }
</script>
<style lang="scss">
  .newSmartSort-root {
    .search-input {
      float: left;
      width: 20em;
      margin: 1.2em 0 0 1em;
      height: 1.7em;
      border: 1px solid #bfcbd9;
      background-color: #fff;
    }
    > .el-button {
      margin-top: 1.5em;
    }
  }
</style>
