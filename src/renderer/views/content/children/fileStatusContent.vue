<template>
  <div id="file-status-root" @click="reset">
    <el-tree 
      :data="treeData"
      show-checkbox
      default-expand-all
      :expand-on-click-node="true"
      node-key="path"
      ref="tree"
      :highlight-current="true"
      @check-change = "handlerCheckChange"
      @node-click="handlerNodeClick"
      :render-content="renderContent"
      :props="defaultProps">
    </el-tree>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import bus from "@/utils/bus";
import fetchData from "@/api/getData";
export default {
  name: "fileStatus",
  activated() {
    // this.$store.dispatch("showBottom");
  },
  computed: {
    ...mapGetters(["treeData"])
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "alias"
      },
      timerList: []
    };
  },
  methods: {
    renderContent(h, { node, data }) {
      if (data.status != null) {
        let color = null;
        let tag = null;
        if (data.status === -1) {
          color = "red";
          tag = "最近删除";
        } else if (data.status === 0) {
          color = "gray";
          tag = "最近修改";
        } else if (data.status === 1) {
          color = "green";
          tag = "最近新增";
        } else if (data.status === 2) {
          color = "orange";
          tag = "已打标签";
        }

        return h("span", [
          h("span", node.label),
          h(
            "el-tag",
            {
              style: {
                backgroundColor: color,
                marginLeft: "12px"
              }
            },
            tag
          )
        ]);
      } else {
        // 不带status节点
        return h("span", [h("span", node.label)]);
      }
    },
    //side bar clicked
    setCheckedKeys(path) {
      let arr = [];
      typeof path === "string" ? arr.push(path) : (arr = path);
      this.$refs.tree.setCheckedKeys(arr);
    },
    //node clicked
    handlerNodeClick(...args) {
      console.log(args[0]);
      // save savefileInfo params then getFileInfo last save
      // getFileInfo  serialNumber, rootPath, filepath
      this.$store.dispatch("commitSaveFileParams", params).then(_ => {
        this.$store.dispatch("getStatusFileInfo").then(_ => {
          this.$router.push("/filestatusinfo?type=status");
        });
      });
    },
    handlerCheckChange(...args) {
      //always clear other timers and save the last
      for (var i = 0; i < this.timerList.length; i++) {
        clearTimeout(this.timerList[i]);
      }
      let timer = null;
      timer = setTimeout(_ => {
        console.log(args);
        //console.log(this.$refs.tree.getCheckedNodes(true));
        //dispatch bottom status
      }, 30);
      this.timerList.push(timer);
    },
    //点击空白回状态信息
    reset() {
      this.$router.push("/filestatus");
    }
  },
  deactivated() {
    // this.$store.dispatch("hideBottom");
  },
  created() {
    //接收sidebar的点击事件
    bus.$on("statueSideBarClick", id => {
      this.setCheckedKeys(id);
    });
  }
};
</script>

<style lang="scss" scoped>
#file-status-root {
  height: 100%;
  padding: 40px;
  -webkit-overflow-y: overlay;
  overflow-x: hidden;
  .el-tree {
    border: none;
  }
}
</style>
