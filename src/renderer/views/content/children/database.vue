<template>  
    <div class="data-base">
      <!-- title -->
        <p class="title">数据库</p>
        <!-- search -->
        <div class="data-search-wrap">
          <!-- <p class="data-search-title">数据库搜索</p> -->
          <div class="data-search">
            <div class="data-left">
              <ul>
                <li @click="chooseMethods(key,val)" v-for="(val,key) in searchMethods" :key="key" :class="{'active':curMethod===val}">{{val}}</li>
              </ul>
            </div>
            <div class="data-right">
                <h4>{{curMethod}}</h4>
                <div v-show="searchType!=3" class="id-func methods">
                  <div class="data-search-input">
                      <input type="text" v-model.trim="searchVal" placeholder="请输入您要查找的关键字">
                      <div @click="loadPage('all')" class="search-btn">
                        <i class="el-icon-search"></i>
                        搜索
                      </div>
                  </div>
                </div>
                <div v-show="searchType==3" class="reg-method">
                    <select v-model="chr">
                      <option v-for="(item, index) in chrRange" :key="index">{{'Chr'+item}}</option>
                    </select>
                    <div style="overflow:hidden;">
                      <input v-model.trim="regOne"  type="number" placeholder="输入您要查找的数值" />
                      <span></span>
                      <input v-model.trim="regTwo"  type="number" placeholder="输入您要查找的数值" />
                      <a @click="loadPage('reg')"  href="javascript:;"><i class="el-icon-search"></i>搜索</a>
                    </div>
                </div>
                  <P v-show="searchType==1">示例：
                    <a @click="loadPage('geneId')" href="javascript:;">Glyma.01G004900</a>
                    ;<a @click="loadPage('geneId')" href="javascript:;">ATMYB68</a>,
                    <a @click="loadPage('geneId')"  href="javascript:;">MYB68</a>
                    </P>
                  <P v-show="searchType==2">示例：
                    <a @click="loadPage('geneId')" href="javascript:;">myb domain protein 68</a>
                    </P>
                  <P v-show="searchType==3">示例：
                    <a @click="loadPage('geneId')" href="javascript:;">Chr01,457480bp-459034bp</a>
                    </P>
            </div>
          </div>
        </div>
        <!-- data-base-list -->
        <div class="data-base-list">
          <ol>
            <li>
              <div>
                <p class="data-base-title"><i class="my-icon qtl"></i><span @click="loadPage('qtl')">QTL数据库</span></p>
                <p>简介：数量性状基因座数据库，通过公司自主研发的QTL数据提取流程，将每个物种的QTL数据从文献中提取出来，再对QTL数据进行整理，将同一染色体区域的QTL通过标记位置信息进行集中。创建了物理图谱与遗传图谱对应的可视化工具，协助研究人员获取
                    控制数量性状的QTL在基因组中的位置，寻找合适的候选基因。</p>
              </div>
            </li>
            <li>
              <div>
                <p class="data-base-title"><i class="my-icon rna"></i><span @click="loadPage('rna')">RNA表达数据库</span></p>
                <p>简介：RNA表达数据库是通过对NCBI上现有的公共数据进行整理、分析，从而构建出一套包含基因名称、基因表达量等信息的基因表达数据库。RNA表达数据库可以在复现实验分析结果的同时为研究人员提供参考，并结合可视化技术全面展示基因的表达情况与
                    关联基因信息。</p>
              </div>
            </li>
            <li>
              <div>
                <p class="data-base-title"><i class="my-icon snp"></i><span @click="loadPage('snp')">SNP/INDEL数据库</span></p>
                <p>SNP/INDEL数据库提供了大豆相关的21,657,613条SNPs及2,329,103条InDels变异信息。这些变异信息由收集NCBI公共网站上近1000个大豆重测序数据，与Glycine max Wm82.a2.v1基因组进行比对后获得。该数据库收录了丰富的样本变异信息，用户可以根
                    据属性自定义组合群体，查询SNP、INDEL变异在不同群体中的出现频率。同时，亦可以根据基因及感兴趣位点对特定区域上的变异位点进行查看。通过该变异数据库，快速、直观地了解群体中变异发生比例，辅助群体遗传变异研究。</p>
              </div>
            </li>
          </ol>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "database-window",
  data() {
    return {
      curMethod: "Search By Gene ID/Name",
      searchMethods: [
        "Search By Gene ID/Name",
        "Search By Gene Function",
        "Search By Region"
      ],
      chrRange: [],
      searchVal: "",
      searchType: 1,
      chr: "Chr01",
      regOne: "",
      regTwo: "",
      url: "",
      isMessage: false
    };
  },
  mounted() {
    for (var i = 1; i < 21; i++) {
      i < 10 ? (i = "0" + i) : (i = i);
      this.chrRange.push(i);
    }
  },
  activated() {
    this.$store.dispatch("removeRightView", true);
  },
  deactivated() {
    this.$store.dispatch("removeRightView", false);
  },
  methods: {
    //选择搜索方式
    chooseMethods(index, val) {
      this.searchType = index + 1;
      this.curMethod = val;
      this.searchVal = "";
    },
    loadPage(type, anchorClick) {
      this.checkUrl(type, anchorClick);
      if (type === "all") {
        if (!this.searchVal.length || this.searchVal.length > 50) {
          if (!this.isMessage) {
            this.isMessage = true;
            this.$message({
              message: "请输入搜索关键字",
              duration: 1200,
              onClose: _ => {
                this.isMessage = false;
              }
            });
          }
          return;
        }
      } else if (type === "reg") {
        if (this.regOne === "" || this.regTwo === "") {
          if (!this.isMessage) {
            this.isMessage = true;
            this.$message({
              message: "请输入搜索关键字",
              duration: 1200,
              onClose: _ => {
                this.isMessage = false;
              }
            });
          }
          return;
        }
      }
      let _this = this;
      if (!_this.isShow) {
        let reportWin = null;
        const BrowserWindow = this.$electron.remote.BrowserWindow;
        reportWin = new BrowserWindow({
          width: 1300,
          height: 800,
          show: false,
          resizable: false,
          webPreferences: {
            nodeIntegration: false
          }
        });
        const content = reportWin.webContents;
        reportWin.setMenu(null);
        reportWin.loadURL(_this.url);
        reportWin.on("ready-to-show", () => {
          reportWin.show();
          _this.isShow = true;
        });
        content.on("did-get-response-details", () => {
          content.executeJavaScript(
            `
            if(document){
              try{
                document.querySelector("header").style.display="none";
                document.querySelector("footer").style.display="none";
              }catch(e){}
            }
          `
          );
        });
        content.on("dom-ready", () => {
          content.executeJavaScript(
            `
              var Pre = document.createElement('div');
              var Next = document.createElement('div');
              Pre.style.position="fixed";
              Next.style.position="fixed";
              Pre.style.className="pre";
              Next.style.className="next";
              Pre.style.left="40px";
              Next.style.left="100px";
              Pre.style.top="20px";
              Next.style.top="20px";
              Pre.style.width="40px";
              Next.style.width="40px";
              Pre.style.height = "40px";
              Next.style.height = "40px";
              Pre.style.borderRadius = "8px";
              Next.style.borderRadius = "8px";
              Pre.innerHTML='←';
              Next.innerHTML='→';
              Pre.style.backgroundColor="rgba(0,0,0,0.5)";
              Next.style.backgroundColor="rgba(0,0,0,0.5)";
              Pre.style.textAlign="center";
              Next.style.textAlign="center";
              Pre.style.lineHeight="40px";
              Next.style.lineHeight="40px";
              Pre.style.fontSize="30px";
              Next.style.fontSize="30px";
              Pre.style.color="#fff";
              Next.style.color="#fff";
              Pre.style.opacity=0.5;
              Next.style.opacity=0.5;
              Pre.style.cursor="pointer";
              Next.style.cursor="pointer";
              Pre.style.zIndex="1000000";
              Next.style.zIndex="1000000";
              Pre.addEventListener('click',function(){history.back()},false);
              Next.addEventListener('click',function(){history.forward()},false);
              Pre.addEventListener('mouseover',function(){this.style.opacity=1},false);
              Pre.addEventListener('mouseout',function(){this.style.opacity=0.5},false);
              Next.addEventListener('mouseover',function(){this.style.opacity=1},false);
              Next.addEventListener('mouseout',function(){this.style.opacity=0.5},false);
              document.body.appendChild(Pre);
              document.body.appendChild(Next);
              $.ajax({
                url: "/j_spring_security_check",
                type: "POST",
                data: {
                  username: "h5",
                  password: "222"
                }
              })
            `
          );
        });
        reportWin.on("closed", () => {
          reportWin = null;
          _this.isShow = false;
        });
      } else {
        _this.$message("有未关闭的新窗口，请先关闭，再试一次");
      }
    },
    checkUrl(type) {
      switch (type) {
        case "all":
          this.url =
            "http://118.31.244.95:91/iqgs/search/list?keyword=" +
            this.searchVal +
            "&searchType=" +
            this.searchType;
          break;
        case "qtl":
          this.url = "http://118.31.244.95:91/search/index";
          break;
        case "rna":
          this.url = "http://118.31.244.95:91/mrna/index";
          break;
        case "snp":
          this.url = "http://118.31.244.95:91/dna/index";
          break;
        case "geneId":
          this.url =
            "http://118.31.244.95:91/iqgs/detail/basic?gen_id=Glyma.01G004900";
          break;
        case "reg":
          this.url =
            "http://118.31.244.95:91/iqgs/search/list?chr=" +
            this.chr +
            "&begin=" +
            this.regOne +
            "&end=" +
            this.regTwo +
            "&searchType=" +
            this.searchType;
          break;
      }
    }
  }
};

//TODO
/*
2.mock login  
login cookie JSESSIONID = E9BFE6D4FAEC9B690873EQB5B2CC0A6
*/
</script>
<style lang="scss" scoped>
$pl: 31px;
$blue: #386cca;
.data-base {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  padding-bottom: 40px;
  .title {
    font-size: 14px;
    box-sizing: border-box;
    padding: 0 30px;
    border-bottom: 1px solid #ccc;
    height: 60px;
    line-height: 60px;
    box-sizing: border-box;
  }
  .data-search-wrap {
    border-bottom: 1px solid #ccc;
    height: 300px;
    .data-search-title {
      font-size: 18px;
      color: #48576a;
      line-height: 18px;
      padding: 20px 0 40px $pl;
    }
    .data-search {
      width: 760px;
      margin: 0 auto;
      height: 180px;
      display: flex;
      padding-top: 40px;
      .data-left {
        width: 150px;
        margin-right: 46px;
        li {
          width: 100%;
          text-align: center;
          font-size: 12px;
          line-height: 50px;
          color: #fff;
          margin-bottom: 16px;
          position: relative;
          cursor: pointer;
          transition: 0.3s all ease;
          &:hover {
            opacity: 0.8;
          }
          &.active::before {
            position: absolute;
            border: 10px solid transparent;
            border-left-color: #f59f62;
            width: 0;
            height: 0;
            right: -18px;
            top: 50%;
            margin-top: -10px;
            content: "";
          }
          &:first-child {
            background: #f59f62;
            &.active::before {
              border-left-color: #f59f62;
            }
          }
          &:nth-child(2) {
            background: #6cdbd9;
            &.active::before {
              border-left-color: #6cdbd9;
            }
          }
          &:nth-child(3) {
            background: #b2b2b2;
            margin-bottom: 0;
            &.active::before {
              border-left-color: #b2b2b2;
            }
          }
        }
      }
      .data-right {
        h4 {
          margin: 16px 0;
        }
        p {
          font-size: 12px;
          line-height: 26px;
          color: #9e9f9f;
          a {
            color: $blue;
            font-weight: normal;
          }
        }
        .data-search-input {
          width: 560px;
          margin-top: 30px;
          position: relative;
          input {
            height: 46px;
            width: 100%;
            border-radius: 22px;
            border: 1px solid #ccc;
            padding-left: 20px;
            padding-right: 110px;
            outline: none;
          }
          .search-btn {
            position: absolute;
            width: 100px;
            height: 46px;
            font-size: 12px;
            line-height: 46px;
            color: #fff;
            text-align: center;
            top: 0;
            right: 0;
            border-radius: 0 22px 22px 0;
            background: #386cca;
            cursor: pointer;
            transition: 0.3s all ease;
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }
  }
  .data-base-list {
    padding: 0 $pl;
    padding-top: 56px;
    text-align: justify;
    ol {
      list-style: none;
      li {
        margin-bottom: 56px;
        &:last-child {
          margin-bottom: 0;
        }
        .data-base-title {
          margin-bottom: 22px;
          i {
            margin-right: 12px;
          }
          span {
            font-size: 16px;
            cursor: pointer;
            &:hover {
              color: $blue;
            }
          }
        }
        p {
          font-size: 14px;
          line-height: 20px;
          color: #48576a;
        }
      }
    }
  }
}
.reg-method {
  select {
    margin-bottom: 12px;
  }
  select,
  input {
    width: 180px;
    height: 40px;
    border: 1px solid #ccc;
    outline: none;
  }
  input {
    padding-left: 12px;
  }
  span {
    width: 30px;
    display: inline-block;
    height: 1px;
    background: #ccc;
    vertical-align: top;
    margin-top: 20px;
  }
  a {
    display: inline-block;
    width: 120px;
    height: 42px;
    font-size: 12px;
    line-height: 42px;
    text-align: center;
    color: #fff;
    background: $blue;
    border-radius: 20px;
    margin-left: 20px;
  }
}
.my-icon {
  display: inline-block;
  vertical-align: text-bottom;
  width: 20px;
  height: 20px;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  &.qtl {
    background-image: url("../../../assets/images/dna.png");
  }
  &.rna {
    background-image: url("../../../assets/images/qtl.png");
  }
  &.snp {
    background-image: url("../../../assets/images/rna.png");
  }
}
</style>


