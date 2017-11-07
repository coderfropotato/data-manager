<template>
    <div class="table-wrap">
      <!-- 列表模式 -->
      <el-table ref="table" @row-dblclick="dbClick" @selection-change="handleSelectionChange"  @row-click="selectedRow" :height="tableHeight" :data="fileTableData" stripestyle="width: 100%">
        <el-table-column type="selection"></el-table-column>
        <el-table-column sortable prop="isdir" label="选择">
          <template scope="scope">
            <img v-if="!scope.row.isdir" src="../assets/images/single.png"/>
            <img v-else src="../assets/images/dir.png"/>
          </template>
        </el-table-column>
        <el-table-column sortable prop="filename" label="文件名"></el-table-column>
        <el-table-column sortable prop="ctime" label="创建时间"></el-table-column>
        <el-table-column sortable prop="size" label="文件大小">
          <template scope="scope">
            <span>{{scope.row.size | reverseSize}}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div v-show="selectModule!=='list'" class="scale">
        <ul>
          <li>123</li>
        </ul>
      </div> -->
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  props: ["tableHeight"],
  computed: {
    ...mapGetters(["fileTableData"])
  },
  methods: {
    //选中change
    handleSelectionChange(val) {
      this.$store.dispatch("setAttrHistory", val).then(res => {
        //文件详情 总是获取最后一个文件的详情
        this.$store.dispatch("getFileInfo");
      });
    },
    //选择当前行
    selectedRow(row, event, column) {
      this.$refs.table.toggleRowSelection(row);
    },
    //双击进入文件夹
    dbClick(row, event) {
      this.$refs.table.clearSelection();
      this.$refs.table.toggleRowSelection(row, true);
      //push 面包屑
      //是文件夹才可以双击进入
      if (row.isdir) {
        //根据childPath 获取数据
        let path = row.path;
        this.$store.dispatch("getDirTree", { path }).then(res => {
          this.$store.dispatch("updateNavBar", row);
        });
      }
    }
  },
  activated() {
    this.$store.dispatch("showBottom");
  },
  deactivated() {
    this.$store.dispatch("hideBottom");
  }
};
</script>

<style lang="scss" scoped>
.table-wrap {
  flex: 1;
  overflow-y: scroll;
  el-table {
    height: 100%;
  }
  -webkit-user-select: none;
  user-select: none;
}
</style>
