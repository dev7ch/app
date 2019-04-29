<template>
  <editor-menu-bar :editor="editor">
    <div
      slot-scope="{ commands, isActive, getMarkAttrs }"
      class="link-bar"
      :class="{ 'is-active': isActive.link() }"
    >
      <button @click="setLinkUrl(commands.link, null)">
        <v-icon name="delete" v-tooltip="$t('interfaces-wysiwyg-full-link_delete')" />
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
  </editor-menu-bar>
</template>
<script>
import { EditorMenuBar } from "tiptap";

export default {
  components: {
    EditorMenuBar
  },
  props: {
    editor: {
      type: Object,
      defaultValue: {}
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      linkUrl: null
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
.link-bar {
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
