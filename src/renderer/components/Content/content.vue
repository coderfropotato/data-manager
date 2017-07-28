<template>
  <div id="content-root">
    <FileHeader></FileHeader>
  </div>
</template>
<script>
  import '../../assets/JS/scrollbar'
  import FileHeader from './fileHeader'

  export default {
    name: 'Content',
    components: {
      FileHeader
    }
  }
</script>
<style lang="scss">
  #content-root {
    height: 100%;
    .header {
      height: 3em;
      line-height: 3em;
      background-color: #eef1f6;
      button {
        font-size: 16px;
        height: 1.8em;
        width: 3.6em;
        margin: 0.6em 1em;
        background-color: #eef1f6;
        border-radius: 0.2em;
        border: 1px solid #48576a;
        outline: 1px solid #eef1f6;
        cursor: pointer;
        .icon {
          font-size: 1.2em;
        }
      }
    }
  }
  .el-dropdown-menu {
    span {
      margin-left: 1em;
    }
  }
  #column {
    transform: rotate(90deg);
  }
</style>
