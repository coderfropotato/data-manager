<template>
<!--  v-loading.lock="loading" element-loading-text="正在初始化，请稍候..." -->
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script>
import bus from '@/utils/bus';
import $ from 'jquery';
export default {
  name: "data-manager-desktop",
  data(){
    return {
      loading:true
    }
  },
  mounted() {
    // 禁用浏览器默认拖拽事件，防止用户拖拽的文件被打开
    document.addEventListener(
      "drop",
      e => {
        e.preventDefault();
      },
      false
    );
    document.addEventListener(
      "dragenter",
      e => {
        e.preventDefault();
      },
      false
    );
    document.addEventListener(
      "dragleave",
      e => {
        e.preventDefault();
      },
      false
    );
    document.addEventListener(
      "dragover",
      e => {
        e.preventDefault();
      },
      false
    );
  },
  created(){
    this.$electron.ipcRenderer.on('updateFilesList',()=>{
      //被管理的设备添加成功后 重新获取设备列表
      this.$store.dispatch('getImportTargetDisks')
        // .then(_=>{
        //   this.$store.dispatch('getModifiedFiles')
        // })
    })
    //请求错误监听
    bus.$on('error',(res)=>{
      this.$message({
         type: 'error',
         message: res+':  数据读取失败，请重试。',
         duration: 1200
       })
    })
    // resetLayout
    this.$electron.ipcRenderer.on('resetLayout',(ev,num)=>{
      $('.content-wrapper').css('width',`${num}%`)
    })
  }
};
</script>
<style lang="scss">
  @import "./assets/SCSS/common";
</style>

