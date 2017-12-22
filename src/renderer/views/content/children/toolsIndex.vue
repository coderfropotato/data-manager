<template>
    <div id="toolsIndex">
        <p class="title">工具</p>
        <ul>
            <li @click="toolDetail('heatmap')">
                <div>
                  <img src="../../../assets/images/heatmap.png" alt="">
                  <div class="desc">
                      <p>热图</p>
                      <p>简介：将表格数据绘制成一个热图。</p>
                  </div>
                </div>
            </li>
            <li @click="toExcel">
                <div>
                  <img src="../../../assets/images/excelfilter.png" alt="">
                  <div class="desc">
                      <p>表格筛选</p>
                      <span>简介：从源表格包含的所有属性中，筛选出所关注样本的信息。</span>
                  </div>
                </div>
            </li>
            <li @click="toVenn">
               <div>
                  <img src="../../../assets/images/pathway.png" alt="">
                  <div class="desc">
                      <p>韦恩图</p>
                      <p>简介：应用超几何检验，找出与整个基因组背景相比，在差异表达基因中显著性富集的PathWay。</p>
                  </div>
               </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    toolDetail(type) {
      this.$store.dispatch("setToolType", type).then(_ => {
        this.$router.push(`./toolsDetail?type=${type}`);
      });
    },
    toExcel() {
      this.$router.push("./toolsExcel");
    },
    toVenn() {
      this.$router.push("./toolsVenn?type=venn");
    }
  },
  created() {},
  activated() {
    this.$store.dispatch("removeRightView", true);
  },
  deactivated() {
    this.$store.dispatch("removeRightView", false);
  }
};
</script>

<style lang="scss" scoped>
#toolsIndex {
  .title {
    padding: 0 30px;
    border-bottom: 1px solid #ccc;
    height: 60px;
    line-height: 60px;
    box-sizing: border-box;
  }
  ul {
    list-style: none;
    li {
      padding: 0 30px;
      transition: 0.3s all ease;
      &:hover {
        background: #ebf0f9;
      }
      & > div {
        padding: 16px 0;
        display: flex;
        cursor: pointer;
        align-items: center;
        border-bottom: 1px solid #ccc;
        img {
          width: 50px;
          height: 50px;
          margin-right: 14px;
        }
        .desc {
          flex: 1;
          p {
            line-height: 24px;
            display: inline;
            font-size: 16px;
            line-height: 18px;
            &:hover {
              color: #386cca;
            }
            &:first-child {
              display: block;
              margin-bottom: 12px;
            }
            &:last-child {
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
