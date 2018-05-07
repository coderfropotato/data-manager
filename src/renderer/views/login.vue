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
       // this.$electron.shell.openExternal('http://www.baidu.com');return;
      this.$router.push("/files?type=file");
      this.$store.dispatch("setGlobalIsLogin", true);
    }
  }
};
</script>


