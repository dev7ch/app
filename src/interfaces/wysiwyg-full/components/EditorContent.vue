<template>
  <div>
    <editor-content
      ref="editor"
      class="editor-content"
      :class="[$parent.readonly ? 'readonly' : '', { hidden: $parent.showSource }]"
      :editor="$parent.editor"
    ></editor-content>

    <!--     <div
      v-if="this.$refs.editor && $parent.selectionPosition.target"
      v-show="$parent.hasSettings"
      class="options-toggler"
      :class="{ active: $parent.hasSettings }"
      @click="$parent.isImageSelection = !$parent.isImageSelection"
      :style="{
        top: getTopPosition($parent.selectionPosition.target),
        left: getLeftPosition($parent.selectionPosition.target)
      }"
    >
      <v-icon name="settings"></v-icon>
    </div> -->
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
    // getTopPosition($elem) {
    //   let editorTop = this.$refs.editor.$el.getBoundingClientRect().top;
    //   if (editorTop) {
    //     return $elem.getBoundingClientRect().top
    //       ? $elem.getBoundingClientRect().top -
    //           editorTop +
    //           ($elem.getBoundingClientRect().height / 2 + 34) +
    //           "px"
    //       : "19px";
    //   }
    // },
    // getLeftPosition($elem) {
    //   return $elem.getBoundingClientRect().width
    //     ? $elem.getBoundingClientRect().width / 2 - 12 + "px"
    //     : "0";
    // }
    // },
    // beforeUpdate() {
    //   this.observer = new MutationObserver(mutations => {
    //     for (const m of mutations) {
    //       if (m.type === "attributes" && m.target.localName === "img") {
    //         this.$parent.selectionPosition = {
    //           title: m.target.attributes.title ? m.target.attributes.title.value : "",
    //           alt: m.target.attributes.alt ? m.target.attributes.alt.value : "",
    //           target: m.target,
    //           src: m.target.src,
    //           classes: m.target.className.includes("ProseMirror-selectednode")
    //             ? m.target.className.replace(/ProseMirror-selectednode/gi, "")
    //             : m.target.className,
    //           height: m.target.height,
    //           width: m.target.width
    //         };
    //         if (m.target.className.includes("ProseMirror-selectednode")) {
    //           this.$parent.hasSettings = true;
    //         }
    //       } else if (
    //         !m.target.className.includes("ProseMirror-selectednode") ||
    //         !this.$parent.hasSettings
    //       ) {
    //         this.$parent.isImageSelection = false;
    //       }
    //     }
    //   });
    // },
    // mounted() {
    //   this.$nextTick(function() {
    //     if (this.$refs.editor.$el) {
    //       this.observer.observe(this.$refs.editor.$el, {
    //         nodeList: false,
    //         childList: true,
    //         subtree: true,
    //         attributeFilter: ["class"]
    //       });
    //     }
    //   });
    // },
    // beforeDestroy() {
    //   this.observer.disconnect();
    // },
    // destroyed() {
    //   if (this.observer) {
    //     this.observer.disconnect();
    //   }
  }
};
</script>

<style lang="scss">
.editor-content .ProseMirror {
  min-height: 300px;
  padding: var(--wysiwyg-padding);

  img {
    max-width: 100%;
  }

  code {
    display: inline-block;
    padding: 0 3px;
    font-family: var(--family-monospace);
    background-color: var(--lightest-gray);
    color: var(--dark-gray);
    border-radius: var(--border-radius);
    border: 1px solid var(--lighter-gray);
  }

  pre {
    max-width: 100%;
    overflow-x: scroll;
    margin: 3px auto;
  }

  blockquote {
    padding-left: 7px;
    border-left: 2px solid var(--lighter-gray);
    color: var(--light-gray);
    font-size: 140%;
  }

  a {
    cursor: pointer;
  }

  strong {
    font-weight: bolder;
  }

  h1 {
    font-size: var(--size-1);
  }

  h2 {
    font-size: var(--size-2);
  }

  h3 {
    font-size: var(--size-3);
  }

  h4 {
    font-size: var(--size-4);
  }

  p + p {
    margin-bottom: 0;
    &:last-of-type {
      margin-bottom: 15px;
    }
  }

  hr {
    background-color: var(--lightest-gray);
    height: 2px;
    border-color: transparent;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  ul,
  ol {
    padding-left: 28px;
    margin-bottom: 20px;
  }

  .tableWrapper {
    max-width: 100%;
    overflow-x: auto;

    table {
      background-color: var(--white);
      border: solid var(--lighter-gray) 1px;
      width: 100%;

      tbody {
        tr,
        td {
          min-width: 70px;
          border: 1px solid var(--lighter-gray);
          transition: var(--slow) var(--transition);
          transition-property: border-color;
          &:focus,
          &:active,
          &:focus-within {
            border-color: var(--black);
          }
        }

        td {
          position: relative;
          &:after {
            z-index: 0;
            position: absolute;
            content: "";
            top: 0;
            right: 0;
            height: 100%;
            width: 5px;
            cursor: ew-resize;
          }
        }
      }
      border-spacing: 0;
      -webkit-border-horizontal-spacing: 0;
      -webkit-border-vertical-spacing: 0;
    }

    .selectedCell {
      background-color: var(--lightest-gray);
    }
  }
}
</style>
