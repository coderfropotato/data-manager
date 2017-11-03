<!--加载List或uploadFile组件-->
<template>
  <div id="fileContent" v-loading="loading">
    <!-- <router-view></router-view> -->
    <div class="table-wrap">
      <!-- 列表模式 -->
      <el-table ref="table" @selection-change="handleSelectionChange" @row-dblclick="dbClick" @row-click="selectedRow" :height="tableheight" v-show="selectModule==='list'" :data="fileTableData" stripestyle="width: 100%">
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
      <div v-show="selectModule!=='list'" class="scale">
        <!-- 平铺模式 -->
        <ul>
          <li>123</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState,mapGetters } from "vuex";
import bus from "@/utils/bus";
export default {
  name: "fileContent",
  data() {
    return {
      loading: false,
      selectModule: "list",
      tableheight: 0,
      selectCount:0
    };
  },
  computed:{
    ...mapGetters(['fileTableData'])
  },
  mounted() {
    let _this = this;
    _this.tableheight = document.body.offsetHeight - 66 - 58 - 40 - 2;
    this.$electron.ipcRenderer.on("windowResize", function() {
      _this.tableheight = document.body.offsetHeight - 66 - 58 - 40 - 2;
    });
  },
  methods: {
    handleSelectionChange(val) {
      this.selectCount = val.length;
    },
    selectedRow(row, event, column){
      this.$refs.table.toggleRowSelection(row);
    },
    dbClick(row,event){
      this.$refs.table.clearSelection();
      this.$refs.table.toggleRowSelection(row,true);
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
<style lang="scss">
#fileContent {
  flex: 1;
  display: flex;
  flex-direction: column;
  .table-wrap {
    flex: 1;
    overflow-y: scroll;
    el-table {
      height: 100%;
    }
  }
}
</style>
