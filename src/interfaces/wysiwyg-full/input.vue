<template>
  <div :id="name" class="interface-wysiwyg-full" :name="name">
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
      :parent-value="options.output_format === 'md' ? stagedMD : editorHTML"
      :parent-json="editorJSON"
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
  name: "InterfaceWysiwyg",
  components: {
    EditorContent,
    MenuBar
  },
  mixins: [mixin],
  data() {
    return {
      editorHTML: "",
      editorJSON:
        this.$props.options.output_format === "json" ? (this.value ? this.value : {}) : null,
      stagedJSON: null,
      stagedMD: "",
      editor: null,
      rawView: false,
      showLinkBar: false
    };
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

  watch: {
    value(newVal) {
      if (newVal && !this.rawView) {
        this.editorHTML = newVal;
      }

      if (this.type === "string") {
        // Saving a string schema when json mode is active
        if (this.$props.options.output_format === "json" && this.editorJSON) {
          this.editorHTML = JSON.stringify(this.editorJSON);
          this.$emit("input", this.editorHTML);
        }
      }

      if (this.rawView) {
        if (this.$props.options.output_format !== "json" && this.type === "string") {
          if (this.$props.options.output_format === "md") {
            this.$emit("input", newVal);
          } else {
            this.$emit("input", this.editorHTML ? this.editorHTML : newVal);
          }
        }
      }
    }
  },

  mounted() {
    this.initEditor();
  },

  beforeDestroy() {
    this.editor.destroy();
  },
  methods: {
    convertMarkdown($val) {
      if ($val) {
        // console.log(this.converter)
        // console.log(this.converter.getMetadata())
        // console.log(this.converter.getOptions())
        // this.converter.setOption("tables", false);
        // this.converter.setFlavor("github");
        this.stagedMD = this.converter.makeMd($val);
      }
    },
    convertHtml($val) {
      if ($val) {
        return this.converter.makeHtml($val);
      }
    },

    updateValue: function(value) {
      if (this.options.output_format === "html") {
        if (value !== this.editorHTML) {
          this.editorHTML = value;
          this.editor.view.dom.innerHTML = value;
        }
        // remove empty value on toggle to raw mode and emit empty value to save in DB
        if (value === "<p><br></p>" || value === "<p></p>") {
          this.editorHTML = "";
          this.$emit("input", "");
        }
        // Override Json output for raw view mode in HTML mode
        if (this.type === "json") {
          this.editorJSON = value;
        }
      } else if (this.options.output_format === "json") {
        if (!this.stagedJSON) {
          try {
            JSON.parse(value);
            this.editorJSON = JSON.parse(value);
            this.$emit("input", this.editorJSON);
          } catch (e) {
            this.$emit("input", value);
          }
        } else if (this.stagedJSON) {
          this.$emit("input", this.stagedJSON);
        }
      } else if (this.options.output_format === "md") {
        if (!this.rawView) {
          this.$emit("input", this.value);
        } else {
          let ghostHtml = this.convertHtml(this.editorHTML);
          this.editor.view.dom.innerHTML = ghostHtml;
          this.editorHTML = value;
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
          this.updateValue(this.editorJSON);
        }
      }

      if (this.options.output_format === "md") {
        if (this.rawView) {
          this.stagedMD = this.editorHTML;
        } else {
          this.editor.view.dom.innerHTML = this.convertHtml(this.editorHTML);
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

      this.editorHTML = this.value ? this.value : "";

      // Handle raw json data in for string schema type
      let stringifiedJson = null;
      if (this.type === "string" && this.value) {
        if (this.options.output_format === "json") {
          try {
            JSON.parse(this.value);
            this.editorJSON = JSON.parse(this.value);
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
              this.editorHTML = this.convertHtml(this.value);
            } catch (e) {
              console.warn("Could not Parse JSON or Markdown.");
            }
          }
        } else if (this.options.output_format === "md") {
          stringifiedJson = null;
          this.stagedMD = this.editorHTML;
          this.editorHTML = this.convertHtml(this.editorHTML);
        }
      }

      // Create Editor for JSON mode and  other Modes separated
      if (this.options.output_format === "json") {
        this.editor = new Editor({
          extensions: extensions,
          content: this.editorJSON,
          onUpdate: ({ getJSON }) => {
            this.editorJSON = getJSON();
            this.$emit("input", getJSON());
          }
        });
      } else {
        this.editor = new Editor({
          extensions: extensions,
          content: stringifiedJson ? stringifiedJson : this.editorHTML,
          onUpdate: ({ getHTML, getJSON }) => {
            this.stagedJSON = getJSON();
            if (this.type === "json") {
              this.$emit("input", this.stagedJSON);
            } else {
              if (this.options.output_format === "md") {
                if (this.rawView) {
                  this.$emit("input", this.editorHTML);
                } else {
                  this.convertMarkdown(getHTML());
                  this.$emit("input", this.stagedMD);
                }
              } else {
                this.$emit("input", getHTML());
              }
            }
          }
        });
      }
    }
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
