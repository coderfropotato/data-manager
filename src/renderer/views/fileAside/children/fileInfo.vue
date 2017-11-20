<template>
  <div id="fileInfo-root">
    <div v-if="fileInfo.basic">
      <!-- status layout start-->
      <ol v-if="globalRouteStatus==='status' && topShow" class="status-bar">
        <li>自动识别</li>
        <li @click="getPre">上一项</li>
        <li @click="getNext">下一项</li>
      </ol>
      <!-- status layout end -->
      <div class="title">
        <p>文件详情</p>
        <span v-show="!module" @click="module=true">保存</span>
        <span v-show="module" @click="module=false">编辑</span>
      </div>
      <div class="des">
        <img v-if="fileInfo.isdir" src="../../../assets/images/dir.png" alt=""> 
        <img v-else src="../../../assets/images/single.png" alt=""> 
        <span>{{fileInfo.basic.filename}}</span>
      </div>
      <ul>
        <li>
          <p>文件类型：<span>{{fileInfo.fileType}}</span></p>
        </li>
        <li>
          <p>文件大小：<span>{{fileInfo.basic.size | reverseSize}}</span></p>
        </li>
        <li>
          <p>创建时间：<span>{{fileInfo.basic.ctime}}</span></p>
        </li>
      </ul>
      <div class="text">
        <h5>数据来源</h5>
        <p>类别：{{fileInfo.source.category}}</p>
        <p>数据源：<a href="javascript:;">{{fileInfo.source.source}}</a></p>
        <h5 class="item">属性</h5>
        <div class="attrs">
          <span>名称</span>
          <span>详情</span>
        </div>
        <ol class="item-list">
            <li :class="{'edit':!module}" v-for="(val,index) in fileInfo.property" :key="index">
              <input ref="attrs" :diasbled="module" type="text" @change="updateMessage($event,index,'key')" :value="val.name"> ：
              <input @change="updateMessage($event,index,'val')" :value="val.attr" :diasbled="module" type="text">
            </li>
        </ol>
        <!-- add attrs -->
        <h5 class="item">备注</h5>
        <textarea id="texta" :readonly="module"  :value="fileInfo.remark" @change="updateMessage($event)">></textarea>
      </div>
      <div @click="addAttrs" v-show="!module" class="add-attrs">
        <i class="iconfont icon-tianjia"></i><span>添加文件属性</span>
      </div>
    </div>
    <!-- nodata -->
    <div class="no-data" v-if="!fileInfo.basic">
      <img src="../../../assets/images/nodata.png" alt="">
        <P>暂无文件详情</P>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import bus from "@/utils/bus";
import $ from "jquery";
export default {
  name: "FileInfo",
  data() {
    return {
      module: true,
      topShow:true
    };
  },
  created() {
    bus.$on("no-data", _ => {
      this.$store.dispatch("resetFileInfo");
    });
    // 是否显示上一个下一个
    bus.$on('topshow',_=>{
      this.topShow = _;
    })
  },
  computed: {
    ...mapGetters(["fileInfo", "globalRouteStatus", "curData", "curIndex"])
  },
  methods: {
    updateMessage(e, index, type) {
      let params;
      if (!type) {
        params = e.target.value;
      } else {
        params = {
          index: index,
          type: type,
          val: $.trim(e.target.value)
        };
      }
      this.$store.dispatch("updateMessage", params).then(res => {
        this.$store.dispatch("saveFileInfo");
      });
    },
    addAttrs() {
      //add file attrs
      this.$store.dispatch("addFileInfo");
    },
    getPre() {
      if (this.curData[this.curIndex - 1]) {
        let rootPath = this.curData[this.curIndex - 1].root_path;
        let filepath = this.curData[this.curIndex - 1].path;
        let serialNumber = this.curData[this.curIndex - 1].serialNumber;
        let params = { serialNumber, rootPath, filepath };
        this.$store.dispatch("commitSaveFileParams", params).then(_ => {
          this.$store.dispatch("getStatusFileInfo").then(_ => {
            this.$store.dispatch('reduceCurIndex')
          });
        });
      } else {
        this.$message("到头了，亲");
      }
    },
    getNext() {
      if (this.curData[this.curIndex + 1]) {
        let rootPath = this.curData[this.curIndex + 1].root_path;
        let filepath = this.curData[this.curIndex + 1].path;
        let serialNumber = this.curData[this.curIndex + 1].serialNumber;
        let params = { serialNumber, rootPath, filepath };
        this.$store.dispatch("commitSaveFileParams", params).then(_ => {
          this.$store.dispatch("getStatusFileInfo").then(_ => {
            this.$store.dispatch('addCurIndex')
          });
        });
      } else {
        this.$message("已经是最后一个了，亲");
      }
    }
  }
};
</script>
<style lang="scss" scoped >
#fileInfo-root {
  height: 100%;
  width: 100%;
  padding: 2em;
  font-size: 14px;
  overflow-y: scroll;
  .status-bar {
    display: flex;
    justify-content: space-around;
    list-style: none;
    margin-bottom: 20px;
    li {
      width: 76px;
      height: 28px;
      text-align: center;
      line-height: 28px;
      border-radius: 4px;
      color: #333;
      background: #f5f5f5;
      cursor: pointer;
      &:hover {
        color: #fff;
        background: #386cca;
      }
    }
  }
  .title {
    display: flex;
    justify-content: space-between;
    span {
      color: #fff;
      background: #386cca;
      padding: 4px 12px;
      border-radius: 2px;
      cursor: pointer;
      user-select: none;
      opacity: 1;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .des {
    margin: 22px 0;
    display: flex;
    img {
      width: 56px;
      height: 56px;
      display: block;
      user-select: none;
    }
    span {
      line-height: 56px;
      margin-left: 20px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    li {
      flex: 1;
      text-align: left;
      display: flex;
      flex-direction: column;
      margin-top: 12px;
      p {
        font-size: 14px;
      }
    }
  }
  .text {
    margin-top: 40px;
    h5 {
      font-size: 14px;
      margin-bottom: 12px;
      font-weight: normal;
    }
    .item {
      margin-top: 32px;
    }
    .attrs {
      display: flex;
      margin-bottom: 8px;
      span {
        &:first-child {
          width: 20%;
        }
        &.last-child {
          width: 75%;
        }
      }
    }
    p {
      line-height: 26px;
      white-space: nowrap;
      overflow: hidden;
      font-size: 12px;
      text-overflow: ellipsis;
      width: 100%;
      display: flex;
      input {
        outline: none;
        border: none;
        border-bottom: 1px solid #ccc;
        font-size: 12px;
        font-family: "Helvetica Neue", Helvetica, "PingFang SC",
          "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
        &:first-child {
          width: 60px;
        }
        &:last-child {
          flex: 1;
        }
      }
      a {
        color: #386cca;
        font-size: 12px;
      }
    }
    textarea {
      width: 100%;
      height: 88px;
      border-radius: 4px;
      outline: none;
    }
    .item-list {
      max-height: 100px;
      overflow-y: auto;
      li {
        width: 100%;
        display: flex;
        margin-bottom: 8px;
        &.edit {
          input {
            border: 1px solid #ccc;
          }
        }
        input {
          border: none;
          outline: none;
          &:first-child {
            width: 20%;
          }
          &:last-child {
            width: 75%;
          }
        }
      }
    }
  }
  .add-attrs {
    margin-top: 20px;
    cursor: pointer;
    vertical-align: center;
    i {
      margin-right: 12px;
    }
  }
  .no-data {
    margin-top: 40px;
    text-align: center;
    img {
      width: 102px;
    }
  }
}
</style>
