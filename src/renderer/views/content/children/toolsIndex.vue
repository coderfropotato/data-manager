<template>
    <div id="toolsIndex">
        <p class="title">工具</p>
        <ul>
            <li @click="toolDetail('heatmap')">
                <img src="../../../assets/images/heatmap.png" alt="">
                <div class="desc">
                    <p>热图</p>
                    <span>简介：将表格数据绘制成一个热图。</span>
                </div>
            </li>
            <!-- <li @click="toExcel">
                <img src="../../../assets/images/excelfilter.png" alt="">
                <div class="desc">
                    <p>表格筛选</p>
                    <span>简介：从源表格包含的所有属性中，筛选出所关注样本的信息。</span>
                </div>
            </li>
            <li @click="toVenn">
                <img src="../../../assets/images/pathway.png" alt="">
                <div class="desc">
                    <p>韦恩图</p>
                    <span>简介：应用超几何检验，找出与整个基因组背景相比，在差异表达基因中显著性富集的PathWay。</span>
                </div>
            </li> -->
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
    // toExcel(){
    //   this.$router.push('./toolsExcel')
    // },
    // toVenn(){
    //   // this.$message('开发中...')
    //   this.$router.push('./toolsVenn?type=venn')
    // }
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
  padding: 0 20px;
  .title {
    padding: 14px 0;
  }
  ul {
    list-style: none;
    li {
      padding: 12px 0;
      display: flex;
      cursor: pointer;
      align-items: center;
      border-bottom: 1px solid #ccc;
      img {
        width: 40px;
        height: 40px;
        margin-right: 14px;
      }
      .desc {
        flex: 1;
        p {
          line-height: 24px;
          &:hover {
            color: #386cca;
          }
        }
        span {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
