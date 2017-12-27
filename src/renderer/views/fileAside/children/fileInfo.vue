<template>
  <div id="fileInfo-root">
    <div v-if="fileInfo.basic">
      <!-- status layout start-->
      <ol v-if="globalRouteStatus==='status' && topShow" class="status-bar">
        <!-- <li>自动识别</li> -->
        <li @click="getPre">上一项</li>
        <li @click="getNext">下一项</li>
      </ol>
      <!-- status layout end -->
      <div class="title">
        <p class="icon-line"><i class="iconfont icon-wenjianxiangqing"></i>文件详情</p>
        <span v-show="!module" @click="finish">完成</span>
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
        <li v-if="! fileInfo.isdir">
          <p>文件大小：<span>{{fileInfo.basic.size | reverseSize}}</span></p>
        </li>
        <li>
          <p>创建时间：<span>{{fileInfo.basic.ctime | reverseTime}}</span></p>
        </li>
      </ul>
      <div class="text">
        <h5 class="icon-line"><i class="iconfont icon-shujulaiyuan"></i>数据来源</h5>
        <p>类别：{{fileInfo.source.category}}</p>
        <p>数据源：{{fileInfo.source.source}}</p>
        <h5 class="item icon-line"><i class="iconfont icon-cankaojiyinzu"></i>属性</h5>
        <div class="attrs">
          <span>名称</span>
          <span>属性</span>
        </div>
        <!-- edit mode false -->
        <ol v-show="!module" class="item-list">
          <!-- :class="{'edit':!module}" -->
            <li v-for="(val,index) in fileInfo.property" :key="index">
              <input :readonly="module" type="text" maxLength="50"  @change="updateMessage($event,index,'key')" :value="val.name" :title="val.name"> 
              <input :title="val.attr" @change="updateMessage($event,index,'val')" maxLength="50"  :value="val.attr" :readonly="module" type="text">
              <i @click="deleteAttrs(index)" class="iconfont icon-jianqu"></i>
            </li>
        </ol>
        <!-- mode true -->
        <ol v-show="module" class="item-list">
          <li v-for="(val,index) in fileInfo.property" :key="index">
            <p :title="val.name">{{val.name}}</p>
            <p :title="val.attr">{{val.attr}}</p>
          </li>
        </ol>
        <div @click="addAttrs" v-show="!module" class="add-attrs">
          <i class="iconfont icon-tianjia"></i><span>添加文件属性</span>
        </div>

        <!-- add attrs -->
        <h5 class="item icon-line"><i class="iconfont icon-beizhu"></i>备注</h5>
        <div class="text-area">
           <textarea id="texta" :class="{'active':module}"  :readonly="module" placeholder="您还没有添加备注"  :value="fileInfo.remark" @change="updateMessage($event)">></textarea>
        </div>
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
      topShow: true
    };
  },
  created() {
    // bus.$on("saveAttrEmptyError", _ => {
    //   this.$message("属性名称不能为空");
    // });
    bus.$on("topshow", _ => {
      this.topShow = _;
    });
    bus.$on("saveAttrNameSame", _ => {
      this.$message("属性名不能重复");
    });
  },
  mounted() {
    $(document)
      .on("mouseover", ".item-list li .iconfont", function() {
        $(this).removeClass('icon-jianqu').addClass("icon-jianqu-dianji");
      })
      .on("mouseout", ".item-list li .iconfont", function() {
        $(this).removeClass("icon-jianqu-dianji").addClass("icon-jianqu");
      });
  },
  computed: {
    ...mapGetters(["fileInfo", "globalRouteStatus", "curData", "curIndex"])
  },
  methods: {
    deleteAttrs(index) {
      this.$store.dispatch("deleteAttrs", index);
    },
    finish() {
      this.module = true;
      this.$store.dispatch("checkAttrs");
    },
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
        let mark = this.curData[this.curIndex - 1].mark;
        let rootPath = this.curData[this.curIndex - 1].root_path;
        let filepath = this.curData[this.curIndex - 1].path;
        let serialNumber = this.curData[this.curIndex - 1].serialNumber;
        let params = { serialNumber, rootPath, filepath };
        this.$store.dispatch("commitSaveFileParams", params).then(_ => {
          this.$store.dispatch("getStatusFileInfo").then(_ => {
            this.$store.dispatch("reduceCurIndex");
          });
        });
        this.addHighLight(mark);
      } else {
        this.$message("到头了，亲");
      }
    },
    getNext() {
      if (this.curData[this.curIndex + 1]) {
        let mark = this.curData[this.curIndex + 1].mark;
        let rootPath = this.curData[this.curIndex + 1].root_path;
        let filepath = this.curData[this.curIndex + 1].path;
        let serialNumber = this.curData[this.curIndex + 1].serialNumber;
        let params = { serialNumber, rootPath, filepath };
        this.$store.dispatch("commitSaveFileParams", params).then(_ => {
          this.$store.dispatch("getStatusFileInfo").then(_ => {
            this.$store.dispatch("addCurIndex");
          });
        });
        this.addHighLight(mark);
      } else {
        this.$message("已经是最后一个了，亲");
      }
    },
    addHighLight(mark) {
      $(".el-tree-node").removeClass("is-current");
      $("#" + mark)
        .parent()
        .parent()
        .parent()
        .addClass("is-current");
    }
  }
};
</script>
<style lang="scss" scoped >
#fileInfo-root {
  height: 100%;
  width: 100%;
  padding: 16px 0;
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
    padding: 0 30px;
    line-height: 26px;
    justify-content: space-between;
    p {
      font-size: 16px;
      margin-top: 2px;
    }
    span {
      color: #fff;
      background: #386cca;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      width: 68px;
      text-align: center;
      height: 30px;
      line-height: 24px;
      cursor: pointer;
      user-select: none;
      opacity: 1;
      transition: 0.3s all ease;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .des {
    padding: 0 30px;
    margin: 24px 0 8px 0;
    display: flex;
    img {
      width: 40px;
      height: 40px;
      display: block;
      user-select: none;
    }
    span {
      line-height: 48px;
      margin-left: 20px;
      font-size: 16px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  ul {
    padding: 0 30px;
    list-style: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    li {
      flex: 1;
      text-align: left;
      display: flex;
      line-height: 1;
      flex-direction: column;
      margin-top: 16px;
      p {
        font-size: 14px;
        span {
          font-size: inherit;
        }
      }
    }
  }
  .text {
    margin-top: 48px;
    h5 {
      padding: 0 30px;
      font-size: 16px;
      margin-bottom: 24px;
      font-weight: normal;
      line-height: 1;
    }
    .item {
      padding: 0 30px;
      margin-top: 48px;
      margin-bottom: 24px;
    }
    .attrs {
      padding: 0 30px;
      display: flex;
      margin-bottom: 8px;
      justify-content: space-between;
      span {
        font-size: 12px;
        color: #999;
        line-height: 1;
        &:first-child {
          width: 40%;
        }
        &:last-child {
          width: 55%;
        }
      }
    }
    p {
      padding: 0 30px;
      line-height: 1;
      white-space: nowrap;
      overflow: hidden;
      font-size: 14px;
      text-overflow: ellipsis;
      width: 100%;
      display: flex;
      margin-bottom: 16px;
      input {
        outline: none;
        border: none;
        border-bottom: 1px solid #ccc;
        font-size: 14px;
        font-family: "Helvetica Neue", Helvetica, "PingFang SC",
          "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
        &:first-child {
          width: 50%;
        }
        &:last-child {
          flex: 1;
        }
      }
      a {
        color: #386cca;
        font-size: 14px;
      }
    }
    .text-area {
      padding: 0 30px;
      textarea {
        resize: none;
        width: 100%;
        height: 140px;
        border-radius: 4px;
        outline: none;
        font-size: 14px;
        background: #f5f5f5;
        border: 1px solid #ccc;
        padding: 6px;
        &.active {
          border: none;
          outline: none;
        }
      }
    }
    .item-list {
      overflow-y: auto;
      -webkit-user-select: element;
      user-select: element;
      li {
        width: 100%;
        list-style: none;
        display: flex;
        padding: 6px 30px;
        justify-content: space-between;
        position: relative;
        i {
          width: 12px;
          height: 12px;
          position: absolute;
          font-size: 12px;
          left: 12px;
          top: 11px;
          z-index: 1000;
          cursor: pointer;
        }
        &:hover i {
          display: block;
        }
        input {
          border: 1px solid #ccc;
          background-color: #f5f5f5;
          padding: 2px;
          outline: none;
          line-height: 18px;
          font-size: 14px;
          border-radius: 4px;
          &:nth-child(2) {
            width: 55%;
          }
          &:first-child {
            width: 40%;
          }
        }
        p {
          margin-bottom: 0;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          font-size: 14px;
          line-height: 18px;
          border: 1px solid #ccc;
          background-color: #f5f5f5;
          padding: 2px;
          display: block;
          border-radius: 4px;
          &:first-child {
            width: 40%;
          }
          &:last-child {
            width: 55%;
          }
        }
      }
    }
  }
  .add-attrs {
    margin: 20px 30px 0 30px;
    cursor: pointer;
    color: #386cca;
    display: inline-block;
    vertical-align: center;
    &:hover{
      opacity: .8;
    }
    i {
      margin-right: 12px;
    }
  }
  .no-data {
    margin-top: 40px;
    text-align: center;
    img {
      width: 140px;
    }
    p {
      font-size: 14px;
      color: #a6afbf;
      line-height: 1;
      margin-top: 24px;
    }
  }
}
</style>
