<template>
  <editor-menu-bubble
    v-if="$parent.editor"
    class="menububble"
    :editor="$parent.editor"
    @hide="hideLinkMenu"
  >
    <div
      slot-scope="{ commands, isActive, getMarkAttrs, menu }"
      class="menububble__frame"
      :class="{ visible: menu.isActive && !$parent.showSource }"
      :style="
        `left: ${menu.left > calcWidth() / 2 ? menu.left + 'px' : '0'};
        transform:translateX(${menu.left > calcWidth() / 2 ? '-50%' : '0'});
        bottom: ${menu.bottom + 10}px;
        width: ${calcWidth()}px;
        max-width: 100%;
        min-width: 220px;`
      "
    >
      <Menubar :options="options" :editor="$parent.editor" :updates="$parent" />
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
      defaultValue: {}
    }
  },

  methods: {
    setEditorfromChild() {
      if (this.$parent.$children.length) {
        for (let i = 0; i < this.$parent.$children.length; i++) {
          if (this.$parent.$children[i].$refs.hasOwnProperty("editor")) {
            return (this.editor = this.$parent.$children[i].editor);
          }
        }
      }
    },
    calcWidth() {
      if (this.$props.options.toolbarOptions) {
        return this.$props.options.toolbarOptions.length * 24 + 120;
      }
    },
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
      editor: null,
      editorText: "",
      showSource: false,
      linkUrl: null,
      linkBubble: false,
      linkMenuIsActive: false
    };
  },
  mounted() {
    this.setEditorfromChild();
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
