<template>
  <div class="smartSort-root">
    <el-row type="flex">
      <el-col :span="7">
        <el-row v-for="year in years">
          <span @click="getAuthors" style="display: inline-block;width: 9.5em">{{year}}</span>
          <i class="el-icon-caret-right" style="float: right"></i>
        </el-row>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="7" v-show="showAuthors">
        <el-row v-for="author in authors">
          <span @click="getArticles" style="display: inline-block;width: 9.5em">{{author}}</span>
          <i class="el-icon-caret-right" style="float: right"></i>
        </el-row>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="7" v-show="showArticles">
        <el-row v-for="article in articles">{{article}}</el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
//  import $ from 'jquery'
  export default {
    data () {
      return {
        years: [2011, 2012, 2013],
        authors: ['Guo', 'Zhou', 'xu'],
        articles: ['1.txt', '2.txt', '3.txt'],
        showAuthors: false,
        showArticles: false
      }
    },
    methods: {
      getAuthors (e) {
        console.log(e.target.innerText)
        this.showAuthors = true
      },
      getArticles (e) {
        console.log(e.target.innerText)
        this.showArticles = true
      }
    }
  }
</script>
<style>
  .smartSort-root {
  }
</style>
