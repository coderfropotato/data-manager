<template>
  <div class="smartSort-root">
    <el-row type="flex">
      <el-col :span="7" v-for="(item,index) in smartSort" :key="index">
        <el-row v-for="list in item" :key="list">{{list}}
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
      smartSort: state => state.newDirectory.smartSort
    }),
    methods: {
//      getAuthors (e) {
//        let year = e.target.innerText
//        console.log(e.target.innerText)
//        this.$store.dispatch('getAuthors', year)
//        this.showAuthors = true
//      },
//      getArticles (e) {
//        console.log(e.target.innerText)
//        this.showArticles = true
//      }
    }
  }
</script>
<style>
  .smartSort-root {
  }
</style>
