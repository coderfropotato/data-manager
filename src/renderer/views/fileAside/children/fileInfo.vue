<template>
  <div id="fileInfo-root" @mouseleave="saveAttrs">
    <div v-show="!nodata">
      <div class="title">
        <p>文件详情</p>
        <span v-if="module=='read'" @click="module='edit'">编辑</span>
        <span v-if="module=='edit'" @click="module='read'">保存</span>
      </div>
      <div class="des">
        <img src="../../../assets/images/dna.png" alt=""> <span>Gmax-275-Wm82.a2.v1.fa</span>
      </div>
      <ul>
        <li>
          <p>文件类型：<span>参考基因组</span></p>
        </li>
        <li>
          <p>文件大小：<span>900M</span></p>
        </li>
        <li>
          <p>创建时间：<span>2017-09-27</span></p>
        </li>
      </ul>
      <div class="text">
        <h5>数据来源</h5>
        <p>类别：公共数据</p>
        <p>类别：<a href="javascript:;">公共数据</a></p>
        <h5 class="item">参考基因组</h5>
        <div class="attrs">
          <span>名称</span>
          <span>详情</span>
        </div>
        <ol class="item-list">
            <li :class="{'edit':module==='edit'}" v-for="(item,index) in tableInfo" :key="index"><input ref="attrs" v-model="item.name" :diasbled="{true:module!=='edit',false:module==='edit'}" type="text"> ：<input v-model="item.attr" :diasbled="{true:module!=='edit',false:module==='edit'}" type="text"></li>
        </ol>
        <!-- add attrs -->
        <!-- <p><input type="text">：<input type="text"></p> -->
        <h5 class="item">备注</h5>
        <el-input type="textarea" v-model="textarea"></el-input>
      </div>
      <div @click="addAttrs" v-show="module==='edit'" class="add-attrs">
        <i class="iconfont icon-tianjia"></i><span>添加文件属性</span>
      </div>
    </div>
    <!-- nodata -->
    <div class="no-data" v-show="nodata">
      <img src="../../../assets/images/nodata.png" alt="">
        <P>暂无文件详情</P>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import bus from "@/utils/bus";

export default {
  name: "FileInfo",
  data() {
    return {
      module: "read",
      nodata: true,
      isEdit: false,
      flag: true,
      tableInfo: [
        {
          name: "属性1",
          attr: "值1"
        },
        {
          name: "属性2",
          attr: "值2"
        },
        {
          name: "属性2",
          attr: "值2"
        },
        {
          name: "属性2",
          attr: "值2"
        },
        {
          name: "属性2",
          attr: "值2"
        },
        {
          name: "属性2",
          attr: "值2"
        }
      ],
      textarea: "textarea"
    };
  },
  computed: mapGetters([]),
  created() {
    //接收获取数据通知
    bus.$on("reciveData", params => {
      //get server attrs
      let res = [{ name: "123", attr: "sd" }];
      this.tableInfo = res;
      //初始化状态
      this.initStatus();
    });
    //无详情监听
    bus.$on('noInfoData',()=>{
      this.nodata = true;
      this.initStatus();
    })
  },
  watch: {
    tableInfo: {
      handler: function(val, oldVal) {
        if (!this.flag) {
          this.isEdit = true;
        }
      },
      deep: true
    },
    textarea: function() {
      if (!this.flag) this.isEdit = true;
    }
  },
  filters: {},
  methods: {
    saveAttrs() {
      //编辑过 并且 不是更新数据的时候
      if (this.isEdit && !this.flag) {
        for (let i = 0; i < this.tableInfo.length; i++) {
          if (!this.tableInfo[i].name) {
            this.tableInfo.splice(i, 1);
          } else {
            continue;
          }
        }
        this.isEdit = false;
      }
    },
    addAttrs() {
      this.isEdit = true;
      this.tableInfo.push({ name: "", attr: "" });
      let len = this.$refs.attrs.length;
    },
    initStatus() {
      this.flag = true;
      this.isEdit = false;
      //接收新的数据的时候 不watch
      setTimeout(() => {
        this.flag = false;
      }, 300);
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
      border-radius: 50%;
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
  .no-data{
    margin-top:40px;
    text-align: center;
    img{
      width:102px;
    }
  }
}
</style>
