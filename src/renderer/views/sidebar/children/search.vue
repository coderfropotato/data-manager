<template>
  <div id="search-root">
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">搜索范围</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="city in cities" :label="city" :key="city"><i class="iconfile iconfont icon-wodeyingpan"></i>{{city}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checkAll: true,
      checkedCities: ["C", "D"],
      cities: ["C", "D", "E", "F"],
      isIndeterminate: true
    };
  },
  methods: {
    handleCheckAllChange(event) {
      this.checkedCities = event.target.checked ? this.cities : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    }
  }
};
</script>
<style lang="scss" scoped>
#search-root {
  padding: 12px 20px;
  .el-checkbox-group{
    padding-left: 20px;
    .el-checkbox{
      display: block;
      width: 100%;
    }
  }
  
  .iconfile{
    margin-right:10px;
  }
}
</style>
