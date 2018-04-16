<template>
    <div class="login" @click="jump">
		login
	</div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    jump() {
      this.$router.push("/files?type=file");
      // this.$router.push("/filter");
      this.$store.dispatch("setGlobalIsLogin", true);
    }
  }
};
</script>


