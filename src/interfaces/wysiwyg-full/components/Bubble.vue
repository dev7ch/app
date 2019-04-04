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
        <button
          class="menububble__button"
          @click="setLinkUrl(commands.link, null)"
          type="button"
        >
          <icon name="close" />
        </button>
      </form>

      <template v-else>
        <button
          class="menububble__button"
          @click="showLinkMenu(getMarkAttrs('link'))"
          :class="{ 'is-active': isActive.link() }"
        >
          <span>{{ isActive.link() ? $t("edit_link") : $t("add_link") }}</span>
          <icon name="link" />
        </button>
      </template>
    </div>
  </editor-menu-bubble>
</template>
<script>
import { EditorMenuBubble } from "tiptap";
import Icon from "./Icon";
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
    Icon
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
