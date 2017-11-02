<template>
  <div id="searchContent">
    <div class="table-wrap">
      <!-- 列表模式 -->
      <el-table ref="table" @selection-change="handleSelectionChange" @row-dblclick="dbClick" @row-click="selectedRow" :height="tableheight" v-show="selectModule==='list'" :data="tableData" stripestyle="width: 100%">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="date" label="选择">
          <template scope="scope">
            <el-icon name="document"></el-icon>
          </template>
        </el-table-column>
        <el-table-column sortable prop="name" label="文件名"></el-table-column>
        <el-table-column sortable prop="date" label="创建时间"></el-table-column>
        <el-table-column sortable prop="size" label="文件大小"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import bus from "@/utils/bus";
export default {
  name: "fileContent",
  data() {
    return {
      loading: false,
      selectModule: "list",
      tableheight: 0,
      selectCount: 0,
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
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
          size: "465M"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
          size: "465M"
        }
      ]
    };
  },
  mounted() {
    let _this = this;
    _this.tableheight = document.body.offsetHeight - 66 - 78 - 40 - 4;
    this.$electron.ipcRenderer.on("windowResize", function() {
      _this.tableheight = document.body.offsetHeight - 66 - 78 - 40 - 4;
    });
  },
  methods: {
    handleSelectionChange(val) {
      this.selectCount = val.length;
    },
    selectedRow(row, event, column) {
      this.$refs.table.toggleRowSelection(row);
    },
    dbClick(row, event) {
      this.$refs.table.clearSelection();
      this.$refs.table.toggleRowSelection(row, true);
    }
  },
  activated() {
    this.$store.dispatch("showBottom");
  },
  deactivated() {
    this.$store.dispatch("hideBottom");
  },
  beforeMount() {
    bus.$on("loading-content", () => {
      this.loading = true;
    });
    bus.$on("loading-end", () => {
      this.$nextTick(() => {
        this.loading = false;
      });
    });
  }
};
</script>
<style>

</style>
