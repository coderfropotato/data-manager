<!--加载List或uploadFile组件-->
<template>
  <div id="fileContent" v-loading="loading">
    <!-- <router-view></router-view> -->
    fileContent
  </div>
</template>
<script>
import { mapState } from "vuex";
import bus from "@/utils/bus";
export default {
  name: "fileContent",
  data() {
    return {
      loading: false
    };
  },
  mounted() {
    this.$store.dispatch("showBottom");
  },
  destroyed() {
    this.$store.dispatch("hideBottom");
  },
  beforeMount() {
    bus.$on("loading-content", () => {
      this.loading = true;
    });
    bus.$on("loading-end", () => {
      this.$nextTick(() => {
        this.loading = false;
      });
    });
  }
};
</script>
<style lang="scss">
#contentBottom-root {
  height: 100%;
}
</style>
