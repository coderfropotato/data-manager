<template>
<!-- @row-click="selectedRow" @row-contextmenu="selectedRow" -->
    <div class="table-wrap">
      <el-table  ref="table"   @row-dblclick="dbClick" @selection-change="handleSelectionChange" 
      @cell-click="cellClick"
      :height="tableHeight" :data="loadData" stripestyle="width: 100%">
        <el-table-column width="40"  type="selection"></el-table-column>
        <el-table-column class-name="choose" width="46" prop="isdir" label="选择">
          <template scope="scope">
            <img v-if="!scope.row.isdir" src="../assets/images/single.png"/>
            <img v-else src="../assets/images/dir.png"/>
          </template>
        </el-table-column>
        <el-table-column  sortable prop="filename" label="文件名"></el-table-column>
        <el-table-column  sortable prop="ctime" label="创建时间">
          <template scope="scope">
            <span>{{scope.row.ctime | reverseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column  sortable prop="size" label="文件大小">
          <template scope="scope">
            <span v-if="!scope.row.isdir">{{scope.row.size | reverseSize}}</span>
            <span v-else></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      loadData: [],
      loadNumber: 30,
      loadCount: 0,
      isLoading: false,
      over: false,
      timerList: []
    };
  },
  created() {
    //首次加载
    this.firstLoad();
  },
  updated() {
    let _this = this;
    try {
      document.querySelector(".el-table__body-wrapper").addEventListener(
        "scroll",
        _ => {
          let boxH = document.querySelector(".el-table__body-wrapper")
            .offsetHeight;
          let scrollH = document.querySelector(".el-table__body-wrapper")
            .scrollTop;
          let total = document.querySelector(".el-table__body").offsetHeight;
          if (scrollH + boxH + 50 >= total && !_this.isLoading && !_this.over) {
            _this.isLoading = true;
            _this.loadCount++;
            _this.loadData = _this.loadData.concat(
              _this.data.slice(
                _this.loadNumber * _this.loadCount,
                (_this.loadCount + 1) * _this.loadNumber
              )
            );
            _this.$nextTick(_ => {
              _this.isLoading = false;
              if (_this.loadData.length === _this.data.length)
                _this.over = true;
            });
          }
        },
        false
      );
    } catch (e) {}
  },
  watch: {
    tableData: {
      handler: function(val, oldVal) {
        this.init();
        this.data = this.tableData;
        this.firstLoad();
      },
      deep: true
    }
  },
  props: ["tableHeight", "tableData"],
  methods: {
    init() {
      this.loadCount = 0;
      this.isLoading = false;
      this.over = false;
    },

    firstLoad() {
      this.data = this.tableData;
      this.loadData = this.data.slice(0, this.loadNumber);
      if (this.loadData.length === this.data.length) this.over = true;
      try {
        document.querySelector(".el-table__body-wrapper").scrollTop = 0;
      } catch (e) {}
    },

    // handlerSelectionChange to parent
    handleSelectionChange(val) {
      //fileInfo params from the row if rootPath param in row
      for (var i = 0; i < this.timerList.length; i++) {
        clearTimeout(this.timerList[i]);
      }
      let timer = null;
      timer = setTimeout(_ => {
        if (val.length) {
          if (!val[0].rootPath) {
            this.$emit("selectchange", val);
          } else {
            this.$emit("searchlistclicked", val);
          }
        } else {
          this.$emit("nochecked");
        }
      }, 260);
      this.timerList.push(timer);
    },

    cellClick(row, column, cell, event) {
      if (column.label) {
        this.$refs.table.clearSelection();
        this.$refs.table.toggleRowSelection(row);
      }
    },

    //dbclick into dir
    dbClick(row, event) {
      //isn't dir
      if (row.isdir) {
        //getting the data based on childPath
        let path = row.path;
        //clicked into dir . it's not necessary.
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
  .el-table {
    height: 100%;
  }
  -webkit-user-select: none;
  user-select: none;
}
</style>
