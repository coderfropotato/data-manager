<template>
    <div id="toolsVenn" class="drawWrap">
        <p>
          <span @click="toTools" style="cursor:pointer;">工具</span>
          <span> > 表格筛选</span>
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
                        <el-button v-if="!form.filePath.length" @click="selectFile" type="primary" size="mini">点击选择文件</el-button>
                        <p @click="selectFile" :title="form.filePath" class="selectPath" v-if="form.filePath.length">{{form.filePath}}</p>
                      </el-form-item>
                    </el-form>
                  </div>
                </li>
                <!-- 选择数据 -->
                <li>
                  <p class="title">选择数据</p>
                  <div class="context">
                    <el-form >
                      <el-form-item label="有无表头：">
                          <el-radio-group v-model="form.hasTableHead">
                            <el-radio label="true">有包含表头</el-radio>
                            <el-radio label="">不包含表头</el-radio>
                          </el-radio-group>
                      </el-form-item>
                    </el-form>
                    <el-form label-width="108px">
                       <el-form-item label="对几列进行筛选">
                            <el-input size="small" v-model.number="form.columns"></el-input>
                       </el-form-item>
                    </el-form>
                    <el-form label-width="0" class="form-row-radio">
                      <el-form-item>
                            <el-radio-group v-model="form.sort">
                              <el-radio label="file">筛选结果按源文件里顺序排列</el-radio>
                              <el-radio label="text">筛选结果按提取清单顺序排列</el-radio>
                          </el-radio-group>
                       </el-form-item>
                    </el-form>
                    <el-form label-position="top">
                      <el-form-item label="要提取的名称清单：">
                          <el-input type="textarea" v-model="form.list" placeholder="输入一个数据，请换行后输入另一个数据，以此类推。"></el-input>
                      </el-form-item>
                    </el-form>
                    <el-form>
                      <el-form-item label="上传文件" >
                        <el-button v-if="!form.listPath.length" @click="selectListFile" type="primary" size="mini">点击上传文件</el-button>
                        <p @click="selectListFile" :title="form.listPath" class="selectPath" v-if="form.listPath.length">{{form.listPath}}</p>
                      </el-form-item>
                       <el-form-item label="任务完成后发邮件通知我">
                        <el-checkbox-group v-model="form.email">
                          <el-checkbox></el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                      <br>
                      <el-form-item>
                        <el-button type="primary" @click="sub">提交</el-button>
                      </el-form-item>
                    </el-form>
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
                <svg id="svg_venn" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;margin: 0 auto;">
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
      form: {
        projectName:"表格筛选",
        hasTableHead: "true",
        filePath: "",
        columns: 10,
        sort: "file",
        list: "",
        listPath: "",
        email:false
      },
      tabList: ["预览", "说明", "例子"],
      activeIndex: 0,
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
    sub(){

    },
    toTools() {
      this.$router.push("./toolsIndex");
    },
    tab(index) {
      this.activeIndex = index;
    },
    selectListFile() {
      this.$electron.ipcRenderer.send("selectFile", "returnlistPath");
      this.$electron.ipcRenderer.on("returnlistPath", (e, path) => {
        this.form.listPath = path[0];
      });
    },
    selectFile() {
      this.$electron.ipcRenderer.send("selectFile", "returnFile");
      this.$electron.ipcRenderer.on("returnFile", (e, path) => {
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

</style>
