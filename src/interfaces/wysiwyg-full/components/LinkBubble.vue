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
        <button class="menububble__button left" @click="$parent.setLink()">
          <v-icon name="close" v-tooltip="$t('cancel')" />
        </button>
        <input
          class="menububble__input"
          type="text"
          v-model="linkUrl"
          :placeholder="$t('interfaces-wysiwyg-full-link_info')"
          ref="linkInput"
          @keydown.esc="hideLinkMenu"
        />
        <button
          class="menububble__button danger"
          @click="setLinkUrl(commands.link, null)"
          type="button"
        >
          <v-icon name="backspace" v-tooltip="$t('interfaces-wysiwyg-full-link_delete')" />
        </button>
      </form>

      <template v-else>
        <button
          v-if="$parent.options.toolbarOptions.includes('Link')"
          class="menububble__button"
          @click="showLinkMenu(getMarkAttrs('link'))"
          :class="{ 'is-active': isActive.link() }"
        >
          <p
            class="button__text"
            v-text="
              isActive.link()
                ? $t('interfaces-wysiwyg-full-link_edit')
                : $t('interfaces-wysiwyg-full-link_add')
            "
          ></p>
          <v-icon
            name="link"
            @click="$parent.setLink()"
            v-tooltip="$t('interfaces-wysiwyg-full-link_add_or_edit')"
          />
        </button>
        <button class="menububble__button" @click="$parent.setLink()">
          <v-icon name="close" v-tooltip="$t('cancel')" />
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
  background-color: var(--lighter-gray);
  padding: 0;
  min-height: 24px;
  line-height: 24px;
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

.button__text {
  display: inline-flex;
  padding: 2px 18px;
}

.menububble__button {
  display: inline-flex;
  color: var(--lightest-gray);
  background-color: var(--lighter-gray);
  transition: background-color 0.3s ease-in-out, color ease-in-out 0.2s;

  &:hover {
    background-color: var(--light-gray);
  }
  &.left {
    margin-right: auto;
  }
  &.danger {
    color: var(--lightest-gray);
    background-color: var(--lighter-gray);
    border-color: var(--lighter-gray);

    &:hover {
      background-color: var(--danger);
    }
  }
  i {
    color: inherit;
    top: 50%;
    transform: translate(-50%, -50%) scale(0.6);
    position: absolute;
    background-color: inherit;
    border-radius: 50%;
    border: calc(var(--input-border-width) * 2) solid inherit;
    font-size: 60%;
    padding: 6px;
  }
  span {
    //min-height: 24px;
  }
}

.form {
  input {
    padding: 2px 8px;
    margin: 2px;
  }
}

.menububble__item {
  border: var(--input-border-width) solid var(--lighter-gray);
  border-radius: var(--border-radius);
}
</style>
