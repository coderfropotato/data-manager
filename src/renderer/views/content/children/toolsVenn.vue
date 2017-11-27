<template>
    <div id="toolsVenn">toolsVenn</div>
</template>

<script>
export default {
  activated() {
    this.$store.dispatch("removeRightView", true);
  },
  deactivated() {
    this.$store.dispatch("removeRightView", false);
  }
};
</script>

<style>

</style>
