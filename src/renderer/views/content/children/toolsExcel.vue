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
                          <el-radio-group v-model="form.hasHeader">
                            <el-radio :label="true">有包含表头</el-radio>
                            <el-radio :label="false">不包含表头</el-radio>
                          </el-radio-group>
                      </el-form-item>
                    </el-form>
                    <el-form >
                      <el-form-item label="查找类型：">
                          <el-radio-group v-model="form.isFuzzySearch">
                            <el-radio :label="true">模糊查找</el-radio>
                            <el-radio :label="false">精确查找</el-radio>
                          </el-radio-group>
                      </el-form-item>
                    </el-form>
                    <el-form >
                      <el-form-item label="忽略大小写：">
                          <el-switch on-text="" off-text="" v-model="form.ignoreCase"></el-switch>
                      </el-form-item>
                    </el-form>
                    <el-form ref="project" label-width="126px" :model="form">
                       <el-form-item prop="columnNum" label="对第几列进行筛选" :rules="[
                            { required: true, message: '请输入列'}
                          ]">
                            <el-input type="number" size="small" v-model.number="form.columnNum"></el-input>
                       </el-form-item>
                    </el-form>
                    <el-form label-width="0" class="form-row-radio">
                      <el-form-item>
                            <el-radio-group v-model="form.isSort">
                              <el-radio :label="true">筛选结果按源文件里顺序排列</el-radio>
                              <el-radio :label="false">筛选结果按提取清单顺序排列</el-radio>
                          </el-radio-group>
                       </el-form-item>
                    </el-form>
                    <el-form label-position="top">
                      <el-form-item label="要提取的名称清单：">
                          <el-input type="textarea" v-model="form.list" placeholder="输入一个数据，以,结尾后输入另一个数据，以此类推。"></el-input>
                      </el-form-item>
                    </el-form>
                    <el-form>
                      <!-- <el-form-item label="上传文件" >
                        <el-button v-if="!form.listPath.length" @click="selectListFile" type="primary" size="mini">点击上传文件</el-button>
                        <p @click="selectListFile" :title="form.listPath" class="selectPath" v-if="form.listPath.length">{{form.listPath}}</p>
                      </el-form-item> -->
                       <!-- <el-form-item label="任务完成后发邮件通知我">
                        <el-checkbox-group v-model="form.email">
                          <el-checkbox></el-checkbox>
                        </el-checkbox-group>
                      </el-form-item> -->
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
              <div v-show="activeIndex==0" class="draw-area tab table-area">
                <!-- table area -->
                <div v-if="tableData.rows.length" class="title">{{form.projectName}}</div>
                <table v-if="tableData.rows.length">
                  <thead v-if="tableData.header.length">
                    <tr>
                      <th v-for="(th,index) in tableData.header" :key="index"><p>{{th}}</p></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(tr,index) in tableData.rows" :key="index">
                      <td v-for="(td,index) in tr" :key="index"><p>{{td}}</p></td>
                    </tr>
                  </tbody>
                </table>
                <!-- tips -->
                <div class="tips" v-if="!tableData.rows.length">暂无数据</div>
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
import $ from "jquery";
export default {
  data() {
    return {
      form: {
        projectName: "表格筛选",
        filePath: "",
        // 有无表头
        hasHeader: true,
        //　筛选列
        columnNum: 1,
        // 是否模糊查询
        isFuzzySearch: false,
        // 忽略大小写
        ignoreCase: true,
        //  源文件排序  true  清单排序 false
        isSort: true,
        // 提取的名称清单  list
        list: ""
        // 上传清单文件路径
        // listPath: "",
        // email: false,
      },
      tabList: ["预览", "说明", "例子"],
      activeIndex: 0,
      tableData: { header: [], rows: [] }
    };
  },
  created() {},
  computed: {
    ...mapGetters(["toolType"]),
    // 提取名称清单
    listArr: function() {
      return this.form.list.length ? this.form.list.split(",") : [];
    }
  },
  methods: {
    sub() {
      this.$refs.project.validate(valid => {
        if (valid) {
          if (!this.form.filePath) {
            this.$message("请上传数据文件");
            return;
          } else if (!this.form.isSort && this.form.list.length === 0) {
            this.$message("请输入要提取的名称清单");
          } else {
            let formData = {};
            formData.filePath = this.form.filePath;
            formData.hasHeader = this.form.hasHeader;
            formData.columnNum = this.form.columnNum;
            formData.isFuzzySearch = this.form.isFuzzySearch;
            formData.ignoreCase = this.form.ignoreCase;
            formData.isSort = this.form.isSort;
            formData.nameList = this.listArr;
            fetchData("filterData", formData).then(res => {
              if (res.Error) {
                this.$message(res.Error);
              } else {
                this.tableData = res;
              }
            });
          }
        }
      });
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
  watch: {
    "form.sort": function(val, oldval) {
      val === "file" ? (this.isSort = true) : (this.isSort = false);
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

<style lang="scss" scoped>
.tips {
  text-align: center;
  margin: 40px;
}
.title {
  text-align: center;
  line-height: 60px;
}
.table-area{
  overflow-y: auto;
}
table {
  width: 100%;
  font-size: 11px;
  color: #333333;
  border-collapse: collapse;
  th,
  td {
    -webkit-user-select: text;
    user-select: text;
    padding: 8px;
    border: 1px solid #ccc;
    background-color: #ffffff;
    p{
      max-width: 200px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>
