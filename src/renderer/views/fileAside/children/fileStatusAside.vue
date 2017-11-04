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
    return {
      //  控制是否显示
      showBasicInfo: true, // 是否展示基本信息
      showSourceInfo: true, // 是否展示来源信息
      showFileInfo: true, // 是否展示文件属性
      // 来源类型下拉框选项
      sourceTypeOptions: [
        {
          value: "public",
          label: "公有数据"
        },
        {
          value: "private",
          label: "私有数据"
        }
      ],

      filetypeOptions: [
        {
          value: "fastq",
          label: "fastq"
        },
        {
          value: "wtf",
          label: "wtf"
        }
      ],

      // 前端临时保存的数据
      // 来源信息下拉框的值
      currentSourceInfo: {},

      // 当前准备填写的文件类型
      currentFiletype: "",

      // 文件属性的值
      currentFileattr: {},

      // 英文key与中文翻译对应表
      nameMap: {
        sample: "样本",
        library: "图书馆",
        fastq: "法斯特球",
        attr1: "哎呦",
        attr2: "不错哟",
        id: "样本编号",
        name: "样本名",
        organism: "物种",
        strain: "品种",
        tissue: "组织",
        sex: "性别",
        age: "年龄",
        development_stage: "发育阶段",
        breeding_history: "育种史",
        biomaterial_provider: "材料提供者",
        geographic_location: "地理位置",
        treatment: "处理方式",
        replicate: "生物学重复",
        generation: "世代",
        instrument: "测序平台",
        strategy: "建库策略",
        read_length: "读长",
        source: "组学分类",
        selection: "模版类型",
        layout: "单/双端",
        sequence_counts: "序列数",
        qualities_options: "质量信息编码方式",
        some: "你丫",
        thing: "还",
        oh: "真是个",
        interesting: "人才"
      },

      fastqTemplate: {
        filetype: "fastq",
        sample: {
          id: "",
          name: "",
          organism: "",
          strain: "",
          tissue: "",
          sex: "",
          age: "",
          development_stage: "",
          breeding_history: "",
          biomaterial_provider: "",
          geographic_location: "",
          treatment: "",
          replicate: "",
          generation: ""
        },
        library: {
          instrument: "",
          strategy: "",
          read_length: "",
          source: "",
          selection: "",
          layout: ""
        },
        fastq: {
          sequence_counts: "",
          qualities_options: ""
        }
      },

      wtfTemplate: {
        filetype: "wtf",
        attr1: {
          some: "",
          thing: ""
        },
        attr2: {
          oh: "",
          interesting: ""
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      "isDir", // 当前展示的文件是否是文件夹
      "selectedFilesNum", // 中间选中的文件数目
      "showMode", // 是否是展示文件信息，true时展示文件/文件夹属性，false展示选中了多少文件等属性
      "showFileStatusAside", // 是否展示右侧文件详情栏
      "basicInfo", // 文件基本信息
      "sourceInfo", // 文件来源信息
      "fileAttr", // 文件详细信息
      "fileType", // 即fileattr.filetype 文件类型
      "taggedModifiedFiles", // 已打好标签的文件列表
      "serialNumber", // 点选文件/文件夹的磁盘序列号
      "nodeData" // 当前点选的文件/文件夹对应的Tree组件中的Node对象
    ])
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
