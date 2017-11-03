<template>
  <div id="fileInfo-root">
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
        <ol  class="item-list">
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
    <div v-show="nodata">
        <P>暂无文件详情</P>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import bus from '@/utils/bus';

let tempData = ["1/1.txt/", "1/2.2/3.2/", "1/2.4/3/", "1/2.txt/"];
let tempCategory = [];

export default {
  name: "FileInfo",
  data() {
    return {
      module: "read",
      nodata:false,
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
      // 记录分类的数组
      categorys: [],
      textarea: "textarea"
    };
  },
  computed: mapGetters([
    "show",
    "basicInfo",
    "otherInfo",
    "categoryFileTree"
    // categorys: state => state.fileInfo.fileCategorys
  ]),
  mounted(){
  },
  watch: {
    show() {
      for (let node in tempData) {
        let path = tempData[node].split("/");
        path.pop();
        tempCategory.push(path.join(">"));
      }
      this.categorys = tempCategory;
    }
  },
  filters: {
    // 格式化文件名，如果文件名大于某个长度，则做截断处理
    formatName(name, maxLength) {
      if (name !== undefined) {
        return name.length > maxLength
          ? name.substr(0, maxLength - 1) + "..."
          : name;
      }
    },
    // 格式化文件大小，将
    formatSize(size) {
      if (!size) {
        return "无";
      }
      if (size <= 0) {
        return "0 bytes";
      }
      const abbreviations = ["bytes", "KB", "MB", "GB"];
      const index = Math.floor(Math.log(size) / Math.log(1024));
      return `${+(size / Math.pow(1024, index)).toPrecision(3)} ${abbreviations[
        index
      ]}`;
    },
    // 格式化时间，将秒转化成 XXXX/XX/XX 形式
    formatDate(date) {
      let d = new Date(date * 1000);
      let month = "" + (d.getMonth() + 1);
      let day = "" + d.getDate();
      let year = d.getFullYear();
      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;
      return [year, month, day].join("/");
    }
  },
  methods: {
    addAttrs(){
      this.tableInfo.push({name:"",attr:""})
      let len = this.$refs.attrs.length;
      console.log(len)
      console.log(this.$refs.attrs)
      //this.$refs.attrs[len].focus();
    },
    addFileCategory() {},
    setCheckNode() {
      // node-key 必须是唯一的，否则无法设置节点
      this.$refs.categoryTree.setCheckedKeys(tempData);
    },
    // 设置分类的目录
    setCategoryDir() {
      // 清空分类数组
      this.categorys = [];
      let checkedNodes = this.$refs.categoryTree.getCheckedNodes();
      for (let node in checkedNodes) {
        let path = checkedNodes[node].id.split("/");
        path.pop();
        this.categorys.push(path.join(">"));
      }
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
    .attrs{
      display: flex;
      margin-bottom: 8px;
      span{
        &:first-child{
          width: 20%;
        }
        &.last-child{
          width:75%;
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
        font-size:12px;
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
  .add-attrs{
    margin-top: 20px;
    cursor: pointer;
    vertical-align:center;
    i{
      margin-right:12px;
    }
  }
}
</style>
