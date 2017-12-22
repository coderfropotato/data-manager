<template>
    <div id="toolsDetail" class="drawWrap">
        <p>
          <span @click="toTools" style="cursor:pointer;">工具</span>
          <span> > 热图</span>
        </p>
        <div id="tools_draw_context">
            <div class="options">
              <ul>
                <!-- 输入文件 -->
                <li>
                  <p class="title">输入文件</p>
                  <div class="context">
                    <el-form  ref="project" label-width="80px" :model="formData" >
                      <!-- 项目名称 -->
                      <el-form-item label="项目名称" prop="projectName" :rules="[
                            { required: true, message: '项目名不能为空'}
                          ]" >
                        <el-input type="text" :maxlength="50" v-model.trim="formData.projectName" size="small"></el-input>
                      </el-form-item>
                      <!-- 选择文件 -->
                      <el-form-item label="选择文件" >
                        <el-button v-if="!formData.filePath.length" @click="selectFile" type="primary" size="small">点击选择文件</el-button>
                        <p @click="selectFile" :title="formData.filePath" class="selectPath" v-if="formData.filePath.length">{{formData.filePath}}</p>
                      </el-form-item>
                    </el-form>
                  </div>
                </li>
                <!-- 选择数据 -->
                <li>
                  <p class="title">选择数据</p>
                  <div class="context">
                    <el-form  label-width="116px">
                      <!-- 选择作图列 -->
                      <el-form-item label="选择用于作图的列">
                        <el-input type="text" :maxlength="50" size="small"  v-model.trim="formData.drawColumns" placeholder="如2,3,6,9"></el-input>
                      </el-form-item>
                    </el-form>
                      <p style="margin:12px 0;">选择用于作图的行：（a.可以输入数字代表前多少行用于作图.b.输入一个基因名列表文件，用文件里的基因名对应行作图）</p>
                      <!-- type="card" -->
                      <el-tabs v-model="activeName"  @tab-click="handleClick">
                        <el-tab-pane label="输入数字" name="text">
                            <el-form  label-width="110px">
                              <!-- 作图使用前多少行 -->
                              <el-form-item label="作图使用前(行)">
                                <el-input :maxlength="50" size="small" v-model.trim="formData.drawRows" placeholder="默认选择所有行进行聚类分析"></el-input>
                              </el-form-item>
                          </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="选择基因列表文件" name="file">
                          <el-form>
                            <!-- 选择基因列表文件 -->
                            <el-form-item label="选择文件" >
                              <el-button v-if="!formData.fileOptionPath.length" @click="selectFileOption" type="primary" size="small">点击选择文件</el-button>
                              <p @click="selectFileOption" :title="formData.fileOptionPath" class="selectPath" v-if="formData.fileOptionPath.length">{{formData.fileOptionPath}}</p>
                            </el-form-item>
                          </el-form>
                        </el-tab-pane>
                      </el-tabs>
                      <!-- <el-form >
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
                      </el-form> -->
                  </div>
                </li>
                <!-- 数据操作 -->
                <li>
                  <p class="title">数据操作</p>
                  <div class="context">
                    <el-form  label-width="80px">
                      <!-- 归一化 -->
                      <el-form-item label="归一化">
                        <el-select size="small" v-model="formData.normalization" placeholder="">
                          <el-option label="row" value="row"></el-option>
                          <el-option label="column" value="column"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="行聚类">
                        <!-- 行聚类 -->
                        <el-select size="small" v-model="formData.rowCluster">
                          <el-option label="yes" value="true"></el-option>
                          <el-option label="no" value=""></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="列聚类">
                        <!-- 列聚类 -->
                        <el-select size="small" v-model="formData.columnCluster">
                          <el-option label="yes" value="true"></el-option>
                          <el-option label="no" value=""></el-option>
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
                      <el-form-item label="颜色:(升序)">
                         <el-color-picker v-model="drawOptions.colors[0]"></el-color-picker>
                         <el-color-picker v-model="drawOptions.colors[1]"></el-color-picker>
                         <el-color-picker v-model="drawOptions.colors[2]"></el-color-picker>
                      </el-form-item>
                    </el-form>
                    <el-form :inline="true">
                      <el-form-item label="字体大小">
                        <el-input :maxlength="50" size="small" type="number"  v-model.number="drawOptions.fontSize" placeholder="请输入字体大小"></el-input>
                      </el-form-item>
                      <!-- <el-form-item label="格子的长度*高度">
                        <el-input :maxlength="50" size="small" type="text" v-model="drawOptions.cubeSize" placeholder="如20*12"></el-input>
                      </el-form-item> -->
                      <el-form-item label="画出格子的边界">
                        <el-select size="small" v-model="drawOptions.drawBorder">
                          <el-option label="yes" value="true"></el-option>
                          <el-option label="no" value=""></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="是否显示行名">
                        <el-select size="small" v-model="drawOptions.showRowName">
                          <el-option label="yes" value="true"></el-option>
                          <el-option label="no" value=""></el-option>
                        </el-select>
                      </el-form-item>
                      <!-- <el-form-item label="任务完成后发邮件通知我">
                        <el-checkbox-group v-model="formData.email">
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
              <div v-show="activeIndex==0" class="draw-area tab">
                <svg id="svg_cyjjfx_clusterpic" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;margin: 0 auto;">
                </svg>
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
      formData: {
        //项目名称
        projectName: "heatmap5698c9",
        //文件路径
        filePath: "",
        //用于作图的列
        drawColumns: "",
        //用于作图的行
        drawRows: "",
        //基因列表文件
        fileOptionPath: "",
        //归一化
        normalization: "row",
        //行聚类
        rowCluster: "",
        //列聚类
        columnCluster: "true",
        //邮件通知
        email: false
      },
      drawOptions: {
        colors: ["#1a79de", "#fafcf8", "#d94335"],
        fontSize: 14,
        cubeSize: "",
        drawBorder: "yes",
        showRowName: "",
        projectName: ""
      },
      tabList: ["预览", "说明", "例子"],
      activeIndex: 0,
      tabIndex: "0",
      activeName: "text",
      rules: {
        alias: [{ required: true, message: "请输入项目名称", trigger: "blur" }]
      },
      // serverOptionsChange: true,
      drawData: {},
      isMessage:false,
    };
  },
  computed: {
    ...mapGetters(["toolType"])
  },
  methods: {
    sub() {
      this.$refs.project.validate(valid => {
        if (valid) {
          // file path
          if (!this.formData.filePath) {
            if (!this.isMessage) {
              this.isMessage = true;
              this.$message({
                message: "请上传数据文件",
                duration: 1200,
                onClose: _ => {
                  this.isMessage = false;
                }
              });
            }
            return;
          }
          let formData = this.formData;
          // actived tab
          this.tabIndex === "0"
            ? (formData["fileOptionPath"] = "")
            : (formData["drawRows"] = "");
          // if (this.serverOptionsChange) {
          fetchData("heatMap", formData).then(res => {
            if (res.Error) {
              if (!this.isMessage) {
                this.isMessage = true;
                this.$message({
                  message: res.Error,
                  duration: 1200,
                  onClose: _ => {
                    this.isMessage = false;
                  }
                });
              }
            } else {
              this.drawData = res.result;
              // draw config
              this.drawOptions.projectName = this.formData.projectName;
              this.tools.setWrap("#svg_cyjjfx_clusterpic");
              this.tools.setType(this.$route.query.type);
              this.tools.draw(this.drawData, this.drawOptions);
            }
          });
          // } else {
          //   this.drawOptions.projectName = this.formData.projectName;
          //   this.tools.setWrap("#svg_cyjjfx_clusterpic");
          //   this.tools.setType(this.$route.query.type);
          //   this.tools.draw(this.drawData, this.drawOptions);
          // }
          // this.initStatus();
        } else {
          if (!this.isMessage) {
            this.isMessage = true;
            this.$message({
              message: "请填写项目名称",
              duration: 1200,
              onClose: _ => {
                this.isMessage = false;
              }
            });
          }
        }
      });
      return;
    },
    toTools() {
      this.$router.push("./toolsIndex");
    },
    handleClick(tab, event) {
      this.tabIndex = tab.index;
    },
    tab(index) {
      this.activeIndex = index;
    },
    selectFile() {
      this.$electron.ipcRenderer.send("selectFile", "returnFilePath");
      this.$electron.ipcRenderer.on("returnFilePath", (e, path) => {
        this.formData.filePath = path[0];
      });
    },
    selectFileOption() {
      this.$electron.ipcRenderer.send("selectFile", "returnFileOption");
      this.$electron.ipcRenderer.on("returnFileOption", (e, path) => {
        this.formData.fileOptionPath = path[0];
      });
    },
    initStatus() {
      this.serverOptionsChange = false;
    }
  },
  watch: {
    // formData: {
    //   handler: function() {
    //     this.serverOptionsChange = true;
    //   },
    //   deep: true
    // }
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

</style>
