<template>
  <div class="smartSort-root">
    <!--<el-button v-for="item in sortOrder" :key="item" type='text' class="sort">{{item}}</el-button>-->
    <el-row type="flex" style="margin-top: 2em">
      <el-col :span="7" v-for="(item,index) in smartSort" :key="index" v-if="item.length !== 0 " class="items">
        <el-row v-for="list in item" :key="list" v-if="typeof list === 'string'">
          <div type="text" @click="addSelect(index, list)">{{list}}<i class="el-icon-caret-right"></i></div>
        </el-row>
        <el-row v-for="list in item" :key="list.basic.filename" v-else="list.basic.filename">
            <div @click="addSelect(index, list)">{{list.basic.filename}}</div>
        </el-row>
      </el-col>
      <!--<el-col :span="7">-->
        <!--<el-row v-for="year in years" :key="year">-->
          <!--<span @click="getAuthors" style="display: inline-block;width: 9.5em">{{year}}</span>-->
          <!--<i class="el-icon-caret-right" style="float: right"></i>-->
        <!--</el-row>-->
      <!--</el-col>-->
      <!--<el-col :span="1"></el-col>-->
      <!--<el-col :span="7" v-show="showArticles">-->
        <!--<el-row v-for="article in articles" :key="article">{{article}}</el-row>-->
      <!--</el-col>-->
    </el-row>
  </div>
</template>
<script>
//  import $ from 'jquery'
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        select: {},
        // 记录的上一次点击的某一列的index
        index: 0
      }
    },
    computed: mapGetters([
      'smartSort',
      'sortOrder',
      'tableName'
    ]),
    methods: {
      addSelect (index, list) {
//        console.log(index)
//        console.log(list)
        // index 是某一列的在smartSort的索引
        // list是某一列具体一个item的值
        // name 是某一列对应的分类的英文 如 2017 对应的是'year'
        let name = this.sortOrder[index - 1]
        console.log(this.sortOrder[index - 1])
        // 判断某一项是否重复点击，如果不重复，则请求下一列的数据。
        this.select[name] = list
        console.log(this.select[name])
        this.$store.dispatch('showSmartSort', {
          'tableName': this.tableName,
          'select': this.select
        })
//        if (this.select[name] !== list) {
//          this.select[name] = list
//          console.log(this.select)
//          if (this.index === index || this.index > index) {
//            this.$store.commit('deleteList', {
//              'from': index + 1,
//              'deleteLength': this.smartSort.length - index
//            })
//            console.log(this.smartSort.length)
//          }
//          this.$store.dispatch('showSmartSort', {
//            'tableName': this.tableName,
//            'select': this.select
//          })
//          this.index = index
//        }
      }
    }
  }
</script>
<style lang="scss">
  .smartSort-root {
    .sort {
      margin: 0 3em;
      width: 3em;
    }
    .items {
    }
    .el-col:nth-child(n+2) {
      margin-left: 1em;
    }
    text-align: center;
    .el-icon-caret-right {
      float: right;
    }
  }
</style>
