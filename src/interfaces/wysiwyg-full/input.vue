<template>
  <div
    class="interface-wysiwyg-container editor"
    :id="name"
    :name="name"
    @input="$emit('input', $event.target.innerHTML)"
  >
    <!-- WYSIWYG Editor Menubar and Bubble components -->
    <Menubar :options="options" v-if="editor" />
    <!-- WYSIWYG Editor -->
    <EditorContent :editor="editor" />
    <!-- Unformatted raw html view -->
    <template v-if="showSource">
      <RawHtmlView
        :id="name + '-raw'"
        :options="options"
        :show-source="showSource"
        :name="name"
        :editor-text="editorText"
        :editor="editor"
      />
    </template>
    <ImageEdit />
  </div>
</template>
<script>
import mixin from "@directus/extension-toolkit/mixins/interface";
import { Editor } from "tiptap";
import EditorContent from "./components/EditorContent";
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
          "Blockquote",
          "ListItem",
          "BulletList",
          "OrderedList",
          "Code",
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

  mounted() {
    this.init();
  },

  beforeDestroy() {
    this.editor.destroy();
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleEditorScroll);
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
</style>
<style lang="scss">
@import "assets/scss/editor";
</style>
