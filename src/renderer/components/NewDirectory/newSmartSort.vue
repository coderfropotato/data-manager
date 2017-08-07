<template>
  <div class="newSmartSort-root">
    <div class="top">
      <span>请输入智能视图名称</span>
      <el-input type="text" v-model="name" size="small"></el-input>
    </div>
    <div>
      <span>添加限制条件</span>
      <el-select v-model="value" placeholder="请选择" size="small" @change="show">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="search-input">
      <el-button v-for="(item,index) in selectedCondition" :key="item" size="mini">{{item}}<i
        class="el-icon-circle-close" @click="deleteItem(index)"></i></el-button>
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
    <el-button size="small" v-popover:popoverAdd>Add</el-button>
    <div>
      <el-button class="add" size="small" @click="addSmartSort">创建智能视图</el-button>
    </div>
  </div>
</template>
<script>
  import {ipcRenderer} from 'electron'

  export default {
    data () {
      return {
        selectedCondition: [],
        newDirList: [
          {
            title: '负责人'
          },
          {
            title: '年份'
          },
          {
            title: '项目'
          },
          {
            title: '文件类型'
          }],
        options: [{
          value: '负责人',
          label: '负责人'
        }, {
          value: '年份',
          label: '年份'
        }, {
          value: '项目',
          label: '项目'
        }, {
          value: '文件类型',
          label: '文件类型'
        }],
        value: '',
        i: 0,
        // amount是新建智能视图的数量
        amount: 1,
        name: ''
      }
    },
    mounted () {
    },
    methods: {
      showItem (index) {
        let text = index
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
      deleteItem (index) {
        this.selectedCondition.splice(index, 1)
      },
      addSmartSort () {
        let temp = {
          name: this.name,
          limitedCondition: this.value,
          selectedCondition: this.selectedCondition
        }
        let call = {
          mode: 'action',
          API: 'setNewSmartSort'
        }
        ipcRenderer.send('change-data', call, temp)
//        this.$store.dispatch('setNewSmartSort', {
//          name: '智能视图' + this.amount,
//          limitedCondition: this.value,
//          selectedCondition: this.selectedCondition
//        })
//        this.$store.dispatch('setNewSmartSort')
        this.$alert('创建成功', {
          confirmButtonText: '确定'
        })
        this.amount++
      },
      show () {
        this.newDirList = [
          {
            title: '负责人'
          },
          {
            title: '年份'
          },
          {
            title: '项目'
          },
          {
            title: '文件类型'
          }]
        for (this.i = 0; this.i < this.newDirList.length; this.i++) {
          if (this.value === this.newDirList[this.i].title) {
            console.log(this.newDirList[this.i])
            this.newDirList.splice(this.i, 1)
          }
        }
      }
    }
  }
</script>
<style lang="scss">
  .newSmartSort-root {
    .top {
      .el-input {
        width: 20em;
      }
    }
    >div {
      margin: 1em;
    }
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
    .add {
      margin-left: 22.5em;
      margin-top: 1em;
    }
  }
</style>
