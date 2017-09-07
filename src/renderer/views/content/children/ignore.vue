<template>
  <div id="diskDirectory-root">
    <div class="grid-display">
      <div class="grid-items">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(item,index) in displayData" :key="index">
            <div class="grid-item">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-file"></use>
              </svg>
              <div class="file-name">
                <el-tooltip :content="item" placement="top" :open-delay="2000">
                  <span>{{item | formatName(10)}}</span>
                </el-tooltip>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import bus from '@/utils/bus'
  export default {
    name: 'DiskDirectory',
    data () {
      return {
      }
    },
    computed: mapGetters({
      displayData: 'ignore'
    }),
    watch: {
      displayData () {
        bus.$emit('loading-end')
      }
    },
    filters: {
      formatName (name, maxLength) {
        if (name !== undefined) {
          return name.length > maxLength ? name.substr(0, maxLength - 1) + '...' : name
        }
      }
    }
  }
</script>
<style lang="scss">
  #diskDirectory-root {
    height: 100%;
    .grid-display {
      position: relative;
      height: 90%;
      -webkit-overflow-y: overlay;
      overflow-x: hidden;
      // 隐藏滚动条
      &::-webkit-scrollbar {
        display: none;
      }

      .grid-item {
        text-align: center;
        margin: 1em;
        .icon {
          font-size: 3em;
        }
        .file-name {
          font-size: 0.8em;
          margin: 1em;
        }
      }
    }
  }
</style>
