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
      editorJson: this.options.json_output ? (this.value ? this.value : {}) : null,
      editor: null,
      rawView: false,
      showLinkBar: false
    };
  },

  watch: {
    value(newVal) {
      if (newVal && !this.rawView) {
        this.editorText = newVal;
      } else if (!this.$props.options.json_output) {
        this.$emit("input", this.editorText);
      } else if (this.type === "json") {
        this.$emit("input", this.editorJson);
      }

      // Allow saving a string in json mode to DB
      if (this.type === "string" && this.$props.options.json_output) {
        this.editorText = JSON.stringify(this.editorJson);
        this.$emit("input", this.editorText);
      }
    }
  },
  methods: {
    updateValue(value) {
      this.editorText = value;
      if (this.editorText !== this.editor.view.dom.innerHTML && !this.$props.options.json_output) {
        this.editor.view.dom.innerHTML = value;
      } else {
        // Fallback set, is dropping Tip tap History
        this.editor.setContent(value);
      }

      if (!this.$props.options.json_output) {
        if (value === "<p><br></p>" || value === "<p></p>") {
          // remove empty value on toggle to raw mode
          this.editorText = "";
          // stage empty value to save in DB
          this.$emit("input", "");
        } else {
          this.$emit("input", value);
        }
      } else {
        try {
          JSON.parse(value);
          let jsonObject = JSON.parse(value);
          this.editorJson = jsonObject;
          console.log(this.editorJson);
          this.$emit("input", this.editorJson);
        } catch (e) {
          this.$emit("input", value);
        }
        //this.$emit("input", this.editorJson);
      }
    },

    toggleLinkBar() {
      this.showLinkBar = !this.showLinkBar;
    },
    showSource() {
      if (!this.rawView && !this.$props.options.json_output) {
        this.updateValue(this.editor.view.dom.innerHTML);
      } else if (!this.editorJson) {
        this.updateValue(this.editorText);
      } else {
        this.updateValue(this.editorJson);
      }

      return (this.rawView = !this.rawView);
    },

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
            default:
              return new Heading();
          }
        })
        .filter(ext => ext)
        .flat();

      this.editorText = this.value ? this.value : "";

      if (this.options.json_output) {
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
          onUpdate: ({ getHTML }) => {
            this.$emit("input", getHTML());
          }
        });
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

  .menubar__wrapper {
    border-bottom: var(--input-border-width) solid var(--lighter-gray);
  }
}
</style>
