<template>
  <div class="editor__inner" :class="{ shrinked: $parent.showSource }">
    <editor-content
      id="wysiwyg"
      ref="editor"
      :class="[
        'interface-wysiwyg editor__content',
        $parent.readonly ? 'readonly' : '',
        { hidden: $parent.showSource }
      ]"
      :editor="$parent.editor"
      v-show="!$parent.showSource"
    ></editor-content>
    <div
      v-if="this.$refs.editor && $parent.selectionPosition.target"
      class="options-toggler"
      v-show="$parent.hasSettings"
      :class="{ active: $parent.hasSettings }"
      @click="$parent.isImageSelection = !$parent.isImageSelection"
      :style="{
        top: getTopPosition($parent.selectionPosition.target),
        left: getLeftPosition($parent.selectionPosition.target)
      }"
    >
      <v-icon name="settings"></v-icon>
    </div>
  </div>
</template>
<script>
import { EditorContent } from "tiptap";

export default {
  props: {
    editor: {
      required: true
    }
  },
  components: {
    EditorContent
  },
  methods: {
    getTopPosition($elem) {
      let editorTop = this.$refs.editor.$el.getBoundingClientRect().top;
      if (editorTop) {
        return $elem.getBoundingClientRect().top
          ? $elem.getBoundingClientRect().top -
              editorTop +
              ($elem.getBoundingClientRect().height / 2 + 34) +
              "px"
          : "19px";
      }
    },
    getLeftPosition($elem) {
      return $elem.getBoundingClientRect().width
        ? $elem.getBoundingClientRect().width / 2 - 12 + "px"
        : "0";
    }
  },

  beforeUpdate() {
    this.observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.target.localName === "img") {
          this.$parent.selectionPosition = {
            title: m.target.attributes.title ? m.target.attributes.title.value : "",
            alt: m.target.attributes.alt ? m.target.attributes.alt.value : "",
            target: m.target,
            src: m.target.src,
            classes: m.target.className.includes("ProseMirror-selectednode")
              ? m.target.className.replace(/ProseMirror-selectednode/gi, "")
              : m.target.className,
            height: m.target.height,
            width: m.target.width
          };
          if (m.target.className.includes("ProseMirror-selectednode")) {
            this.$parent.hasSettings = true;
          }
        } else if (
          !m.target.className.includes("ProseMirror-selectednode") ||
          !this.$parent.hasSettings
        ) {
          this.$parent.isImageSelection = false;
        }
      }
    });
  },
  mounted() {
    this.$nextTick(function() {
      if (this.$refs.editor.$el) {
        this.observer.observe(this.$refs.editor.$el, {
          nodeList: false,
          childList: true,
          subtree: true,
          attributeFilter: ["class"]
        });
      }
    });
  },
  beforeDestroy() {
    this.observer.disconnect();
  },
  destroyed() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
};
</script>
<style lang="scss" scoped>
.interface-wysiwyg {
  position: relative;
  min-height: 220px;
}
.editor {
  .editor__inner {
    min-height: inherit;

    &.shrinked {
      min-height: 0;
      .menubar__button:not(.toggler) {
        display: none;
      }
    }
    .editor__content {
      &.hidden {
        min-height: 0;
        display: none;
      }
    }
    img {
      max-width: 100%;
    }
  }
}
.editor__inner {
  .options-toggler {
    position: absolute;
    cursor: pointer;
    opacity: 0;
    z-index: 1;
    transform: translateY(-50%);
    border: var(--input-border-width) solid var(----accent);
    border-radius: var(--border-radius);
    color: var(--off-white);
    padding: calc(var(--page-padding) / 8);
    transition: opacity 0.3s ease-in-out, right 0.2s ease-in-out;

    i {
      background-color: var(--accent);
      padding: calc(var(--page-padding) / 4);
      &:after {
        z-index: -1;
        content: "";
        position: absolute;
        width: 180px;
        height: 180px;
        background-color: var(--off-white);
        opacity: 0.5;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    &.active {
      z-index: 1;
      opacity: 1;
      left: 0;
    }
  }
}
</style>
