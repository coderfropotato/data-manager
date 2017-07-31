<template>
  <div id="tree-root">
    <li>
      <div
          class="item"
          :class="{bold: isFolder}"
          @click="toggle"
          @dblclick="changeType">
        <svg class="icon" aria-hidden="true" v-show="isFolder">
          <!--收起状态-->
          <use xlink:href="#icon-xiala-up" v-if="!open"></use>
          <!--展开状态-->
          <use xlink:href="#icon-xiala" v-if="open"></use>
        </svg>
        <span>{{model.name}}</span>
      </div>
      <ul v-show="open" v-if="isFolder">
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
      isFolder: function () {
        return this.model.children &&
          this.model.children.length
      }
    },
    methods: {
      toggle: function () {
        if (this.isFolder) {
          this.open = !this.open
        }
      },
      changeType: function () {
        if (!this.isFolder) {
          Vue.set(this.model, 'children', [])
          this.addChild()
          this.open = true
        }
      },
      addChild: function () {
        this.model.children.push({
          name: 'new stuff'
        })
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
