<template>
  <div id="file-status-root">
    <el-tree
      :data="treeData"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="tree"
      highlight-current
      @node-click="jumpToNodeInfo"
      :render-content="renderContent"
      :props="defaultProps">
    </el-tree>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import bus from "@/utils/bus";
export default {
  name: "fileStatus",
  activated() {
    this.$store.dispatch("showBottom");
  },
  computed: {
    ...mapGetters(["treeData"])
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      }
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
    //通过node-key 选择
    setCheckedKeys(id) {
      let arr = [];
      typeof id === "number" ? arr.push(id) : (arr = id);
      this.$refs.tree.setCheckedKeys(arr);
    },
    //节点点击 显示详情、
    jumpToNodeInfo(obj,e,component){
      this.$router.push('/filestatusinfo')
    }
  },
  deactivated() {
    this.$store.dispatch("hideBottom");
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
