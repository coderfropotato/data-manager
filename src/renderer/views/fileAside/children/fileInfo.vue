<template>
  <div id="fileInfo-root">
    <div v-if="fileInfo.basic">
      <!-- status layout start-->
      <ol v-if="globalRouteStatus==='status'" class="status-bar">
        <li>自动识别</li>
        <li>上一项</li>
        <li>下一项</li>
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
    };
  },
  computed: {
    ...mapGetters(["fileInfo","globalRouteStatus"])
  },
  watch:{
    // 'module':function(val,oldVal){
    //   console.log(val,oldVal)
    //   if(val==='read'){
    //     document.querySelector('#texta').setAttribute('readonly','readonly');
    //   }else{
    //     document.querySelector('#texta').removeAttribute('readonly');
    //   }
    // }
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
        }
      }
      this.$store.dispatch("updateMessage", params).then(res => {
        //save fileinfo 
        this.$store.dispatch("saveFileInfo");
      });
    },
    addAttrs() {
      //add file attrs
      this.$store.dispatch("addFileInfo");
    }
  }
};
</script>
<style lang="scss" scoped >
#fileInfo-root {
  height: 100%;
  width: 100%;
  background-color: rgba(242, 242, 242, 0.6);
  padding: 2em;
  font-size: 14px;
  overflow-y: scroll;
  .title {
    display: flex;
    justify-content: space-between;
    span {
      color: #386cca;
      cursor: pointer;
    }
  }
  .des {
    margin: 22px 0;
    display: flex;
    img {
      width: 56px;
      height: 56px;
      display: block;
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
    textarea{
      width:100%;
      height:88px;
      border-radius:4px;
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
