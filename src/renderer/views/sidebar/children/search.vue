<template>
  <div id="search-root">
      <el-checkbox v-if="fileList.length>0" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
  <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="searchRange" @change="handlerCheckedChange">
        <el-checkbox v-for="(item,index) in fileList" :label="item" :key="index">{{item.alias}}</el-checkbox>
      </el-checkbox-group>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      checkAll: true,
      isIndeterminate: true
    };
  },
  computed:{
    ...mapGetters(['fileList',]),
    searchRange:{
      get(){
        return this.$store.state.search.searchRange;
      },
      set(val){
        this.$store.dispatch('setSearchRange',val);
      }
    }
  },
  methods: {
    handleCheckAllChange(event) {
      let flag = event.target.checked;
      this.searchRange = flag ? this.fileList : [];
      this.isIndeterminate = false;
      this.$store.dispatch('checkAllSwitch',flag);
    },
    handlerCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.fileList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.fileList.length;
      this.$store.dispatch('setSearchRange',value);
    }
  }
};
</script>
<style lang="scss" scoped>
#search-root {
  padding: 12px 20px;
  .el-checkbox-group {
    padding-left: 20px;
    .el-checkbox {
      display: block;
      width: 100%;
    }
  }

  .iconfile {
    margin-right: 10px;
  }
}
</style>
