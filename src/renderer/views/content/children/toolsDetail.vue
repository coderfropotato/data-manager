<template>
    <div id="toolsDetail">{{toolType}}
        <div id="tools_draw_context"></div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["toolType"])
  },
  created() {
    this.tools.setWrap("#tools_draw_context");
  },
  activated() {
    this.$store.dispatch("removeRightView", true);
    this.tools.setType(this.toolType);
  },
  deactivated() {
    this.$store.dispatch("removeRightView", false);
  }
};
</script>

<style>

</style>
