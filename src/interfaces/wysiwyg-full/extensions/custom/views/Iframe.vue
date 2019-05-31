<template>
  <div class="iframe__wrapper" @click="toggleEdit = !toggleEdit">
    <template>
      <iframe :class="className" :style="style" :src="src"></iframe>
    </template>
    <form v-if="toggleEdit" class="iframe__input" @paste.stop @click.stop @keydown.delete.stop>
      <v-input
        v-model="src"
        type="text"
        icon-left="link"
        icon-left-tooltip="Paste source url here"
      />
      <v-input
        v-model="style"
        type="text"
        icon-left="format_paint"
        icon-left-tooltip="Add inline CSS styles here"
      />
      <v-input
        v-model="className"
        type="text"
        icon-left="class"
        icon-left-tooltip="You can edit classes in the Raw View Mode"
        disabled
      />
    </form>
  </div>
</template>
<script>
export default {
  props: ["node", "updateAttrs", "view"],
  data() {
    return {
      toggleEdit: false
    };
  },
  computed: {
    src: {
      get() {
        return this.node.attrs.src;
      },
      set(src) {
        // we cannot update `src` itself because `this.node.attrs` is immutable
        this.updateAttrs({
          src
        });
      }
    },
    style: {
      get() {
        return this.node.attrs.style;
      },
      set(style) {
        this.updateAttrs({
          style
        });
      }
    },
    className: {
      get() {
        return this.node.attrs.class;
      },
      set(className) {
        this.updateAttrs({
          className
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.iframe__wrapper {
  position: relative;
  max-width: 100%;
  cursor: pointer;
  border: 10px solid transparent;
  box-shadow: 0 0 1px var(--dark-gray);

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
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .v-input {
      max-width: 100%;
      width: 95%;
      display: block;
      margin: 5px auto;
    }
  }
}
</style>
