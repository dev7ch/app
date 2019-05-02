<template>
  <div class="menu-sub-bar" :class="{ 'is-active': isActive }">
    <button @click="setLinkUrl(commands.link, null)">
      <v-icon name="delete" v-tooltip="$t('interfaces-wysiwyg-full-link_delete')" />
    </button>
    <button
      @click="
        $parent.$parent.linkBubble ? ($parent.$parent.linkBubble = false) : (submitted = true)
      "
      class="close"
    >
      <v-icon name="close" v-tooltip="$t('interfaces-wysiwyg-full-link_cancel')" />
    </button>

    <form @submit.prevent="setLinkUrl(commands.link, linkUrl)">
      <input
        ref="input"
        @input="linkUrl = $event.target.value"
        :value="getMarkAttrs('link').href"
        :placeholder="$t('editor.link_placeholder')"
      />
    </form>
  </div>
</template>
<script>
export default {
  props: {
    editor: {
      type: Object,
      defaultValue: {}
    },
    commands: {
      type: Object || Function,
      default: {}
    },
    isActive: {
      type: Boolean,
      default: false
    },
    getMarkAttrs: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      linkUrl: null,
      submitted: false
    };
  },
  methods: {
    setLinkUrl(command, linkUrl) {
      try {
        command({ href: linkUrl });
        this.submitted = true;

        // if menu bar has linkBubble set it on submit, double parent is needed due `editor-menu-bar` is in between
        if (this.$parent.$parent.linkBubble) {
          this.$parent.$parent.linkBubble = false;
        }
      } catch (e) {
        console.log(e.message);
      }
    }
  },
  mounted() {
    this.submitted = this.$props.isActive;
    this.$refs.input.focus();
  }
};
</script>
<style lang="scss" scoped>
.menu-sub-bar {
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  height: 34px;
  background-color: var(--off-white);
  border-top: calc(var(--input-border-width) / 2) solid var(--lighter-gray);
  border-bottom: var(--input-border-width) solid var(--lighter-gray);
  display: flex;

  button {
    width: 32px;
    &.close {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  form {
    flex-grow: 1;
  }

  input {
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: 0;
    color: var(--dark-gray);
  }
}
</style>
