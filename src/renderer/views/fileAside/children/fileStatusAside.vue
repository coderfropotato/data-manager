<template>
  <div id="file-status-info-root" v-if="treeSideBar.length">
    <div class="status-top">
      <img src="../../../assets/images/dir.png" alt="">
      <p>已选中{{checkedData.length}}个文件</p>
      <el-button @click="reciveAll">接受所有文件变更</el-button>
    </div>
    <div class="advance">
      <p class="title">高级选项</p>
      <ul>
        <li v-if="treeCat.add.length">
          <p>其中{{treeCat.add.length}}个最近新增文件</p>
          <div class="btn-group">
            <!-- <span>自动扫描</span> -->
            <span @click="jumpToStatusInfo">编辑新增文件</span>
            <span @click="submitAddFileInfo" class="success">处理完毕</span>
          </div>
        </li>
        <li  v-if="treeCat.delete.length">
          <p>其中{{treeCat.delete.length}}个最近删除文件</p>
          <div class="btn-group">
            <span @click="saveDelFileAttr">保留标签信息</span>
            <!-- <span class="success">处理完毕</span> -->
            <span @click="delDelFileAttr" class="warning">彻底删除</span>
          </div>
        </li>
        <li v-if="treeCat.modified.length">
          <p>其中{{treeCat.modified.length}}个最近修改文件</p>
          <div class="btn-group">
            <!-- <span>重新扫描</span> -->
            <span @click="submitModifyFileInfo" class="success">处理完毕</span>
          </div>
        </li>
        <li v-if="treeCat.move.length">
          <p>其中{{treeCat.move.length}}个最近移动文件</p>
          <div class="btn-group">
            <span @click="saveMoveFileAttr">继承信息</span>
            <!-- <span class="success">处理完毕</span> -->
            <span @click="noInheritInfo" class="warning">不继承信息</span>
          </div>
        </li>
        <li v-if="treeCat.label.length">
          <p>其中{{treeCat.label.length}}个已打标签文件</p>
          <div class="btn-group">
            <span @click="submitTaggedFileInfo" class="success">处理完毕</span>
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
    return {};
  },
  computed: {
    ...mapGetters(["checkedData", "treeCat", "modifiedNum","treeSideBar"])
  },
  methods: {
    jumpToStatusInfo() {
      if (this.treeCat.add.length) {
        let filepath = this.treeCat.add[0].path;
        let rootPath = this.treeCat.add[0].root_path;
        let serialNumber = this.treeCat.add[0].serialNumber;
        this.$store
          .dispatch("commitSaveFileParams", {
            filepath,
            rootPath,
            serialNumber
          })
          .then(_ => {
            this.$store.dispatch("getStatusFileInfo").then(_ => {
              this.$router.push("/filestatusinfo");
            });
          });
        //update cur status and reset index
        if (this.treeCat.add[0].status) {
          this.$store.dispatch("setCurStatus", this.treeCat.add[0].status);
          this.$store.dispatch("setCurIndex", this.treeCat.add[0].mark);
        }
      } else {
        this.$message("请先选择需要编辑的新增文件");
      }
    },
    reciveAll(){
      this.$store.dispatch('reciveAll')
    },
    submitAddFileInfo(){
      this.$store.dispatch('submitAddFileInfo');
    },
    saveDelFileAttr(){
      this.$store.dispatch('saveDelFileAttr')
    },
    delDelFileAttr(){
      this.$store.dispatch('delDelFileAttr')
    },
    submitModifyFileInfo(){
      this.$store.dispatch('submitModifyFileInfo')
    },
    saveMoveFileAttr(){
      this.$store.dispatch('saveMoveFileAttr')
    },
    noInheritInfo(){
      this.$store.dispatch('noInheritInfo')
    },
    submitTaggedFileInfo(){
      this.$store.dispatch('submitTaggedFileInfo')
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
        margin-top: 30px;
        p {
          line-height: 1;
          margin-bottom: 10px;
        }
        .btn-group {
          margin-top: 12px;
          span {
            display: inline-block;
            padding: 4px 6px;
            background: #ddd;
            font-size: 12px;
            border-radius: 0px;
            cursor: pointer;
            margin-right: 12px;
            border-radius: 4px;
            opacity: 0.8;
            &:hover {
              opacity: 1;
            }
            &.warning {
              background: #f74a4a;
              color: #fff;
            }
            &.success{
              color: #fff;
              background-color:#386cca;
            }
            &:last-child {
              margin-right:0;
            }
          }
        }
      }
    }
  }
}
</style>
