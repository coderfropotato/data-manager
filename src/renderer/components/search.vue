<template>
  <div id="search-input">
      <el-input placeholder="请输入内容" v-model="input4">
          <el-button slot="append" icon="search"></el-button>
      </el-input>
  </div>
</template>

<script>
export default {
    data(){
        return{
            input4:""
        }
    }
};
</script>

<style>

</style>
