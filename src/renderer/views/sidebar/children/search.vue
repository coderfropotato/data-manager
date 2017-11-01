<template>
  <div id="search-root">
     <ol>
        <li>
            <div><span>所有设备</span><i class="el-icon-plus"></i></div>
            <ul>
              <li>我的电脑</li>
              <li>我的硬盘</li>
              <li>更多设备</li>
            </ul>
        </li>
      </ol>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
    };
  },
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
#search-root{
  padding:12px 20px;
}
ol {
  list-style: none;
  & > li {
    &:first-child {
      margin-bottom: 24px;
    }
    div {
      display: flex;
      justify-content: space-between;
      span {
      }
      i {
        font-size: 14px;
        line-height: 1.5;
        cursor: pointer;
      }
    }
    ul {
      padding-left: 22px;
      margin: 8px 0;
      list-style: none;
      li {
        font-size: 14px;
        line-height: 28px;
        cursor: pointer;
        &:hover{
          color: #386cca;
        }
        &:last-child {
          font-size: 12px;
          color: #386cca;
          text-align: right;
        }
      }
    }
  }
}
</style>
