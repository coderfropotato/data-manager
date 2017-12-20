<template>
 <div class="editable-wrap" @keyup.enter.prevent.stop="enter" @mouseout="blur" @dblclick="db" :contenteditable="edit" v-html="innerText" @input="changeText"></div>
</template>
<script>
export default {
  data() {
    return {
      edit: false,
      innerText: this.value
    };
  },
  methods: {
    blur() {
      this.edit = false;
    },
    db() {
      this.edit = true;
      this.$el.focus();
    },
    enter() {
      this.edit = false;
    },
    changeText() {
      this.innerText = this.$el.innerHTML;
      this.$emit("input", this.innerText);
    }
  },
  props: ["value"]
};
</script>
<style lang="scss" scoped>
.editable-wrap {
  width: 100%;
  outline: none;
  user-select: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
