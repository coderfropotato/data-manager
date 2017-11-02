<template>
  <div id="filescale">
      <ol>
        <router-link :to="{path:'/searchfiles',query:{type:item}}" v-for="(item,index) in deviceList" :key="index" tag="li">
          <img src="../../../assets/images/dna.png" alt="">
          <p>{{item}}</p></router-link>
      </ol>
  </div>
</template>

<script>
export default {
  data() {
    return {
      deviceList: ['computer','disk']
    };
  }
};
</script>

<style lang="scss" scoped>
#filescale {
  height: 100%;
  ol {
    display: flex;
    list-style: none;
    flex-flow: row wrap;
    justify-content: flex-start;
    padding: 34px;
    li {
      width: 120px;
      height: 120px;
      margin-bottom: 20px;
      text-align: center;
      padding-top: 10px;
      cursor: pointer;
      box-sizing: border-box;
      opacity: 0.9;
      &:hover p {
          color:#386cca;
      }
      img {
        width: 60px;
        height: 60px;
        display: inline-block;
        border-radius: 50%;
      }
      p {
        margin-top: 12px;
        font-size: 14px;
        text-align: center;
      }
    }
  }
}
</style>
