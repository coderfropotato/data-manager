<template>
    <div class="table-wrap">
      <el-table ref="table" @row-dblclick="dbClick" @selection-change="handleSelectionChange"  @row-click="selectedRow" :height="tableHeight" :data="tableData" stripestyle="width: 100%">
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
    </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["tableHeight", "tableData"],
  methods: {
    // handlerSelectionChange to parent
    handleSelectionChange(val) {
      //fileInfo params from the row if rootPath param in row
      if(!val.length) return;
      if(!val[0].rootPath){
        //file list clicked
        this.$emit("selectchange", val);
      }else{
        //search list clicked
        let serialNumber = val.serialNumber;
        let rootPath = val.rootPath;
        let filepath = val.path;
        let params ={"collection":val,"par":{serialNumber,rootPath,filepath}}
        this.$emit("searchlistclicked",params);
      }
    },
    //select current row
    selectedRow(row, event, column) {
      this.$refs.table.toggleRowSelection(row);
    },
    //dbclick into dir
    dbClick(row, event) {
      this.$refs.table.clearSelection();
      this.$refs.table.toggleRowSelection(row, true);
      //isn't dir
      if (row.isdir) {
        //getting the data based on childPath
        let path = row.path;
        //clicked into dir . it's not nesscnecessary.
        //parent component listens('intodir') for events as needed
        this.$emit("intodir", { path, row });
      }
    }
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
