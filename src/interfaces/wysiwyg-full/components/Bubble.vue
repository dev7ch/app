<template>
  <editor-menu-bubble v-if="editor" class="menububble" :editor="editor">
    <div
      slot-scope="{ commands, isActive, getMarkAttrs, menu }"
      class="menububble__frame"
      :class="{ visible: menu.isActive && !showSource }"
      :style="
        `left: ${menu.left > calcWidth() / 2 ? menu.left + 'px' : '0'};
        transform:translateX(${menu.left > calcWidth() / 2 ? '-50%' : '0'});
        bottom: ${menu.bottom + 10}px;
        width: ${calcWidth()}px;
        max-width: 100%;
        min-width: 220px;`
      "
    >
      <template v-if="buttons">
        <Menubar
          :options="options"
          :buttons="options.extensions"
          :editor="editor"
          :show-source="showSource"
          :toggle-source="toggleSource"
        />
      </template>
    </div>
  </editor-menu-bubble>
</template>
<script>
const Menubar = () => import("./MenuBar");
import { EditorMenuBubble } from "tiptap";
export default {
  props: {
    options: {
      type: Object,
      defaultValue: () => {}
    },
    buttons: {
      type: Array,
      defaultValue: null
    },
    editor: {
      type: Object,
      defaultValue: () => {}
    },
    showSource: {
      type: Boolean,
      default: false
    },
    toggleSource: {
      type: Function,
      default: () => false
    }
  },

  methods: {
    calcWidth() {
      if (this.$props.options.toolbarOptions) {
        return this.$props.options.toolbarOptions.length * 24 + 120;
      }
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
  opacity: 0;
  transition: top 0.2s ease-in-out, bottom 0.2s ease-in-out, left 0.2s ease-in-out,
    opacity 0.4s ease-in-out, opacity 0.3s ease-in-out;
  border-radius: var(--border-radius);

  &.visible {
    visibility: visible;
    opacity: 1;
    z-index: 99;
  }

  .menubar__wrapper {
    z-index: 99;
    .menubar {
      overflow-y: auto;
    }
  }
  .menubar__wrapper {
    border: var(--input-border-width) solid var(--lighter-gray);
  }
}

.menubar__button.toggler {
  min-height: 34px;
  border-color: var(--darkest-gray);
  background-color: var(--darker-gray);
}

.menububble__button {
  .icon {
    //margin-bottom: -5px;
  }
}
</style>
