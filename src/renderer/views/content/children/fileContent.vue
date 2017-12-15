<template>
  <div id="fileContent" v-loading="loading">
    <my-table @nochecked="noChecked" @selectchange="childSelectedChange" @intodir="intoDir"  :tableHeight="tableheight" :tableData="fileTableData"></my-table>
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
  computed: {
    ...mapGetters(["fileTableData"])
  },
  mounted() {
    let _this = this;
    _this.tableheight = document.body.offsetHeight - 66 - 60 - 40 - 2;
    this.$electron.ipcRenderer.on("windowResize", function() {
      _this.tableheight = document.body.offsetHeight - 66 - 60 - 40 - 2;
    });
  },
  methods: {
    //table's component selectChange event
    childSelectedChange(val) {
      this.$store.dispatch("setBottomInfo", val).then(res => {
        //always get the last detail
        this.$store.dispatch("getFileInfo");
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
