<template>
  <div id="tree-root">
    <li>
      <div
          class="item"
          @dblclick="changeType">
        <!--点击下拉图标展开文件夹-->
        <svg class="icon" aria-hidden="true" v-show="hasChildFolder" @click="toggle">
          <!--收起状态-->
          <use xlink:href="#icon-xiala-up" v-if="!open"></use>
          <!--展开状态-->
          <use xlink:href="#icon-xiala" v-if="open"></use>
        </svg>
        <span @click="showChildFile">{{model.label}}</span>
      </div>
      <ul v-show="open" v-if="hasChildFolder">
        <Tree
            class="item"
            v-for="(model, index) in model.children"
            :key="index"
            :model="model">
        </Tree>
      </ul>
    </li>
  </div>
</template>
<script>
  import Vue from 'vue'

  export default {
    name: 'Tree',
    data () {
      return {
        open: false
      }
    },
    props: {
      model: Object
    },
    computed: {
      // 标记文件夹是否含有子文件夹
      hasChildFolder: function () {
        return this.model.children &&
          this.model.children.length
      }
    },
    methods: {
      // 切换展开与收起状态
      toggle: function () {
        if (this.hasChildFolder) {
          this.open = !this.open
        }
      },
      changeType: function () {
        if (!this.hasChildFolder) {
          Vue.set(this.model, 'children', [])
          this.addChild()
          this.open = true
        }
      },
      addChild: function () {
        this.model.children.push({
          name: 'new stuff'
        })
      },
      // 向后台发送请求，获取文件夹内的文件列表
      showChildFile (e) {
        // 获取文件夹的名字
        let folderName = e.target.innerText
        console.log('文本类型' + typeof folderName)
      }
    }
  }
</script>

<style lang="scss" scoped>
  #tree-root {
    width: 100%;
    font-size: 16px;
    margin: 0.5em;
    ul,
    li {
      list-style: none;
    }

  }
  .item {
    margin: 0.5em;
    cursor: pointer;
  }

  .bold {
    font-weight: 500;
  }

  ul {
    padding-left: 1em;
    line-height: 1.5em;
    list-style-type: dot;
  }
</style>
