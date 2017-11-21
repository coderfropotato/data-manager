<template>
    <div id="toolsDetail">
        <p>
          <span>工具</span>
          <span> > 热力图</span>
        </p>
        <div id="tools_draw_context">
            <div class="options">
              <ul>
                <!-- 输入文件 -->
                <li>
                  <p class="title">输入文件</p>
                  <div class="context">
                    <el-form  label-width="72px">
                      <el-form-item label="项目名称" >
                        <el-input size="small" type="text"></el-input>
                      </el-form-item>
                      <el-form-item label="上传文件" >
                        <el-upload
                          class="upload-demo"
                          action="https://jsonplaceholder.typicode.com/posts/"
                          :on-preview="handlePreview"
                          :on-remove="handleRemove"
                          :file-list="fileList">
                          <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                      </el-form-item>
                    </el-form>
                  </div>
                </li>
                <!-- 选择数据 -->
                <li>
                  <p class="title">选择数据</p>
                  <div class="context">
                    <el-form  label-width="124px">
                      <el-form-item label="选择用于作图的列" prop="region">
                        <el-select size="small" v-model="formData.region" placeholder="请选择活动区域">
                          <el-option label="区域一" value="shanghai"></el-option>
                          <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                      <p style="margin:12px 0;">选择用于作图的行：（a.可以输入数字代表前多少行用于作图.b.输入一个基因名列表文件，用文件里的基因名对应行作图）</p>
                      <el-form  label-width="45px">
                        <el-form-item>
                          <el-button size="mini">a.输入数字</el-button>
                          <el-button size="mini">b.输入基因列表文件</el-button>
                        </el-form-item>
                        <el-form  label-width="110px">
                          <el-form-item label="作图使用前(行)" prop="region">
                            <el-select size="small" v-model="formData.row" placeholder="请选择活动区域">
                              <el-option label="区域一" value="shanghai"></el-option>
                              <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-form>
                      </el-form>
                  </div>
                </li>
                <!-- 数据操作 -->
                <li>
                  <p class="title">数据操作</p>
                  <div class="context">
                    <el-form  label-width="80px">
                      <el-form-item label="归一化" prop="region">
                        <el-select size="small" v-model="formData.guiyi" placeholder="">
                          <el-option label="区域一" value="shanghai"></el-option>
                          <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="行聚类">
                        <el-select size="small" v-model="formData.julei">
                          <el-option label="yes" value="true"></el-option>
                          <el-option label="no" value="false"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="列聚类">
                        <el-select size="small" v-model="formData.julei">
                          <el-option label="yes" value="true"></el-option>
                          <el-option label="no" value="false"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                  </div>
                </li>
                <!-- 配置画图参数 -->
                <li>
                  <p class="title">配置画图参数</p>
                  <div class="context">
                    <el-form>
                      <el-form-item label="颜色:(从左到右，值越来越大)" prop="region">
                        <el-select size="small" v-model="formData.region">
                          <el-option label="手动输入" value="shanghai"></el-option>
                          <el-option label="xxx" value="beijing"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                    <el-form :inline="true">
                      <el-form-item label="字体大小">
                        <el-input size="small" type="number" v-model="formData.fontSize" placeholder="请输入字体大小"></el-input>
                      </el-form-item>
                      <el-form-item label="格子的长度*高度">
                        <el-input size="small" type="number" v-model="formData.fontSize" placeholder="请输入字体大小"></el-input>
                      </el-form-item>
                      <el-form-item label="画出格子的边界">
                        <el-select size="small" v-model="formData.border">
                          <el-option label="yes" value="shanghai"></el-option>
                          <el-option label="no" value="beijing"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="是否显示行名">
                        <el-select size="small" v-model="formData.rowName">
                          <el-option label="yes" value="shanghai"></el-option>
                          <el-option label="no" value="beijing"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="任务完成后发邮件通知我">
                        <el-checkbox-group v-model="formData.email">
                          <el-checkbox></el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                      <br>
                      <el-form-item>
                        <el-button type="primary">提交</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 画图区域 -->
            <div class="draw-content">
              <ul>
                <li class="active">预览</li>
                <li>说明</li>
                <li>例子</li>
              </ul>
              <div class="draw-area">

              </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      formData: {
        region: "",
        labelPosition: "",
        row: "",
        guiyi: "",
        julei: "",
        user: "",
        fontSize: 12,
        border:"yes",
        rowName:"no",
        columnName:"no",
        email:false
      },
      fileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["toolType"])
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    }
  },
  created() {
    this.tools.setWrap("#tools_draw_context");
  },
  activated() {
    this.$store.dispatch("removeRightView", true);
    this.tools.setType(this.toolType);
  },
  deactivated() {
    this.$store.dispatch("removeRightView", false);
  }
};
</script>

<style lang="scss" scoped>
#toolsDetail {
  display: flex;
  flex-direction: column;
  height: 100%;
  & > p {
    padding: 0 16px;
    line-height: 36px;
    border-bottom: 1px solid #ccc;
  }
  #tools_draw_context {
    padding: 20px;
    display: flex;
    width: 100%;
    height: 100%;
    .options {
      padding-right: 20px;
      width: 380px;
      height: 100%;
      overflow-y: auto;
      .el-form {
        font-size: 12px;
      }
      ul {
        li {
          list-style: none;
          border: 2px solid #ccc;
          border-radius: 8px;
          margin-bottom: 26px;
          box-shadow: 1px 1px 10px #ccc;
          &:last-child {
            margin-bottom: none;
          }
          .title {
            font-family: "Helvetica Neue", Helvetica, "PingFang SC",
              "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1",
              Arial, sans-serif;
            padding: 12px;
            font-size: 14px;
            line-height: 1;
            border-bottom: 1px solid #ccc;
          }
          .context {
            padding: 6px 12px;
          }
        }
      }
    }
    .draw-content {
      flex: 1;
      margin-left: 20px;
      border: 2px solid #ccc;
      ul{
        list-style: none;
        &:after{
          content:"";
          display: block;
          clear: both;
        }
        li{
          float:left;
          width: 74px;
          height: 24px;
          text-align: center;
          line-height: 24px;
          background: #386cca;
          color:#fff;
          opacity: 0.5;
          margin-right: 6px;
          cursor: pointer;
          &.active{
            opacity: 1;
          }
          &:last-child{
            margin-right:0;
          }
        }
      }
      .draw-area{
        padding: 40px;
        height: calc(100% - 24px);
        background: #f5f5f5;
      }
    }
  }
}
</style>
