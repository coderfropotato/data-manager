<template>
<!-- v-loading="true" element-loading-text="拼命加载中" :highlight-current="true" -->
  <div id="file-status-root" @click="reset">
    <div v-show="loadingStatus" class="tips">数据加载中，请稍后...</div>
    <div v-show="!loadingStatus" class="context">
      <el-tree 
      :data="treeData"
      show-checkbox
      :expand-on-click-node="true"
      node-key="mark"
      ref="tree"
      default-expand-all
      :highlight-current="true"
      @check-change = "handlerCheckChange"
      @node-click="handlerNodeClick"
      :render-content="renderContent"
      :props="defaultProps">
    </el-tree>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import bus from "@/utils/bus";
import fetchData from "@/api/getData";
import $ from "jquery";
export default {
  name: "fileStatus",
  computed: {
    ...mapGetters([
      "treeData",
      "curStatus",
      "curData",
      "modifiedNumber",
      "loadingStatus"
    ])
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name"
      },
      timerList: []
    };
  },
  methods: {
    renderContent(h, { node, data }) {
      /* 1最近新增add
      2最近移动move	
      3已打标签lable
      4最近删除delete
      5最近修改modified */
      if (data.status != null) {
        let num = Number(data.status);
        let color = null;
        let mark = data.mark;
        let tag = null;
        if (num === 4) {
          color = "red";
          tag = "最近删除";
        } else if (num === 5) {
          color = "gray";
          tag = "最近修改";
        } else if (num === 1) {
          color = "green";
          tag = "最近新增";
        } else if (num === 3) {
          color = "orange";
          tag = "已打标签";
        } else if (num === 2) {
          (color = "#f60"), (tag = "最近移动");
        }

        return h("span", [
          h("span", node.label),
          h(
            "el-tag",
            {
              style: {
                backgroundColor: color,
                marginLeft: "12px"
              },
              attrs: {
                id: mark
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
    setCheckedKeys(mark) {
      let arr = [];
      typeof mark === "number" ? arr.push(mark) : (arr = mark);
      this.$refs.tree.setCheckedKeys(arr);
    },
    //node clicked
    handlerNodeClick(
      { isdir, path, root_path, serialNumber, status, mark },
      e,
      o
    ) {
      $(".el-tree-node").removeClass("is-current");
      //文件夹和最近删除没有详情
      if (isdir) {
        this.$router.push("/filestatus");
        return;
      } else if (status === 4) {
        this.$router.push("/filestatus");
        return;
      } else {
        let rootPath = root_path;
        let filepath = path;
        let params = { serialNumber, rootPath, filepath };
        // save savefileInfo params then getFileInfo last save
        // getFileInfo  serialNumber, rootPath, filepath
        // 如果没有选中  文件详情就不显示 上一个下一个
        if (!e.checked) {
          bus.$emit("topshow", false);
        } else {
          bus.$emit("topshow", true);
        }
        this.$store.dispatch("commitSaveFileParams", params).then(_ => {
          this.$store.dispatch("getStatusFileInfo").then(_ => {
            this.$router.push("/filestatusinfo?type=status");
          });
        });
        //update cur status and reset index
        if (status) {
          this.$store.dispatch("setCurStatus", status);
          this.$store.dispatch("setCurIndex", mark);
        }
      }
    },
    handlerCheckChange(...args) {
      //always clear other timers and save the last
      for (var i = 0; i < this.timerList.length; i++) {
        clearTimeout(this.timerList[i]);
      }
      let timer = null;
      timer = setTimeout(_ => {
        let checked = this.$refs.tree.getCheckedNodes(true);
        this.$store.dispatch("setCheckedData", checked);
        this.$router.push("/filestatus");
      }, 30);
      this.timerList.push(timer);
    },
    //点击空白回状态信息
    reset() {
      this.$router.push("/filestatus");
    }
  },
  created() {
    //side bar clicked  and default select all
    bus.$on("statueSideBarClick", mark => {
      this.setCheckedKeys(mark);
    });
  }
};
</script>

<style lang="scss" scoped>
#file-status-root {
  .tips{
    text-align: center;
    padding:40px 0;
  }
  height: 100%;
  padding: 40px;
  -webkit-overflow-y: overlay;
  overflow-x: hidden;
  .el-tree {
    border: none;
  }
  .el-tree-node__content {
    span {
      user-select: none !important;
    }
  }
}
</style>
