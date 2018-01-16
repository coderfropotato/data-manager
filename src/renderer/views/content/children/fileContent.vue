<template>
  <div id="fileContent" v-loading.lock="fileTableLoading" element-loading-text="数据加载中，请稍后...">
    <my-table @nochecked="noChecked" :clickHistory="tableClickHistory" @selectchange="childSelectedChange" @intodir="intoDir"  :tableHeight="tableheight" :tableData="fileTableData"></my-table>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import bus from "@/utils/bus";
export default {
  name: "fileContent",
  data() {
    return {
      tableheight: 0,
      fileTableLoading: false
    };
  },
  computed: {
    ...mapGetters(["fileTableData","tableClickHistory"])
  },
  created() {
    bus.$on("fileTableLoading", status => {
      this.fileTableLoading = status;
    });
  },
  mounted() {
    let _this = this;
    _this.tableheight = document.body.offsetHeight - 66 - 60 - 44;
    this.$electron.ipcRenderer.on("windowResize", function() {
      _this.tableheight = document.body.offsetHeight - 66 - 60 - 44;
    });
  },
  methods: {
    //table's component selectChange event
    childSelectedChange(val) {
      this.$nextTick(_ => {
        this.$store.dispatch("setBottomInfo", val).then(res => {
          //always get the last detail
          this.$store.dispatch("getFileInfo");
        });
      });
    },
    noChecked() {
      this.$store.dispatch("setBottomInfo", []).then(res => {
        this.$store.dispatch("getFileInfo");
      });
    },
    //table's component dbclick into dir event
    intoDir({ path, row }) {
      //get table data
      this.$store.dispatch("getDirTree", { path }).then(res => {
        this.$store.dispatch("setSelected", { count: 0, size: 0 });
        this.$store.dispatch("updateNavBar", row);
      });
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
<style lang="scss">
#fileContent {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
