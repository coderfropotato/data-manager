<template>
  <div id="searchContent">
    <el-table :data="tableData" stripestyle="width: 100%">
      <el-table-column prop="date" label="选择"></el-table-column>
      <el-table-column prop="name" label="文件名"></el-table-column>
      <el-table-column prop="date" label="创建时间"></el-table-column>
      <el-table-column prop="size" label="文件大小"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import List from "@/components/list";
import { mapGetters } from "vuex";

export default {
  name: "DataDisplay",
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          size: "465M"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
          size: "465M"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
          size: "465M"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
          size: "465M"
        }
      ]
    };
  },
  methods: {},
  mounted() {
  },
  activated(){
    this.$store.dispatch("showBottom");
  },
  deactivated() {
    this.$store.dispatch("hideBottom");
  }
};
</script>
<style>

</style>
