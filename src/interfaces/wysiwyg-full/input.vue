<template>
  <div class="interface-wysiwyg-full" :id="name" :name="name">
    <!-- WYSIWYG Editor Menubar and Bubble components -->
    <MenuBar
      v-if="editor"
      :buttons="options.extensions"
      :editor="editor"
      :show-source="showSource"
    />

    <!-- Unformatted raw html view -->
    <!--<RawHtmlView v-if="showSource" :value="value" @input="updateValue" />-->

    <!-- WYSIWYG Editor -->
    <EditorContent
      :parent-value="editorText ? editorText : value"
      :update-value="updateValue"
      :raw-view="showSource"
      :editor="editor"
      @toggleImageEdit="showImageEdit = $event || !showImageEdit"
    />
  </div>
</template>
<script>
import mixin from "@directus/extension-toolkit/mixins/interface";
import { Editor } from "tiptap";
import EditorContent from "./components/EditorContent";
import MenuBar from "./components/MenuBar";

import {
  Bold,
  Blockquote,
  BulletList,
  Code,
  CodeBlock,
  HardBreak,
  Heading,
  History,
  HorizontalRule,
  Italic,
  Link,
  ListItem,
  OrderedList,
  Strike,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TodoItem,
  TodoList,
  Underline
} from "tiptap-extensions";

import { Image } from "./extensions";

export default {
  name: "interface-wysiwyg",
  mixins: [mixin],
  components: {
    EditorContent,
    MenuBar
  },
  data() {
    return {
      editorText: "",
      editor: null,
      showSource: false
    };
  },

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
      const extensions = this.options.extensions
        .map(ext => {
          switch (ext) {
            case "blockquote":
              return new Blockquote();
            case "bold":
              return new Bold();
            case "bullet_list":
              return [new ListItem(), new BulletList()];
            case "code":
              return new Code();
            case "code_block":
              return new CodeBlock();
            case "h1" || "h2" || "h3" || "h4" || "h5" || "h6":
              return new Heading();
            case "hardbreak":
              return new HardBreak();
            case "history":
              return new History();
            case "horizontal_rule":
              return new HorizontalRule();
            case "image":
              return new Image();
            case "italic":
              return new Italic();
            case "link":
              return new Link();
            case "ordered_list":
              return [new OrderedList(), new ListItem()];
            case "strike":
              return new Strike();
            case "table":
              return [new Table(), new TableHeader(), new TableCell(), new TableRow()];
            case "todolist":
              return [new TodoItem(), new TodoList()];
            case "underline":
              return new Underline();
          }
        })
        .filter(ext => ext)
        .flat();

      this.editorText = this.value ? this.value : "";
      this.editor = new Editor({
        extensions: extensions,
        content: this.editorText,
        onUpdate: ({ getHTML }) => {
          this.$emit("input", getHTML());
        }
      });
    },
    updateValue(value) {
      this.$emit("input", value);
      this.editorText = value;
      if (this.editorText !== this.editor.view.dom.innerHTML) {
        this.editor.view.dom.innerHTML = value;
      }
    }
  },

  mounted() {
    this.init();
  },

  beforeDestroy() {
    this.editor.destroy();
  }
};
</script>

<style lang="scss">
@import "assets/scss/editor";
</style>

<style lang="scss" scoped>
.interface-wysiwyg-full {
  --wysiwyg-padding: calc(var(--page-padding) / 2);

  position: relative;
  width: 100%;
  border: var(--input-border-width) solid var(--lighter-gray);
  border-radius: var(--border-radius);
  transition: border-color var(--fast) var(--transition);

  &:hover {
    border-color: var(--light-gray);
  }

  &:focus-within {
    border-color: var(--dark-gray);
  }
}
</style>
