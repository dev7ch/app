<template>
  <div class="menu-sub-bar" :class="{ 'is-active': isActive && !submitted }">
    <button @click="setLinkUrl(commands.link, null)">
      <v-icon name="delete" v-tooltip="$t('interfaces-wysiwyg-full-link_delete')" />
    </button>
    <button @click="$parent.isActive.link = false">
      <v-icon name="close" v-tooltip="$t('interfaces-wysiwyg-full-link_cancel')" />
    </button>

    <form @submit.prevent="setLinkUrl(commands.link, linkUrl)">
      <input
        ref="input"
        type="url"
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
      command({ href: linkUrl });
      this.editor.focus();
    }
  },
  mounted() {
    this.$refs.input.focus();
  }
};
</script>
<style lang="scss" scoped>
.menu-sub-bar {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 34px;
  background-color: var(--off-white);
  border-top: var(--input-border-width) solid var(--lighter-gray);
  display: flex;

  button {
    width: 32px;
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
