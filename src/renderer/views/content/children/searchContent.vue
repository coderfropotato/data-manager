<template>
  <div id="searchContent" v-loading.lock="fullscreenLoading" element-loading-text="数据加载中，请稍后...">
    <my-table v-if="show" @nochecked="noCheck" @searchlistclicked="childSelectedChange" :tableHeight="tableheight" :tableData="searchTableData"></my-table>
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
      show:true,
      fullscreenLoading:true
    };
  },
  mounted() {
    let _this = this;
    _this.tableheight = document.body.offsetHeight - 66 - 60 - 44;
    this.$electron.ipcRenderer.on("windowResize", function() {
      _this.tableheight = document.body.offsetHeight - 66 - 60 - 44;
    });
  },
  created(){
    bus.$on('searchTableLoading',status=>{
      this.fullscreenLoading = status;
    })
  },
  computed: {
    ...mapGetters(["searchTableData"])
  },
  methods: {
    //table's component selectChange event
    childSelectedChange(val) {
      //console.log(params)
      this.$store.dispatch("setBottomInfo", val).then(_ => {
        this.$store.dispatch("getSearchFileInfo");
      });
    },
    noCheck() {
      this.$store.dispatch("setBottomInfo", []).then(res => {
        this.$store.dispatch("resetFileInfo");
      });
    }
  },
  activated() {
    this.show = true;
    this.$store.dispatch("showBottom");
  },
  deactivated() {
    this.$store.dispatch("hideBottom");
    this.show = false;
  }
};
</script>
<style>

</style>
