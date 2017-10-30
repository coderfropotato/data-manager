<template>
  <div id="searchHeader-root">
     <el-input placeholder="请输入内容" v-model="input4">
          <el-button  slot="append" icon="search">搜索</el-button>
      </el-input>
  </div>
</template>
<script>
  import scrollBar from '@/utils/searchScrollbar'

  export default {
    name: 'SearchHeader',
    data () {
      return {
       input4:""
      }
    },
    computed: {
      
    },
   
    mounted () {
      // scrollBar()
      // 重置列表数据，防止和文件组件数据混合
    },
    methods: {
     
    }
  }
</script>

<style lang="scss">
  #searchHeader-root {
    padding: 24px 12px;
  }
</style>
