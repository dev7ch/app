<template>
  <div class="interface-wysiwyg-full" :id="name" :name="name">
    <MenuBar
      v-if="editor"
      :buttons="options.extensions"
      :options="options"
      :editor="editor"
      :show-source="rawView"
      :show-link="showLinkBar"
      :toggle-link="toggleLinkBar"
      :toggle-source="showSource"
    />
    <EditorContent
      :options="options"
      :parent-value="editorText ? editorText : value"
      :parent-json="editorJson"
      :update-value="updateValue"
      :show-source="rawView"
      :editor="editor"
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
  Underline
} from "tiptap-extensions";

import { Image, Span } from "./extensions";

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
      editorJson:
        this.$props.options.output_format === "json" ? (this.value ? this.value : {}) : null,
      stagedJson: null,
      stagedMarkdown: "",
      editor: null,
      rawView: false,
      showLinkBar: false
    };
  },

  watch: {
    value(newVal) {
      if (newVal && !this.rawView) {
        this.editorText = newVal;
      } else if (this.$props.options.output_format !== "json" && this.type === "string") {
        this.$emit("input", this.editorText);
      } else if (this.type === "json" && !this.stagedJson) {
        this.$emit("input", this.editorJson);
      } else if (this.stagedJson && this.type === "json") {
        this.$emit("input", this.stagedJson);
      }

      // Saving a string schema when json mode is active
      if (this.type === "string" && this.$props.options.output_format === "json") {
        this.editorText = JSON.stringify(this.editorJson);
        this.$emit("input", this.editorText);
      }

      // Saving in json schema when html mode is active
      if (this.type === "json" && this.$props.options.output_format !== "json") {
        this.$emit("input", this.stagedJson);
      }
    }
  },
  methods: {
    updateValue(value) {
      if (
        value !== this.editor.view.dom.innerHTML &&
        this.$props.options.output_format !== "json"
      ) {
        this.editor.view.dom.innerHTML = value;
      } else {
        // Fallback set, is dropping Tip tap History
        this.editor.setContent(value);
      }

      if (this.$props.options.output_format !== "json") {
        // remove empty value on toggle to raw mode
        if (value === "<p><br></p>" || value === "<p></p>") {
          this.editorText = "";
          // stage empty value to save in DB
          this.$emit("input", "");
        } else {
          if (this.type === "json" && this.$props.options.output_format !== "json") {
            // Override Json output for raw view mode in HTML mode
            this.editorJson = value;
          }
          this.$emit("input", value);
        }
      } else if (this.$props.options.output_format === "json") {
        if (!this.stagedJson) {
          try {
            this.editorJson = JSON.parse(value);
            this.$emit("input", this.editorJson);
          } catch (e) {
            this.$emit("input", value);
          }
        } else if (this.stagedJson) {
          this.$emit("input", this.stagedJson);
        }
      }
    },

    toggleLinkBar() {
      this.showLinkBar = !this.showLinkBar;
    },

    showSource: function() {
      if (!this.rawView && this.$props.options.output_format !== "json") {
        this.updateValue(this.editor.view.dom.innerHTML);
      } else if (!this.editorJson) {
        this.updateValue(this.editorText);
      } else {
        this.updateValue(this.editorJson);
      }
      return (this.rawView = !this.rawView);
    },

    initEditor() {
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
            case "underline":
              return new Underline();
            case "span":
              return new Span();
            default:
              return new Heading();
          }
        })
        .filter(ext => ext)
        .flat();

      this.editorText = this.value ? this.value : "";

      if (this.$props.options.output_format === "json") {
        this.editor = new Editor({
          extensions: extensions,
          content: this.editorJson,
          onUpdate: ({ getJSON }) => {
            this.editorJson = getJSON();
            this.$emit("input", getJSON());
          }
        });
      } else {
        this.editor = new Editor({
          extensions: extensions,
          content: this.editorText,
          onUpdate: ({ getHTML, getJSON }) => {
            this.stagedJson = getJSON();
            //this.$emit("input", getJSON());
            this.$emit("input", getHTML());
          }
        });
      }
    }
  },

  created() {
    this.initEditor();
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

  .menubar__wrapper {
    border-bottom: var(--input-border-width) solid var(--lighter-gray);
  }
}
</style>
