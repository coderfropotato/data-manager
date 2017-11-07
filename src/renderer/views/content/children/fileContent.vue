<!--加载List或uploadFile组件-->
<template>
  <div id="fileContent" v-loading="loading">
    <my-table :table-height="tableheight"></my-table>
    <!-- <router-view></router-view> -->
    <!-- <div class="table-wrap">
      <el-table ref="table" @row-dblclick="dbClick" @selection-change="handleSelectionChange"  @row-click="selectedRow" :height="tableheight" :data="fileTableData" stripestyle="width: 100%">
        <el-table-column type="selection"></el-table-column>
        <el-table-column sortable prop="isdir" label="选择">
          <template scope="scope">
            <img v-if="!scope.row.isdir" src="../../../assets/images/single.png"/>
            <img v-else src="../../../assets/images/dir.png"/>
          </template>
        </el-table-column>
        <el-table-column sortable prop="filename" label="文件名"></el-table-column>
        <el-table-column sortable prop="ctime" label="创建时间"></el-table-column>
        <el-table-column sortable prop="size" label="文件大小">
          <template scope="scope">
            <span v-if="scope.row.size<1024">{{scope.row.size+'KB'}}</span>
            <span v-if="scope.row.size<1024*1024 && scope.row.size>=1024">{{Math.round(scope.row.size/1024*100)/100+'M'}}</span>
            <span v-if="scope.row.size>=1024*1024">{{Math.round(scope.row.size/1024/1024*100)/100+'G'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div> -->
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import bus from "@/utils/bus";
export default {
  name: "fileContent",
  data() {
    return {
      loading: false,
      tableheight: 0
    };
  },
  mounted() {
    let _this = this;
    _this.tableheight = document.body.offsetHeight - 66 - 58 - 40 - 2;
    this.$electron.ipcRenderer.on("windowResize", function() {
      _this.tableheight = document.body.offsetHeight - 66 - 58 - 40 - 2;
    });
  }
};
</script>
<style lang="scss">
#fileContent {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
