<!--根组件-->
<template>
  <div id="app">
    <!--加载 index.vue 组件或首页-->
    <router-view></router-view>
  </div>
</template>
<script>
  import './api/database'
  import {ipcRenderer} from 'electron'
  // import bus from '@/utils/bus'

  export default {
    name: 'data-manager-desktop',
    mounted () {
      // 获取更改文件信息
      this.$store.dispatch('getModifiedFiles').then(isModified => {
        // 应用加载后，发送获取文件树的请求，提前对文件树进行处理，优化加载速度
//        if (isModified) {
//          this.$notify.info({
//            title: '通知',
//            message: '有文件状态发生改变'
//          })
//        }
        // 向后台请求创建智能视图的限制条件
        this.$store.dispatch('getSearchConditions').then(() => {
          this.$store.dispatch('openFile').then(() => {
            // 向后台请求创建智能视图的限制条件
            this.$store.dispatch('getSearchConditions').then(() => {
              // 获取导入 Excel 表格的可选择磁盘
              this.$store.dispatch('getImportTargetDisks')
            })
          })
        })
      })
      // 接受与后台交互的 API 的错误提示
//      bus.$on('error', () => {
//        bus.$emit('loading-end')
//        this.$notify({
//          type: 'error',
//          message: '数据读取错误，请重试或尝试重启软件',
//          duration: 0
//        })
//      })
      /*
       * 通过主进程在窗口之间传递数据
       * @state 说明 action/mutation 调用方式和接口
       * @data 窗口传递的数据
       */
      ipcRenderer.on('change-data', (event, call, data) => {
        // 调用action
        if (call.mode === 'action') {
          this.$store.dispatch(call.API, data)
        }
        // 调用mutation
        if (call.mode === 'mutation') {
          this.$store.dispatch(call, data)
        }
      })

      // 禁用浏览器默认拖拽事件，防止用户拖拽的文件被打开
      document.addEventListener('drop', e => {
        e.preventDefault()
      }, false)
      document.addEventListener('dragenter', e => {
        e.preventDefault()
      }, false)
      document.addEventListener('dragleave', e => {
        e.preventDefault()
      }, false)
      document.addEventListener('dragover', e => {
        e.preventDefault()
      }, false)
    }
  }
</script>

<style lang="scss">
  @import "./assets/SCSS/common";
</style>
