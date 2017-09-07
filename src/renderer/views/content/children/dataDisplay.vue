<template>
  <List :listData="listData"></List>
</template>
<script>
  import List from '@/components/list'
  import {mapGetters} from 'vuex'

  export default {
    name: 'DataDisplay',
    data () {
      return {
        listData: [],
        routeType: ''
      }
    },
    computed: mapGetters([
      'currentFileList',
      'trash',
      'searchResults'
    ]),
    mounted () {
      // search category trash
      this.routeType = this.$route.query.type
      // 根据路由查询参数，判断需要获取的数据
      this.fetchData(this.routeType)
    },
    methods: {
      fetchData (type) {
        if (type === 'category') {
          this.listData = this.currentFileList
          console.log(this.listData)
        }
        if (type === 'trash') {
          this.listData = this.trash
        }
        if (type === 'search') {
          this.listData = this.searchResults
        }
      }
    },
    watch: {
      '$route': 'fetchData',
      currentFileList () {
        this.fetchData(this.routeType)
      },
      trash () {
        this.fetchData(this.routeType)
      },
      searchResults () {
        this.fetchData(this.routeType)
      }
    },
    components: {
      List
    }
  }
</script>
<style>
</style>
