<template>
  <div id="file-status-root">
    fileStatus content
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "fileStatus",
  mounted() {
  },
  activated(){
    this.$store.dispatch("showBottom");
  },
  data() {
    return {
      // 中间栏是否显示commit/ignore按钮
      showCommitOrIgnore: false
    };
  },
  methods: {
    // 渲染状态标签
    renderContent(h, { node, data }) {
      // 带status节点
      if (data.status != null) {
        let color = null;
        let tag = null;

        // 判断status
        if (data.status === -1) {
          color = "red";
          tag = "最近删除";
        } else if (data.status === 0) {
          color = "gray";
          tag = "最近修改";
        } else if (data.status === 1) {
          color = "green";
          tag = "最近新增";
        } else if (data.status.indexOf("tagged") !== -1) {
          color = "orange";
          tag = "已打标签";
        }

        return h("span", [
          h("span", node.label),
          h(
            "el-tag",
            {
              style: {
                backgroundColor: color
              }
            },
            tag
          )
        ]);
      } else {
        // 不带status节点
        return h("span", [h("span", node.label)]);
      }
    }
  },
  deactivated() {
    this.$store.dispatch("hideBottom");
  }
};
</script>

<style lang="scss" scoped>
#file-status-root {
  height: 100%;
  -webkit-overflow-y: overlay;
  overflow-x: hidden;
}
</style>
