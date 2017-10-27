<template>
  <div id="searchContent">
    searchContent
  </div>
</template>
<script>
import List from "@/components/list";
import { mapGetters } from "vuex";

export default {
  name: "DataDisplay",
  data() {
    return {};
  },
  methods: {},
  mounted() {
    this.$store.dispatch("showBottom");
  },
  beforeDestroy() {
    this.$store.dispatch("hideBottom");
  }
};
</script>
<style>

</style>
