<template>
  <form v-if="node" key="input" class="iframe__input" @paste.stop @click.stop @keydown.delete.stop>
    <v-input
      v-model="node.src"
      type="text"
      icon-left="link"
      placeholder="https:// ..."
      icon-left-tooltip="Paste source url here"
      @input="updateTarget"
    />
    <v-input
      v-if="checkUrl(node.src)"
      v-model.lazy="node.style"
      type="text"
      icon-left="format_paint"
      icon-left-tooltip="Add inline CSS styles here"
      @input="updateTarget"
    />
    <v-input
      v-if="checkUrl(node.src)"
      v-model.lazy="node.className"
      type="text"
      icon-left="class"
      icon-left-tooltip="You can edit classes in the Raw View Mode"
      @input="updateTarget"
    />
  </form>
</template>
<script>
export default {
  props: ["node", "view", "updateAttrs"],

  mounted() {
    console.log(this.node);
  },

  methods: {
    checkUrl(val) {
      if (val.startsWith("http") || val.startsWith("www") || val.startsWith("//")) {
        return true;
      }
    },
    updateTarget() {
      this.$parent.selectionPosition.target.src = this.node.src;
      this.$parent.selectionPosition.target.style = this.node.style;
      this.$parent.selectionPosition.target.className = this.node.className;
    }
  },

  submitAll() {
    return this.$parent.updateValue(this.$parent.editor.view.dom.innerHTML);
  }
};
</script>
<style lang="scss" scoped>
.iframe__edit {
  position: absolute;
  width: 100%;
  left: 0;
  text-align: center;
  max-width: 100%;
  bottom: 0;
  height: 30px;
  line-height: 30px;
  color: var(--dark-gray);
  background: var(--lightest-gray);
  cursor: pointer;
}

.iframe__input {
  z-index: 99;
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .v-input {
    max-width: 100%;
    width: 92%;
    display: block;
    margin: 5px auto;
  }
}
</style>
