<template>
  <div
    class="interface-wysiwyg-container editor"
    :id="name"
    :name="name"
    @input="$emit('input', $event.target.innerHTML)"
  >
    <div class="editor__inner" :class="{ shrinked: showSource }">
      <!-- WYSIWYG Editor Menubar and Bubble components -->
      <Menubar :options="options" v-if="editor" />
      <!-- WYSIWYG Editor  -->
      <editor-content
        id="wysiwyg-full"
        ref="editor"
        :class="[
          'interface-wysiwyg editor__content',
          readonly ? 'readonly' : '',
          { hidden: showSource }
        ]"
        :editor="editor"
      />
      <div
        class="options-toggler"
        v-if="selectionPosition.target && hasSettings && !showSource"
        :class="{ active: hasSettings }"
        @click="isImageSelection = !isImageSelection"
        :style="{
          top: getTopPosition(selectionPosition.target),
          left: getLeftPosition(selectionPosition.target)
        }"
      >
        <v-icon name="settings"></v-icon>
      </div>
    </div>
    <!-- Unformatted raw html view -->
    <template v-if="showSource">
      <RawHtmlView :id="name + '-raw'" :options="options" :show-source="showSource" :name="name" />
    </template>
    <ImageEdit />
  </div>
</template>
<script>
import mixin from "@directus/extension-toolkit/mixins/interface";
import { Editor, EditorContent } from "tiptap";
const Menubar = () => import("./components/MenuBar");
const RawHtmlView = () => import("./components/RawHtmlView");
import ImageEdit from "./components/ImageEdit";

import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Table,
  TableHeader,
  TableRow,
  TableCell
} from "tiptap-extensions";

import { Image } from "./extensions";

export default {
  name: "interface-wysiwyg",
  mixins: [mixin],
  watch: {
    value(newVal) {
      if (newVal && !this.showSource) {
        this.editorText = newVal;
      } else {
        this.$emit("input", this.editorText);
      }
    }
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
    },
    init() {
      if (
        !this.options.toolbarOptions ||
        (this.options.toolbarOptions !== null && this.options.toolbarOptions.length === 0)
      ) {
        this.options.toolbarOptions = [
          "Paragraph",
          "Bold",
          "Strike",
          "Underline",
          "Italic",
          "ListItem",
          "BulletList",
          "OrderedList",
          "Table",
          "Image",
          "History"
        ];
      }
      const ext = [
        this.options.toolbarOptions.includes("Blockquote") ? new Blockquote() : "disabled",
        this.options.toolbarOptions.includes("BulletList") ? new BulletList() : "disabled",
        this.options.toolbarOptions.includes("CodeBlock") ? new CodeBlock() : "disabled",
        this.options.toolbarOptions.includes("HardBreak") ? new HardBreak() : "disabled",
        new Heading({ levels: [1, 2, 3, 4, 5] }),
        this.options.toolbarOptions.includes("HorizontalRule") ? new HorizontalRule() : "disabled",
        this.options.toolbarOptions.includes("ListItem") ? new ListItem() : "disabled",
        this.options.toolbarOptions.includes("OrderedList") ? new OrderedList() : "disabled",
        this.options.toolbarOptions.includes("TodoItem") ? new TodoItem() : "disabled",
        this.options.toolbarOptions.includes("TodoList") ? new TodoList() : "disabled",
        this.options.toolbarOptions.includes("Bold") ? new Bold() : "disabled",
        this.options.toolbarOptions.includes("Image") ? new Image() : "disabled",
        this.options.toolbarOptions.includes("Code") ? new Code() : "disabled",
        this.options.toolbarOptions.includes("Italic") ? new Italic() : "disabled",
        this.options.toolbarOptions.includes("Link") ? new Link() : "disabled",
        this.options.toolbarOptions.includes("Strike") ? new Strike() : "disabled",
        this.options.toolbarOptions.includes("Underline") ? new Underline() : "disabled",
        this.options.toolbarOptions.includes("History") ? new History() : "disabled",
        this.options.toolbarOptions.includes("Table") ? new Table() : "disabled",
        this.options.toolbarOptions.includes("Table") ? new TableHeader() : "disabled",
        this.options.toolbarOptions.includes("Table") ? new TableCell() : "disabled",
        this.options.toolbarOptions.includes("Table") ? new TableRow() : "disabled"
      ];
      const search_term = "disabled";
      for (let i = ext.length - 1; i >= 0; i--) {
        if (ext[i] === search_term) {
          ext.splice(i, 1);
        }
      }
      this.editor = new Editor({
        extensions: ext,
        content: this.value ? this.value : "",
        onUpdate: ({ getHTML }) => {
          this.$emit("input", getHTML());
        }
      });
      this.handleEditorScroll();
    },
    updateText($text) {
      if (this.showSource) {
        this.editor.view.dom.innerHTML = this.editorText;
      } else {
        this.editorText = $text;
      }
      this.showSource = !this.showSource;
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
    },
    destroy() {
      this.editor.destroy();
    },
    handleEditorScroll() {
      this.editor.view.dom.onscroll = () => {
        this.hasSettings ? (this.hasSettings = false) : null;
      };
    }
  },
  components: {
    EditorContent,
    Menubar,
    RawHtmlView,
    ImageEdit
  },
  data() {
    return {
      editorExtensions: [],
      editorText: "",
      editor: null,
      showSource: false,
      showRaw: false,
      showTableOptions: false,
      chooseExisting: false,
      chooseImage: false,
      newFile: false,
      linkUrl: null,
      linkMenuIsActive: false,
      lineCount: 0,
      codeMirrorOptions: {},
      selectionPosition: {
        pos: null,
        editorPos: null,
        alt: {
          value: null
        },
        title: null,
        src: null,
        target: null
      },
      hasSettings: false,
      isImageSelection: false
    };
  },

  destroyed() {
    window.removeEventListener("scroll", this.handleEditorScroll);
  },
  beforeUpdate() {
    this.observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.target.localName === "img") {
          this.selectionPosition = {
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
            this.hasSettings = true;
          }
        } else if (m.type === "childList") {
          this.isImageSelection = false;
          this.hasSettings = false;
        }
      }
    });
  },
  mounted() {
    this.init();
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
    this.editor.destroy();
    this.observer.disconnect();
  }
};
</script>

<style lang="scss" scoped>
.interface-wysiwyg-container,
.interface-wysiwyg {
  position: relative;
  width: 100%;
  min-height: inherit;
  max-width: var(--width-x-large);
}
.editor {
  position: relative;
  min-height: 220px;
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
</style>
<style lang="scss">
@import "assets/scss/editor";
</style>
