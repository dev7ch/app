<template>
  <form
    v-if="node"
    class="iframe__input"
    @paste.stop
    @click.stop
    @keydown.delete.stop
    @keyup.13="submitAll()"
  >
    <v-input
      v-model="node.src"
      type="text"
      icon-left="link"
      placeholder="https:// ..."
      icon-left-tooltip="Paste source url here"
      @input="updateTarget(true)"
    />
    <v-input
      v-if="checkUrl(node.src)"
      v-model="node.style"
      type="text"
      placeholder="width: 100%; height: 480px;"
      icon-left="format_paint"
      icon-left-tooltip="Add inline CSS styles here"
      @input="updateTarget"
    />
    <v-input
      v-if="checkUrl(node.src)"
      v-model="node.className"
      type="text"
      placeholder="custom-css-class-1 custom-css-class-2"
      icon-left="class"
      icon-left-tooltip="You can edit classes in the Raw View Mode"
      @input="updateTarget"
    />
  </form>
</template>
<script>
export default {
  props: ["node", "view", "updateAttrs", "updateValue"],
  computed: {
    update() {
      return this.$props.updateValue();
    }
  },
  methods: {
    checkUrl(val) {
      if (val.startsWith("http") || val.startsWith("www") || val.startsWith("//")) {
        return true;
      }
    },
    updateTarget(isSrc = false) {
      if (isSrc) {
        this.$parent.selectionPosition.target.src = this.node.src;
      }
      this.node.target.style = this.node.style;
      this.node.target.className = this.node.className;
    },
    submitAll() {
      return this.update;
    }
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
