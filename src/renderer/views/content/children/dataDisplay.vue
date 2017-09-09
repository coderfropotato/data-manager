<template>
  <List :listData="listData" :operation="operation"></List>
</template>
<script>
  import List from '@/components/list'
  import {mapGetters} from 'vuex'

  export default {
    name: 'DataDisplay',
    data () {
      return {
        listData: [],
        routeType: '',
        operation: {
          text: '编辑',
          event: () => {}
        }
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
        // 更新类型
        this.routeType = this.$route.query.type
        // 获取并展示分类文件
        if (type === 'category') {
          console.log('category')
          this.listData = this.currentFileList
          this.operation = {
            text: '编辑',
            event: () => {
              console.log('分类')
            }
          }
        }
        if (type === 'trash') {
          console.log('trash')
          // 获取并展示回收站数据
          this.listData = this.trash
          this.operation = {
            text: '放回原处',
            event: () => {
              console.log('回收站')
            }
          }
        }
        // 获取并展示搜索结果
        if (type === 'search') {
          console.log('search')
          this.listData = this.searchResults
          this.operation = {
            text: '查看',
            event: () => {
              console.log('搜索')
            }
          }
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
