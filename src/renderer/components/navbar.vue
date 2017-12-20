<template>
    <div ref="navbar"  id="cp-nav">
        <!-- left named slot -->
        <div class="seat">
            <slot name="left"></slot>
        </div>
        <ul>
            <li v-if="config.mini" @click="mini"><i class="iconfont icon-yincang2"></i></li>
            <li v-if="config.resize" @click="resize"><i class="iconfont icon-suoxiao"></i></li>
            <li v-if="config.close"  @click="close"><i class="iconfont icon-guanbi"></i></li>
        </ul>
    </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    mini() {
      this.$emit("mini");
    },
    resize() {
      this.$emit("resize");
    },
    close() {
      this.$emit("close");
    }
  },
  mounted() {
    this.$refs.navbar.style.height = this.h + "px";
  },
  // h navbar height
  // config{"close":true,"mini":true,"resize":"true"}
  //
  props: ["h", "config"]
};
</script>

<style lang="scss" scoped>
#cp-nav {
  position: fixed;
  padding: 0 20px;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: #386cca;

  ul {
    list-style: none;
    margin-top: 8px;
    &:after {
      content: "";
      display: block;
      clear: both;
    }
    li {
      float: left;
      width: 30px;
      text-align: center;
      height: 30px;
      margin-left: 6px;
      i {
        color: #fff;
        font-size: 14px;
        line-height: 30px;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
  .seat {
    flex: 1;
    -webkit-app-region: drag;
    cursor: move;
  }
}
</style>
