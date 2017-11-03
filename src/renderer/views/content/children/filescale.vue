<template>
  <div id="filescale">
      <ol>
        <router-link :to="{path:'/searchfiles',query:{type:item.name}}" v-for="(item,index) in deviceList" :key="index" tag="li">
          <img v-if="!item.isDisk" src="../../../assets/images/computer.png" />
          <img v-else="item.isDisk" src="../../../assets/images/disk.png" />
          <p>{{item.name}}</p></router-link>
      </ol>
  </div>
</template>

<script>
export default {
  data() {
    return {
      deviceList: [
        {
          "name":"我的电脑",
          "isDisk":false
        },
        {
          "name":"我的磁盘",
          "isDisk":true
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
#filescale {
  height: 100%;
  i{
    font-size: 80px;
  }
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
      border-radius:10px;
      opacity: 0.9;
      &:hover{
        background:#386cca;
      }
      &:hover p {
          color:#fff;
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
