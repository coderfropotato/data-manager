<template>
    <div id="toolsDetail">
        <p>
          <span @click="toTools" style="cursor:pointer;">工具</span>
          <span> > 热力图</span>
        </p>
        <div id="tools_draw_context">
            <div class="options">
              <ul>
                <!-- 输入文件 -->
                <li>
                  <p class="title">输入文件</p>
                  <div class="context">
                    <el-form :inline="true" label-width="72px">
                      <!-- 项目名称 -->
                      <el-form-item label="项目名称" >
                        <el-input type="text" :maxlength="50" v-model="formData.projectName" size="small"></el-input>
                      </el-form-item>
                      <!-- 选择文件 -->
                      <el-form-item label="选择文件" >
                        <el-button v-if="!formData.filePath.length" @click="selectFile" type="primary" size="mini">点击选择文件</el-button>
                        <p class="selectPath" v-if="formData.filePath.length">{{formData.filePath}}</p>
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
                        <el-input type="text" :maxlength="50" size="small"  v-model.trim="formData.columns" placeholder="如2,3,6,9"></el-input>
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
                          <el-form :inline="true">
                            <!-- 选择基因列表文件 -->
                            <el-form-item label="选择文件" >
                              <el-button v-if="!formData.fileOptionPath.length" @click="selectFileOption" type="primary" size="mini">点击选择文件</el-button>
                              <p class="selectPath" v-if="formData.fileOptionPath.length">{{formData.fileOptionPath}}</p>
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
                        <el-select size="small" v-model="formData.rowNormal">
                          <el-option label="yes" value="true"></el-option>
                          <el-option label="no" value=""></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="列聚类">
                        <!-- 列聚类 -->
                        <el-select size="small" v-model="formData.columnNormal">
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
                        <el-input :maxlength="50" size="small" type="number"  v-model="drawOptions.fontSize" placeholder="请输入字体大小"></el-input>
                      </el-form-item>
                      <el-form-item label="格子的长度*高度">
                        <el-input :maxlength="50" size="small" type="text" v-model="drawOptions.cubeSize" placeholder="如20*12"></el-input>
                      </el-form-item>
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
                      <el-form-item label="任务完成后发邮件通知我">
                        <el-checkbox-group v-model="formData.email">
                          <el-checkbox></el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                      <br>
                      <el-form-item>
                        <el-button type="primary" @click="sub">提交</el-button>
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
        rowNormal: "",
        //列聚类
        columnNormal: "",
        //邮件通知
        email: false
      },
      drawOptions: {
        colors: ["#ff0000", "#92d050", "#000000"],
        fontSize: 16,
        cubeSize: "",
        drawBorder: "yes",
        showRowName: "true",
      },
      activeName: "text",
      tabList:['预览','说明','例子'],
      activeIndex:0
    };
  },
  created() {},
  computed: {
    ...mapGetters(["toolType"])
  },
  methods: {
    sub() {
      var json = {
        zxtData: {
          name: "TN6",
          children: [
            {
              name: "ath-miR5643a"
            },
            {
              name: "TN5",
              children: [
                {
                  name: "TN3",
                  children: [
                    {
                      name: "ath-miR162a-3p"
                    },
                    {
                      name: "TN1",
                      children: [
                        {
                          name: "ath-miR399c-5p"
                        },
                        {
                          name: "ath-miR408-3p"
                        }
                      ]
                    }
                  ]
                },
                {
                  name: "TN4",
                  children: [
                    {
                      name: "ath-miR319a"
                    },
                    {
                      name: "TN2",
                      children: [
                        {
                          name: "ath-miR399f"
                        },
                        {
                          name: "ath-miR396b-5p"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        Max: 1,
        Min: -1,
        heatmap: [
          {
            sampleName: "e5-3",
            geneList: [
              {
                geneID: "ath-miR5643a",
                value: -0.3268156806279887
              },
              {
                geneID: "ath-miR162a-3p",
                value: 0.4087987305375783
              },
              {
                geneID: "ath-miR399c-5p",
                value: 0.6989775909499162
              },
              {
                geneID: "ath-miR408-3p",
                value: 0.5560398159829242
              },
              {
                geneID: "ath-miR319a",
                value: -0.017543456914489084
              },
              {
                geneID: "ath-miR399f",
                value: 0.09509506490533441
              },
              {
                geneID: "ath-miR396b-5p",
                value: 0.09445452073808591
              }
            ]
          },
          {
            sampleName: "e5-4",
            geneList: [
              {
                geneID: "ath-miR5643a",
                value: -0.3268156806279887
              },
              {
                geneID: "ath-miR162a-3p",
                value: 0.43706989532498874
              },
              {
                geneID: "ath-miR399c-5p",
                value: 0.71419091732121
              },
              {
                geneID: "ath-miR408-3p",
                value: 0.5663692235336549
              },
              {
                geneID: "ath-miR319a",
                value: -0.015356130235247374
              },
              {
                geneID: "ath-miR399f",
                value: 0.07396082282276462
              },
              {
                geneID: "ath-miR396b-5p",
                value: 0.08286032417909267
              }
            ]
          },
          {
            sampleName: "Col-0-1",
            geneList: [
              {
                geneID: "ath-miR5643a",
                value: 0.36258138488824243
              },
              {
                geneID: "ath-miR162a-3p",
                value: -0.4229343129312836
              },
              {
                geneID: "ath-miR399c-5p",
                value: -0.7065842541355629
              },
              {
                geneID: "ath-miR408-3p",
                value: -0.5612045197582896
              },
              {
                geneID: "ath-miR319a",
                value: 0.015237218154275077
              },
              {
                geneID: "ath-miR399f",
                value: -0.08452794386404949
              },
              {
                geneID: "ath-miR396b-5p",
                value: -0.08865742245858929
              }
            ]
          },
          {
            sampleName: "Col-0-2",
            geneList: [
              {
                geneID: "ath-miR5643a",
                value: 0.291049976367735
              },
              {
                geneID: "ath-miR162a-3p",
                value: -0.4229343129312836
              },
              {
                geneID: "ath-miR399c-5p",
                value: -0.7065842541355629
              },
              {
                geneID: "ath-miR408-3p",
                value: -0.5612045197582896
              },
              {
                geneID: "ath-miR319a",
                value: 0.017662368995461298
              },
              {
                geneID: "ath-miR399f",
                value: -0.08452794386404949
              },
              {
                geneID: "ath-miR396b-5p",
                value: -0.08865742245858929
              }
            ]
          }
        ]
      };
      this.tools.setWrap("#svg_cyjjfx_clusterpic");
      this.tools.setType(this.$route.query.type);
      this.tools.draw(json, this.drawOptions);
    },
    toTools() {
      this.$router.push("./toolsIndex");
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    tab(index){
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
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    }
  },
  watch: {
    filePath: function() {
      console.log(1);
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
#toolsDetail {
  display: flex;
  flex-direction: column;
  height: 100%;
  .selectPath {
    cursor: pointer;
    line-height: 1;
    word-break: break-word;
    &:hover {
      color: #386cca;
    }
  }
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
      max-width: 380px;
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
            & > p {
              font-size: 13px;
            }
          }
        }
      }
    }
    .draw-content {
      flex: 1;
      margin-left: 20px;
      border: 2px solid #ccc;
      overflow-x: auto;
      overflow-y: hidden;
      ul {
        list-style: none;
        &:after {
          content: "";
          display: block;
          clear: both;
        }
        li {
          float: left;
          width: 74px;
          height: 24px;
          text-align: center;
          line-height: 24px;
          background: #386cca;
          color: #fff;
          opacity: 0.5;
          margin-right: 6px;
          cursor: pointer;
          &.active {
            opacity: 1;
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .tab {
        padding: 40px;
        height: calc(100% - 24px);
        background: #fff;
      }
    }
  }
}
</style>
