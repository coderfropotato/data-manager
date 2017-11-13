<template>
  <div id="file-status-info-root">
    <div class="status-top">
      <img src="../../../assets/images/dir.png" alt="">
      <p>已选中99个文件</p>
      <el-button>接受所有文件变更</el-button>
    </div>
    <div class="advance">
      <p class="title">高级选项</p>
      <ul>
        <li>
          <p>其中22个最近新增文件</p>
          <div class="btn-group">
            <span>自动扫描</span>
            <span @click="jumpToStatusInfo">编辑新增文件</span>
          </div>
        </li>
        <li>
          <p>其中22个最近删除文件</p>
          <div class="btn-group">
            <span>保留标签信息</span>
            <span class="warning">彻底删除</span>
          </div>
        </li>
        <li>
          <p>其中22个最近修改文件</p>
          <div class="btn-group">
            <span>重新扫描</span>
          </div>
        </li>
        <li>
          <p>其中22个最近移动文件</p>
          <div class="btn-group">
            <span>继承信息</span>
            <span class="warning">不继承信息</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "FileStatusAside",
  data() {
    return {}
  },
  computed: {
  },
  methods: {
    jumpToStatusInfo(){
      this.$router.push('/filestatusinfo')
    }
  }
};
</script>

<style lang="scss" scoped>
#file-status-info-root {
  overflow-y: scroll;
  width: 100%;
  .status-top {
    text-align: center;
    padding: 20px 0;
    border-bottom: 1px solid #ccc;
    img {
      width: 32px;
      height: 32px;
    }
    p {
      margin: 8px 0 20px 0;
      line-height: 1;
    }
    .el-button {
      background: #386cca;
      color: #fff;
      border: none;
    }
  }
  .advance {
    padding: 20px;
    .title {
      color: #386cca;
    }
    ul {
      list-style: none;
      li {
        margin-top:30px;
        p{
          line-height: 1;
          margin-bottom:10px;
        }
        .btn-group{
          margin-top:12px;
          span{
            display: inline-block;
            padding:8px 20px;
            background:#f5f5f5;
            font-size:14px;
            border-radius:6px;
            cursor: pointer;
            opacity: 0.8;
            &:hover{
              opacity: 1;
            }
            &.warning{
              background: #f74a4a;
              color:#fff;
            }
            &:first-child{
              margin-right:12px;
            }
          }
        }
      }
    }
  }
}
</style>
