<template>
  <div class="smartSort-root">
    <el-button v-for="item in sortOrder" :key="item" type='text' class="sort">{{item}}</el-button>
    <el-row type="flex">
      <el-col :span="8" v-for="(item,index) in smartSort" :key="index">
        <el-row v-for="list in item" :key="list">
          <el-button type="text" @click="addSelect(index, list)">{{list}}</el-button>
        </el-row>
      </el-col>
      <!--<el-col :span="1"></el-col>-->
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
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
//        years: [2011, 2012, 2013],
//        articles: ['1.txt', '2.txt', '3.txt'],
//        showAuthors: false,
//        showArticles: false
      }
    },
    computed: mapState({
      // 所有文件选项的数据，即管理的磁盘
      smartSort: state => state.newDirectory.smartSort,
      sortOrder: state => state.newDirectory.sortOrder,
      tableName: state => state.newDirectory.tableName
    }),
    methods: {
      addSelect (index, list) {
        console.log(index)
        console.log(list)
        let name = this.sortOrder[index - 1]
        console.log(this.sortOrder[index - 1])
        let select = {}
        select[name] = list
        console.log(select)
        this.$store.dispatch('showSmartSort', {
          'tableName': this.tableName,
          'select': select
        })
      }
    }
  }
</script>
<style lang="scss">
  .smartSort-root {
    .sort {
      margin: 0 5.3em;
    }
  }
</style>
