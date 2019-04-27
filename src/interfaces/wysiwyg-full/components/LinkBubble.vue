<template>
  <editor-menu-bubble class="menububble" :editor="editor" @hide="hideLinkMenu">
    <div
      slot-scope="{ commands, isActive, getMarkAttrs, menu }"
      class="menububble__item"
      :class="{ 'is-active': menu.isActive }"
      :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
    >
      <form
        :linkBubbleclass="'menububble__form'"
        v-if="linkMenuIsActive"
        @submit.prevent="setLinkUrl(commands.link, linkUrl)"
      >
        <input
          class="menububble__input"
          type="text"
          v-model="linkUrl"
          placeholder="https://"
          ref="linkInput"
          @keydown.esc="hideLinkMenu"
        />
        <button class="menububble__button" @click="setLinkUrl(commands.link, null)" type="button">
          <v-icon name="close" />
        </button>
      </form>

      <template v-else>
        <button
          v-if="$parent.options.toolbarOptions.includes('Link')"
          class="menububble__button"
          @click="showLinkMenu(getMarkAttrs('link'))"
          :class="{ 'is-active': isActive.link() }"
        >
          <span v-text="isActive.link() ? $t('edit_link') : $t('add_link')"></span>
          <v-icon name="link" />
        </button>
      </template>
    </div>
  </editor-menu-bubble>
</template>
<script>
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
    EditorMenuBubble
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
  padding: 3px 5px 0 5px;
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
