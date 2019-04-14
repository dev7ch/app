<template>
  <div
    class="interface-wysiwyg-container editor"
    :id="name"
    :name="name"
    @input="$emit('input', $event.target.innerHTML)"
  >
    <div class="editor__inner" :class="{ shrinked: showSource }">
      <!-- WYSIWYG Editor Menubar and Bubble components -->
      <Menubar
        :options="options"
        :table-position="!tablePosition ? { y: 0, x: 0 } : tablePosition"
        v-if="editor"
      />
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
    <br />
    <template v-if="selectionPosition.target">
      {{ selectionPosition.target.src }}
    </template>
    <template>
      <div
        class="image-options"
        v-if="selectionPosition.pos || selectionPosition.target"
      >
        <pre v-for="(pos, idx) in selectionPosition.pos" :key="idx">
          {{ pos }}
        </pre>
      </div>
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
        console.log(newVal);
        this.$emit("input", this.editorText);
      }
    }
  },

  methods: {
    init() {
      if (
        !this.options.toolbarOptions ||
        (this.options.toolbarOptions !== null &&
          this.options.toolbarOptions.length === 0)
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
        this.options.toolbarOptions.includes("Table")
          ? new TableHeader()
          : "disabled",
        this.options.toolbarOptions.includes("Table")
          ? new TableCell()
          : "disabled",
        this.options.toolbarOptions.includes("Table")
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
        content: this.value ? this.value : "",
        onUpdate: ({ getHTML }) => {
          this.$emit("input", getHTML());
        }
      });
    },

    updateText($text) {
      if (this.showSource) {
        this.editor.view.dom.innerHTML = this.editorText;
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
      codeMirrorOptions: {},
      tablePosition: null,
      selectionPosition: {
        pos: null,
        target: null
      },
      isImageSelection: false
    };
  },

  mounted() {
    this.init();
    this.observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (
          m.type === "attributes" &&
          m.target.localName === "img" &&
          m.target.src
        ) {
          //this.selectionPosition.target.className = 'dddd'
          this.selectionPosition = {
            pos: m.target.getBoundingClientRect(),
            target: m.target
          };
          this.isImageSelection = true;
          console.log(this.selectionPosition.target.classList);
        }
      }
    });

    if (this.$refs.editor.$el) {
      this.observer.observe(this.$refs.editor.$el, {
        nodeList: false,
        childList: true,
        subtree: true,
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["class"]
      });
    }
  },
  beforeDestroy() {
    this.editor.destroy();
    this.observer.disconnect();
  }
};
</script>

<style lang="scss">
@import "assets/scss/editor";
</style>

<style lang="scss" scoped>
.interface-wysiwyg-container {
  max-width: var(--width-x-large);
}

.material-icons {
  font-size: 20px;
}
</style>
