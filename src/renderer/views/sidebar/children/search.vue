<template>
  <div id="search-root">
      <el-checkbox v-if="fileList.length>0"  v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="searchRange" @change="handlerCheckedChange">
        <el-checkbox v-for="(item,index) in fileList" :label="item.alias" :key="index">{{item.alias}}</el-checkbox>
      </el-checkbox-group>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import bus from "@/utils/bus";
export default {
  data() {
    return {
      // checkAll: true,
      // isIndeterminate: false
    };
  },
  computed: {
    ...mapGetters(["fileList", "searchPos"]),
    checkAll:{
      get(){
        return this.searchRange.length===this.fileList.length;
      },
      set(val){

      }
    },
    searchRange: {
      get() {
        return this.$store.state.search.searchRange;
      },
      set(val) {
        this.$store.dispatch("setSearchRangeList", val);
      }
    },
    // isIndeterminate: {
    //   get() {
    //     return this.searchRange.length !== this.fileList.length;
    //   },
    //   set(val) {}
    // }
  },
  methods: {
    handleCheckAllChange(event) {
      let flag = event.target.checked;
      this.searchRange = flag ? this.fileList : [];
      // this.isIndeterminate = false;
      this.$store.dispatch("checkAllSwitch", flag);
      // reset searchpos
      this.$store.dispatch("setSearchPos", "");
      // computed input padding
      // this.$nextTick(_ => {
      //   bus.$emit("computedInput");
      // });
    },
    handlerCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.fileList.length;
      // this.isIndeterminate =checkedCount > 0 && checkedCount < this.fileList.length;
      this.$store.dispatch("setSearchRangeList", value);
      // reset searchpos
      this.$store.dispatch("setSearchPos", "");
      // computed input padding
      // this.$nextTick(_ => {
      //   bus.$emit("computedInput");
      // });
    }
  }
};
</script>
<style lang="scss" scoped>
#search-root {
  .el-checkbox-group {
    padding: 10px 0;
    transition: 0.3s all ease;
    .el-checkbox {
      padding: 9.5px 30px 9.5px 50px;
      display: block;
      width: 100%;
      padding-left: 40px;
      &:hover {
        background-color: #d1dbe5;
      }
    }
  }
  .el-checkbox {
    padding: 0 30px;
  }

  .iconfile {
    margin-right: 10px;
  }
}
</style>
