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
        :ref="editor"
        :class="[
          'interface-wysiwyg editor__content',
          readonly ? 'readonly' : '',
          { hidden: showSource }
        ]"
        :editor="editor"
        type="textarea"
      />
    </div>
    <!-- Unformatted raw html view -->
    <template v-if="showSource">
      <RawHtmlView
        :id="name + '-raw'"
        :options="options"
        :show-source="showSource"
        :name="name"
      />
    </template>
  </div>
</template>
<script>
import mixin from "@directus/extension-toolkit/mixins/interface";
import { Editor, EditorContent } from "tiptap";
const Menubar = () => import("./components/Menubar");
const RawHtmlView = () => import("./components/RawHtmlView");

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
  Image,
  Table,
  TableHeader,
  TableRow,
  TableCell
} from "tiptap-extensions";

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
      const ext = [
        this.options.toolbarOptions.includes("Blockquote")
          ? new Blockquote()
          : "disabled",
        this.options.toolbarOptions.includes("BulletList")
          ? new BulletList()
          : "disabled",
        this.options.toolbarOptions.includes("CodeBlock")
          ? new CodeBlock()
          : "disabled",
        this.options.toolbarOptions.includes("HardBreak")
          ? new HardBreak()
          : "disabled",
        new Heading({ levels: [1, 2, 3, 4, 5] }),
        this.options.toolbarOptions.includes("HorizontalRule")
          ? new HorizontalRule()
          : "disabled",
        this.options.toolbarOptions.includes("ListItem")
          ? new ListItem()
          : "disabled",
        this.options.toolbarOptions.includes("OrderedList")
          ? new OrderedList()
          : "disabled",
        this.options.toolbarOptions.includes("TodoItem")
          ? new TodoItem()
          : "disabled",
        this.options.toolbarOptions.includes("TodoList")
          ? new TodoList()
          : "disabled",
        this.options.toolbarOptions.includes("Bold") ? new Bold() : "disabled",
        this.options.toolbarOptions.includes("Image")
          ? new Image()
          : "disabled",
        this.options.toolbarOptions.includes("Code") ? new Code() : "disabled",
        this.options.toolbarOptions.includes("Italic")
          ? new Italic()
          : "disabled",
        this.options.toolbarOptions.includes("Link") ? new Link() : "disabled",
        this.options.toolbarOptions.includes("Strike")
          ? new Strike()
          : "disabled",
        this.options.toolbarOptions.includes("Underline")
          ? new Underline()
          : "disabled",
        this.options.toolbarOptions.includes("History")
          ? new History()
          : "disabled",
        this.options.toolbarOptions.includes("Table")
          ? new Table()
          : "disabled",
        this.options.toolbarOptions.includes("TableHeader")
          ? new TableHeader()
          : "disabled",
        this.options.toolbarOptions.includes("TableCell")
          ? new TableCell()
          : "disabled",
        this.options.toolbarOptions.includes("TableRow")
          ? new TableRow()
          : "disabled"
      ];

      const search_term = "disabled";

      for (let i = ext.length - 1; i >= 0; i--) {
        if (ext[i] === search_term) {
          ext.splice(i, 1);
        }
      }

      this.editor = new Editor({
        extensions: ext,
        content: this.value ? this.value : ""
      });
    },

    updateText($text) {
      if (this.showSource) {
        this.editor.setContent(this.editorText);
      } else {
        this.editorText = $text;
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
    },

    destroy() {
      this.editor.destroy();
    }
  },
  components: {
    EditorContent,
    Menubar,
    RawHtmlView
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
      codeMirrorOptions: {}
    };
  },

  mounted() {
    this.init();
    //console.log(this.editor)
  },
  beforeDestroy() {
    this.editor.destroy();
  }
};
</script>

<style lang="scss">
@import "assets/scss/editor";
</style>
