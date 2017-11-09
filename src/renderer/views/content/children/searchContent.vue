<template>
  <div id="searchContent">
    <my-table @selectchange="childSelectedChange" :tableHeight="tableheight" :tableData="searchTableData"></my-table>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import bus from "@/utils/bus";
export default {
  name: "fileContent",
  data() {
    return {
      tableheight: 0,
    };
  },
  mounted() {
    let _this = this;
    _this.tableheight = document.body.offsetHeight - 66 - 82 - 40 - 1;
    this.$electron.ipcRenderer.on("windowResize", function() {
      _this.tableheight = document.body.offsetHeight - 66 - 82 - 40 - 1;
    });
  },
  computed:{
    ...mapGetters(['searchTableData']),
  },
  methods: {
     //table's component selectChange event
    childSelectedChange(selectedCollection) {
      this.$store.dispatch("setBottomInfo", selectedCollection).then(_=>{
        this.$store.dispatch("getFileInfo");
      })
    },
  },
  activated() {
    this.$store.dispatch("showBottom");
  },
  deactivated() {
    this.$store.dispatch("hideBottom");
  }
};
</script>
<style>

</style>
