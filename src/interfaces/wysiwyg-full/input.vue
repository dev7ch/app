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
      :parent-value="options.output_format === 'md' ? stagedMarkdown : editorText"
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
import showdown from "showdown/dist/showdown.min";

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
      }

      if (this.type === "string") {
        // Saving a string schema when json mode is active
        if (this.$props.options.output_format === "json" && this.editorJson) {
          this.editorText = JSON.stringify(this.editorJson);
          this.$emit("input", this.editorText);
        }
      }

      if (this.rawView) {
        if (this.$props.options.output_format !== "json" && this.type === "string") {
          if (this.$props.options.output_format === "md") {
            this.$emit("input", newVal);
          } else {
            this.$emit("input", this.editorText ? this.editorText : newVal);
          }
        }
      }
    }
  },

  computed: {
    converter() {
      let conv = new showdown.Converter({
        tablesHeaderId: false,
        tables: false,
        strikethrough: true,
        omitExtraWLInCodeBlocks: true,
        backslashEscapesHTMLTags: false,
        emoji: true,
        simpleLineBreaks: true,
        metadata: true,
        underline: true,
        parseImgDimensions: false
      });
      return conv;
    }
  },
  methods: {
    convertMarkdown($val) {
      if ($val) {
        // console.log(this.converter)
        // console.log(this.converter.getMetadata())
        // console.log(this.converter.getOptions())
        // this.converter.setOption("tables", false);
        // this.converter.setFlavor("github");
        this.stagedMarkdown = this.converter.makeMd($val);
      }
    },
    convertHtml($val) {
      if ($val) {
        return this.converter.makeHtml($val);
      }
    },

    updateValue: function(value) {
      if (this.options.output_format === "html") {
        if (value !== this.editorText) {
          this.editorText = value;
          this.editor.view.dom.innerHTML = value;
        }
        // remove empty value on toggle to raw mode and emit empty value to save in DB
        if (value === "<p><br></p>" || value === "<p></p>") {
          this.editorText = "";
          this.$emit("input", "");
        }
        // Override Json output for raw view mode in HTML mode
        if (this.type === "json") {
          this.editorJson = value;
        }
      } else if (this.options.output_format === "json") {
        if (!this.stagedJson) {
          try {
            JSON.parse(value);
            this.editorJson = JSON.parse(value);
            this.$emit("input", this.editorJson);
          } catch (e) {
            this.$emit("input", value);
          }
        } else if (this.stagedJson) {
          this.$emit("input", this.stagedJson);
        }
      } else if (this.options.output_format === "md") {
        if (!this.rawView) {
          this.$emit("input", this.value);
        } else {
          let ghostHtml = this.convertHtml(this.editorText);
          this.editor.view.dom.innerHTML = ghostHtml;
          this.editorText = value;
          this.$emit("input", value);
        }
      }
    },

    toggleLinkBar() {
      this.showLinkBar = !this.showLinkBar;
    },

    showSource: function() {
      if (!this.rawView && this.options.output_format !== "json") {
        this.updateValue(this.editor.view.dom.innerHTML);
      }

      if (this.options.output_format === "json") {
        if (this.rawView) {
          try {
            JSON.parse(this.value);
            this.editor.setContent(JSON.parse(this.value));
          } catch (e) {
            this.editor.setContent(this.value);
          }
        } else {
          this.updateValue(this.editorJson);
        }
      }

      if (this.options.output_format === "md") {
        if (this.rawView) {
          this.stagedMarkdown = this.editorText;
        } else {
          this.editor.view.dom.innerHTML = this.convertHtml(this.editorText);
        }
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

      // Handle raw json data in for string schema type
      let stringifiedJson = null;
      if (this.type === "string" && this.value) {
        if (this.options.output_format === "json") {
          try {
            JSON.parse(this.value);
            this.editorJson = JSON.parse(this.value);
          } catch (e) {
            console.warn(
              "Could not Parse JSON to HTML. Your field schema doesn`t match the editor mode. "
            );
          }
        } else if (this.options.output_format === "html") {
          try {
            // try to convert JSON back to html, previously stored in md JSON mode
            JSON.parse(this.value);
            stringifiedJson = JSON.parse(this.value);
          } catch (e) {
            // try to convert markdown back to html, previously stored in MD mode
            try {
              stringifiedJson = null;
              this.editorText = this.convertHtml(this.value);
            } catch (e) {
              console.warn("Could not Parse JSON or Markdown.");
            }
          }
        } else if (this.options.output_format === "md") {
          stringifiedJson = null;
          this.stagedMarkdown = this.editorText;
          this.editorText = this.convertHtml(this.editorText);
        }
      }

      // Create Editor for JSON mode and  other Modes separated
      if (this.options.output_format === "json") {
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
          content: stringifiedJson ? stringifiedJson : this.editorText,
          onUpdate: ({ getHTML, getJSON }) => {
            this.stagedJson = getJSON();
            if (this.type === "json") {
              this.$emit("input", this.stagedJson);
            } else {
              if (this.options.output_format === "md") {
                if (this.rawView) {
                  this.$emit("input", this.editorText);
                } else {
                  this.convertMarkdown(getHTML());
                  this.$emit("input", this.stagedMarkdown);
                }
              } else {
                this.$emit("input", getHTML());
              }
            }
          }
        });
      }
    }
  },

  mounted() {
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
