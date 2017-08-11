<template>
  <div class="newSmartSort-root">
    <div class="top">
      <span>请输入智能视图名称</span>
      <el-input type="text" v-model="name" size="small"></el-input>
    </div>
    <div>
      <span>添加搜索条件</span>
      <div class="searchConditon">
        <el-button v-for="(item,index) in limitedConditions" :key="item" size="mini" :index="index">{{item}}<i
          class="el-icon-circle-close" @click="deleteLimitedCondition(index)"></i></el-button>
        </el-button>
      </div>
      <el-button class="button" size="small" @click="showSearchConditons">{{content.searchConditions}}</el-button>
      <div class="conditions-wrapper" v-if="show.searchConditions">
        <div class="conditions" v-for="(item,index) in searchConditions" :key="name" v-bind:data-name=item.name>{{item.label}}
          <el-button type="text" v-for="it in item.value" :key="it" @click="addLimitedCondition" size="small">{{it}}</el-button>
        </div>
      </div>
    </div>
    <div class="sortCondition">
      <div><span>添加排序条件</span></div>
      <div class="search-input">
        <el-button v-for="(item,index) in selectedCondition" :key="item" size="mini">{{item}}<i
          class="el-icon-circle-close" @click="deleteItem(index)"></i></el-button>
        </el-button>
        <!--<el-popover-->
        <!--ref="popoverAdd"-->
        <!--placement="right"-->
        <!--width="200"-->
        <!--trigger="click">-->
        <!--<el-menu @select="showItem">-->
        <!--<el-menu-item-->
        <!--v-for="(item, index) in newDirList"-->
        <!--:key="item.title" :index="item.title">-->
        <!--{{item.title}}-->
        <!--</el-menu-item>-->
        <!--</el-menu>-->
        <!--</el-popover>-->
      </div>
      <el-button size="small" @click="showSortConditons" style="margin-top: 1.2em">{{content.sortConditions}}</el-button>
      <div class="conditions-wrapper" v-if="show.sortConditions">
        <div class="conditions" v-for="(item,index) in searchConditions" :key="name" v-bind:data-name=item.name style="clear: both">{{item.label}}
          <el-button type="text" v-for="it in item.value" :key="it" @click="showItem" size="small">{{it}}</el-button>
        </div>
      </div>
    </div>
    <!--<el-button size="small" v-popover:popoverAdd>Add</el-button>-->
    <div>
      <el-button class="add" size="small" @click="addSmartSort">创建智能视图</el-button>
    </div>
  </div>
</template>
<script>
  import {ipcRenderer} from 'electron'
  import {mapState} from 'vuex'
  import $ from 'jquery'
  export default {
    data () {
      return {
        selectedCondition: [],
        limitedConditions: [],
        content: {
          searchConditions: '展开',
          sortConditions: '展开'
        },
        show: {
          searchConditions: false,
          sortConditions: false
        },
        i: 0,
        // amount是新建智能视图的数量
        amount: 1,
        // 限制条件所对应的分类的英文 如type
        name: '',
        // 存储限制条件的对象
        limitedObject: []
      }
    },
    computed: mapState({
      searchConditions: state => state.newDirectory.searchConditions
    }),
    mounted () {
    },
    methods: {
      showSearchConditons () {
        if (this.content.searchConditions === '展开') {
          this.content.searchConditions = '收起'
        } else {
          this.content.searchConditions = '展开'
        }
        this.show.searchConditions = !this.show.searchConditions
      },
      showSortConditons () {
        if (this.content.sortConditions === '展开') {
          this.content.sortConditions = '收起'
        } else {
          this.content.sortConditions = '展开'
        }
        this.show.sortConditions = !this.show.sortConditions
      },
      addLimitedCondition (e) {
        console.log(e.target.innerText)
        let text = e.target.innerText
        let count = 0
        let length = this.limitedConditions.length
        let name
        // 把用户点击的每一个搜索条件以key: value 对象的形式包装起来 key是
        let object = {}
        if ($(e.target).parent().data('name')) {
          name = $(e.target).parent().data('name')
        } else if ($(e.target).parent().parent().data('name')) {
          name = $(e.target).parent().parent().data('name')
        }
        object[name] = text
        // 如果用户还未选择条件，则直接添加
        if (length === 0) {
          this.limitedConditions.push(text)
          this.limitedObject.push(object)
        } else { // 如果已经有选择的条件，判断用户点击的条件是否重复
          for (this.i = 0; this.i < length; this.i++) {
            if (this.limitedConditions[this.i].indexOf(text) !== -1) {
              count++
            }
          } // 如果没有重复，则向selectedCondition添加元素
          if (count === 0) {
            this.limitedConditions.push(text)
            this.limitedObject.push(object)
          }
        }
        console.log(this.limitedObject)
      },
      deleteLimitedCondition (index) {
        this.limitedConditions.splice(index, 1)
      },
      showItem (e) {
        console.log(e.target.innerText)
        let text = e.target.innerText
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
        console.log(this.selectedCondition)
      },
      deleteItem (index) {
        this.selectedCondition.splice(index, 1)
      },
      addSmartSort () {
        let temp = {
          name: this.name,
          context: [],
          limitedCondition: this.limitedObject,
          selectedCondition: this.selectedCondition
        }
        let call = {
          mode: 'action',
          API: 'addNewSmartSort'
        }
        ipcRenderer.send('change-data', call, temp)
        this.amount++
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
      margin: 1.5em 0 0 1em;
    }
    .searchConditon,
    .search-input {
      width: 25em;
      margin: 1em 0;
      height: 1.7em;
      border: 1px solid #bfcbd9;
      background-color: #fff;
    }
    .search-input {
      float: left;
    }
    > .el-button {
      margin-top: 1.5em;
    }
    .conditions-wrapper{
      height: 300px;
      overflow-y: scroll;
      clear: both;
    }
    .conditions {
      font-size: 0.8em;
      .el-button {
        margin-left: 2em;
      }
    }
    .button {
      position: relative;
      top: -3.7em;
      left:33.3em;
    }
    .add {
      margin-left: 30em;
      margin-top: 1em;
    }
  }
</style>
