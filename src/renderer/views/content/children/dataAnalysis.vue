<template>
    <div id="dataAnalysis">
        <!--header-->
        <div class="header">
            <div class="tip-icon">
                <img src="../../../assets/images/u5.png" alt="u5">
            </div>
            <div class="headerRight">
                <div class="bell">
                    <img src="../../../assets/images/bell.png" alt="u12">
                </div>
                <div class="computedServer">
                    <p class="server">153计算服务器</p>
                </div>
                <div class="setIcon">
                    <img src="../../../assets/images/u64.png" alt="u64">
                </div>
            </div>
        </div>

        <hr>

        <div class="desc">
            <span>数据分析</span>
            <span>／</span>
            <span>任务管理</span>
        </div>

        <!--tasking status-->
        <div class="container">
            <div class="taskDesc">
                <p>
                    <span class="taskTitle">已完成任务数</span>
                    <br>
                    <span>24</span>
                    <span>个任务</span>
                </p>
                <p>
                    <span class="taskTitle">计算中任务数</span>
                    <br>
                    <span>8</span>
                    <span>个任务</span>
                </p>
            </div>
            <div class="taskList">
                <div class="listLeft">
                    <p class="listLeftl">任务列表</p>
                    <div class="listLeftl">
                        <el-select v-model="value" placeholder="全部" style="width:120px;">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="listRight">
                    <img class="searchIcon" src="../../../assets/images/search.png" alt="search" @click="getProcesName">
                    <el-input v-model="input" placeholder="请输入内容" style="width:160px;"></el-input>
                </div>
            </div>

            <!--new create task-->
            <p class="addProcess" @click="jumpNewTask">
                <span> + </span>
                <span>新建任务</span>
            </p>
            <!--已经创建的任务列表-->
            <div class="createdList">
                <ul>
                    <li v-for="item in taskList">
                    <!--<li>-->
                        <div class="singleProcess">
                            <div class="singleDesc">
                                <p class="imgTitle" style="text-align:left;">
                                    <img src="../../../assets/images/smalltitle.png" alt="smalltitle">
                                </p>
                                <div class="sinTaskDesc">
                                    <p class="titleDesc" style="text-align:left;">{{item.title}}</p>
                                    <p class="processDesc">{{item.processDesc}}</p>
                                </div>
                            </div>
                            <div class="startTime">
                                <p class="titleDesc">开始时间</p>
                                <p>{{item.startTime}}</p>
                            </div>
                            <div class="endTime">
                                <p class="titleDesc">完成时间</p>
                                <p>{{item.endTime}}</p>
                            </div>
                            <div class="process">
                                <div>{{item.status}}</div>
                            </div>
                            <div class="status">
                                <!--<span v-if="item.start">开始</span>-->
                                <!--<span v-if="item.viewReport">查看报告</span>-->
                                <!--<span v-if="item.viewTask">查看任务</span>-->
                                <!--<span v-if="item.delete">删除</span>-->
                                <el-button type="primary" v-if="item.start">开始</el-button>
                                <el-button type="success" v-if="item.viewReport">查看报告</el-button>
                                <el-button type="info" v-if="item.viewTask">查看任务</el-button>
                                <el-button type="danger" v-if="item.delete">删除</el-button>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="pagination">
                    <el-pagination
                            class="pull-right"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="pagination.currentPage4"
                            :page-sizes="[5, 10, 15, 20]"
                            :page-size="10"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="100">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
export default {
  name: "data-analysis",
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "已完成"
        },
        {
          value: "选项2",
          label: "未开始"
        },
        {
          value: "选项3",
          label: "执行中"
        },
        {
          value: "选项4",
          label: "未完成"
        }
      ],
      value: "",
      input: "",
      taskList: [
        {
          title: "mRNA1",
          processDesc: "那是一种内在的东西， 他们到达不了，也无法触",
          startTime: "2016-06-17 8:20",
          endTime: "2016-06-18 12:30",
          status: "已完成",
          start: true,
          viewReport: true,
          viewTask: true,
          delete: true
        },
        {
          title: "mRNA1",
          processDesc: "那是一种内在的东西， 他们到达不了，也无法触",
          startTime: "2016-06-17 8:20",
          endTime: "2016-06-18 12:30",
          status: "已完成",
          start: true,
          viewReport: true,
          viewTask: true,
          delete: false
        },
        {
          title: "mRNA1",
          processDesc: "那是一种内在的东西， 他们到达不了，也无法触",
          startTime: "2016-06-17 8:20",
          endTime: "2016-06-18 12:30",
          status: "已完成",
          start: true,
          viewReport: false,
          viewTask: true,
          delete: true
        },
        {
          title: "mRNA1",
          processDesc: "那是一种内在的东西， 他们到达不了，也无法触",
          startTime: "2016-06-17 8:20",
          endTime: "2016-06-18 12:30",
          status: "已完成",
          start: true,
          viewReport: true,
          viewTask: false,
          delete: true
        }
      ],
      // pagination
      pagination: {
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 2
      }
    };
  },
  methods: {
    getProcesName: function() {
      alert(this.input);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      alert(`sizeChange  每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      alert(`currentChange  当前页: ${val}`);
    },
    jumpNewTask() {
      alert(8790);
      this.$router.replace("/newTask");
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
#dataAnalysis {
  .header {
    overflow: hidden;
    .tip-icon {
      margin: 20px 20px 20px 40px;
      float: left;
      img {
        width: 25px;
        height: 20px;
      }
    }
    .headerRight {
      margin: 20px 20px 20px 40px;
      float: right;
      overflow: hidden;
      div {
        float: left;
        margin-right: 7px;
      }
      img {
        width: 25px;
        height: 20px;
      }
      .setIcon img {
        width: 20px;
        height: 20px;
      }
      .computedServer img {
        width: 20px;
        height: 26px;
      }
    }
  }

  .desc {
    margin: 15px 0px 15px 40px;
  }

  .addProcess {
    margin: 0 20px;
    padding: 6px;
    border: 1px dashed #868686;
    text-align: center;
    cursor: pointer;
  }
  .container {
    background: #f0f2f5;
    padding-top: 20px;
    margin: 0 auto;
    text-align: center;
    .taskDesc {
      background: #fff;
      /*margin-left:19px;*/
      margin: 0 20px;
      overflow: hidden;
      p {
        span {
          font-size: 28px;
          color: #000000;
        }
        width: 50%;
        height: 84px;
        line-height: 36px;
        text-align: center;
        float: right;
        .taskTitle {
          font-size: 16px;
        }
      }
    }

    .taskList {
      text-align: center;
      overflow: hidden;
      margin: 0 20px;
      height: 60px;
      line-height: 60px;
      .listLeft {
        float: left;
        width: 47%;
        .listLeftl {
          float: left;
          margin-right: 10px;
        }
      }
      .listRight {
        text-align: right;
        width: 47%;
        float: right;
        position: relative;
        margin-right: 0px;
        .searchIcon {
          position: relative;
          left: 150px;
          z-index: 100;
          cursor: pointer;
        }
      }
    }
    .createdList {
      .singleProcess {
        margin: 0 20px;
        overflow: hidden;
        .titleDesc {
          text-align: center;
          margin-bottom: 6px;
          font-weight: bold;
        }
        & > div {
          float: left;
          margin: 0 auto;
          height: 60px;
          text-align: center;
          vertical-align: middle;
        }
        .imgTitle img {
          width: 16px;
          height: 16px;
        }
        .singleDesc {
          width: 30%;
          overflow: hidden;
          height: 60px;
          vertical-align: middle;
          position: relative;
          .processDesc {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          & > p,
          & > div {
            width: 80%;
            float: left;
          }
          & > p {
            width: 10%;
            position: relative;
            top: 19px;
            margin-right: 10px;
          }
        }
      }
      .startTime,
      .endTime {
        width: 15%;
        p {
          text-align: center;
        }
      }
      .process {
        div {
          margin-top: 16px;
          text-align: center;
        }
        width: 10%;
      }

      .status {
        width: 30%;
        overflow: hidden;
        button {
          float: left;
          margin-top: 13px;
          padding: 5px 5px;
          border: 1px solid #d9d9d9;
        }
      }
      .pagination {
        /*overflow:hidden;*/
        /*.el-pagination__total,.el-pagination__sizes{*/
        /*float:left!important;*/
        /*}*/
      }
    }
  }
}
</style>