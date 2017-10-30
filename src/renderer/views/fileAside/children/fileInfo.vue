<template>
  <div id="fileInfo-root">
    <div class="title">
      <p>文件详情</p>
      <span>编辑</span>
    </div>
    <div class="des">
      <img src="../../../assets/images/dna.png" alt=""> <span>Gmax-275-Wm82.a2.v1.fa</span>
    </div>
    <ul>
      <li>
        <div><span>文件类型</span><p>参考基因组</p></div>
      </li>
      <li>
        <div><span>文件大小</span><p>900M</p></div>
      </li>
      <li>
        <div><span>创建时间</span><p>2017-09-28</p></div>
      </li>
    </ul>
    <div class="text">
      <h5>数据来源</h5>
      <p>类别：公共数据</p>
      <p>类别：<a href="javascript:;">公共数据</a></p>
      <h5 class="item">参考基因组</h5>
      <p>名称：Gmax-275-Wm82.a2.v1</p>
      <p>数据：其他相关信息</p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

let tempData = ["1/1.txt/", "1/2.2/3.2/", "1/2.4/3/", "1/2.txt/"];
let tempCategory = [];

export default {
  name: "FileInfo",
  data() {
    return {
      // 记录分类的数组
      categorys: [],
      tempData
    };
  },
  computed: mapGetters([
    "show",
    "basicInfo",
    "otherInfo",
    "categoryFileTree"
    // categorys: state => state.fileInfo.fileCategorys
  ]),
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
<style lang="scss" scoped>
#fileInfo-root {
  height: 100%;
  width: 100%;
  background-color: rgba(242, 242, 242, 0.6);
  padding: 2em;
  font-size: 14px;
  overflow-y: scroll;
  .title{
    display: flex;
    justify-content: space-between;
    span{
      color: #386cca;
    }
  }
  .des{
    margin: 22px 0;
    display: flex;
    img{
      width:56px;
      height: 56px;
      border-radius: 50%;
      display: block;
    }
    span{
      line-height: 56px;
      margin-left: 20px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  ul{
    list-style: none;
    display: flex;
    justify-content: space-between;
    li{
      flex:1;
      font-size: 12px;
      text-align: center;
      border-right: 1px solid #ccc;
      &:last-child{
        border:none;
      }
      div{
        display: flex;
        flex-direction: column;
        p{
          margin-top: 20px;
        }
      }
    }
  }
  .text{
    margin-top: 40px;
    h5{
      font-size: 14px;
      margin-bottom: 12px;
      font-weight:normal;
     
    }
    .item{
      margin-top: 32px;
    }
    p{
      line-height: 26px;
      white-space: nowrap;
      overflow: hidden;
      font-size:12px;
      text-overflow: ellipsis;
      a{
        color: #386cca;
      }
    }
  }
}
</style>
