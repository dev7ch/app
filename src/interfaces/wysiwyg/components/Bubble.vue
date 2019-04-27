<template>
  <editor-menu-bubble class="menububble" :editor="editor" @hide="hideLinkMenu">
    <div
      slot-scope="{ commands, isActive, getMarkAttrs, menu }"
      class="menububble__item"
      :class="{ 'is-active': menu.isActive }"
      :style="
        `left: 50%; transform:translate(-50%); bottom: ${menu.bottom + 15}px; min-width: ${options
          .toolbarOptions.length *
          24 +
          120}px;`
      "
    >
      <Menubar :options="options" v-if="$parent.editor" />
    </div>
  </editor-menu-bubble>
</template>
<script>
const Menubar = () => import("./../../wysiwyg-full/components/MenuBar");
import { EditorMenuBubble } from "tiptap";
export default {
  props: {
    options: {
      type: Object,
      defaultValue: {}
    },
    editor: {
      type: Object,
      defaultValue: {}
    },
    showSource: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    showLinkMenu(attrs) {
      this.linkUrl = attrs.href;
      this.linkMenuIsActive = true;
      this.$nextTick(() => {
        this.$refs.linkInput.focus();
      });
    },
    hideLinkMenu() {
      this.linkUrl = null;
      this.linkMenuIsActive = false;
    },
    setLinkUrl(command, url) {
      command({ href: url });
      this.hideLinkMenu();
      this.editor.focus();
    }
  },

  components: {
    EditorMenuBubble,
    Menubar
  },

  data() {
    return {
      linkUrl: null,
      linkBubble: false,
      linkMenuIsActive: false
    };
  }
};
</script>
<style lang="scss" scoped>
.menububble {
  position: absolute;
  background-color: var(--lightest-gray);
  padding: 0;
  visibility: hidden;
  opacity: 0;
  transition: top 0.2s ease-in-out, bottom 0.2s ease-in-out, left 0.2s ease-in-out,
    opacity 0.3s ease-in-out;
  border-radius: var(--border-radius);

  &.visible {
    visibility: visible;
    opacity: 1;
    z-index: 1;
  }
}

.menububble__button {
  .icon {
    margin-bottom: -5px;
  }
}
</style>
