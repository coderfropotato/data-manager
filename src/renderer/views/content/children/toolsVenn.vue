<template>
    <div id="toolsDetail" class="drawWrap">
        <p>
          <span @click="toTools" style="cursor:pointer;">工具</span>
          <span> > 韦恩图</span>
        </p>
        <div id="tools_draw_context">
            <div class="options">
              <ul>
                <!-- 输入文件 -->
                <li>
                  <p class="title">输入文件</p>
                  <div class="context">
                    <el-form  ref="project" label-width="80px" :model="form" >
                      <!-- 项目名称 -->
                      <el-form-item label="项目名称" prop="projectName" :rules="[
                            { required: true, message: '项目名不能为空'}
                          ]" >
                        <el-input type="text" :maxlength="50" v-model="form.projectName" size="small"></el-input>
                      </el-form-item>
                      <!-- 选择文件 -->
                      <el-form-item label="上传文件" >
                        <el-button v-if="!form.filePath.length" @click="selectFile" type="primary" size="small">点击选择文件</el-button>
                        <p @click="selectFile" :title="form.filePath" class="selectPath" v-if="form.filePath.length">{{form.filePath}}</p>
                      </el-form-item>
                    </el-form>
                    <el-form label-width="0">
                      <el-form-item>
                        <el-input type="textarea" placeholder="或手动输入矩阵文件" v-model="form.arrayFile"></el-input>
                      </el-form-item>
                    </el-form>
                    <el-form>
                       <!-- <el-form-item label="任务完成后发邮件通知我">
                        <el-checkbox-group v-model="form.email">
                          <el-checkbox></el-checkbox>
                        </el-checkbox-group>
                      </el-form-item> -->
                      <br>
                      <el-form-item>
                        <el-button class="submit" type="primary" @click="sub">提交</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 画图区域 -->
            <div class="draw-content">
              <ul>
                <li v-for="(item,index) in tabList" :key="index" @click="tab(index)"  :class="{'active':activeIndex==index}">{{item}}</li>
              </ul>
              <div v-show="activeIndex==0" class="draw-area tab venn">
                <!-- venn area -->
              </div>
              <div v-show="activeIndex==1" class="tab">
                <p>说明</p>
              </div>
              <div v-show="activeIndex==2" class="tab">
                <p>例子</p>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import fetchData from "@/api/getData";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        //项目名称
        projectName: "venn5698c9",
        //文件路径
        filePath: "C:UsersAdministratorDesktopexaple_data.txt",
        // 手动数据矩阵
        arrayFile: "",
        //邮件通知
        email: false
      },
      drawOptions: {
        projectName: ""
      },
      activeName: "text",
      tabList: ["预览", "说明", "例子"],
      activeIndex: 0,
      tabIndex: "0",
      rules: {
        alias: [{ required: true, message: "请输入项目名称", trigger: "blur" }]
      }
    };
  },
  created() {},
  computed: {
    ...mapGetters(["toolType"])
  },
  methods: {
    sub() {
      this.$refs.project.validate(valid => {
        if (valid) {
          // file path
          if (!this.form.filePath) {
            this.$message("请上传数据文件");
            return;
          }
          let filePath = this.form.filePath;
          let arrayFile = this.form.arrayFile;
          fetchData("getVenefigureDate", { filePath, arrayFile }).then(res => {
            // draw config
            console.log(res);
            this.drawOptions.projectName = this.form.projectName;
            this.drawOptions.callback = this.callback;
            this.tools.setWrap(".venn");
            // this.tools.setType("venn");
            this.tools.setType("vennStander");
            let data = {
              compareGroup: ["SRR1370913", "SRR1370914", "SRR1370915"],
              data: [
                {
                  result: {
                    OTUs: [],
                    SampleNameGroup: "SRR1370913",
                    Count: 359
                  }
                },
                {
                  result: {
                    OTUs: [],
                    SampleNameGroup: "SRR1370913∩SRR1370914",
                    Count: 1454
                  }
                },
                {
                  result: {
                    OTUs: [],
                    SampleNameGroup: "SRR1370913∩SRR1370914∩SRR1370915",
                    Count: 1090
                  }
                },
                {
                  result: {
                    OTUs: [],
                    SampleNameGroup: "SRR1370913∩SRR1370915",
                    Count: 108
                  }
                },
                {
                  result: {
                    OTUs: [],
                    SampleNameGroup: "SRR1370914",
                    Count: 426
                  }
                },
                {
                  result: {
                    OTUs: [],
                    SampleNameGroup: "SRR1370914∩SRR1370915",
                    Count: 127
                  }
                },
                {
                  result: {
                    OTUs: [],
                    SampleNameGroup: "SRR1370915",
                    Count: 272
                  }
                }
              ]
            };

            // this.tools.draw(res.result, this.drawOptions);
            this.tools.draw(data, this.drawOptions);
          });
        } else {
          this.$message("请填写项目名称");
        }
      });
      return;
    },
    callback(d, i) {
      console.log(d, i);
    },
    toTools() {
      this.$router.push("./toolsIndex");
    },
    tab(index) {
      this.activeIndex = index;
    },
    selectFile() {
      this.$electron.ipcRenderer.send("selectFile", "returnFilePath");
      this.$electron.ipcRenderer.on("returnFilePath", (e, path) => {
        this.form.filePath = path[0];
      });
    }
  },
  activated() {
    this.$store.dispatch("removeRightView", true);
  },
  deactivated() {
    this.$store.dispatch("removeRightView", false);
  }
};
</script>

<style lang="scss">
.venn {
  text-align: center;
  svg {
    width: 80%;
    height: 80%;
  }
}
.venntooltip {
  position: absolute;
  text-align: left;
  width: auto;
  background: #333;
  color: #ddd;
  padding: 4px 8px;
  border: 0px;
  opacity: 0;
  border-radius: 8px;
}
</style>
