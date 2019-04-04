<template>
  <div
    class="interface-wysiwyg-container editor"
    :id="name"
    :name="name"
    @input="$emit('input', $event.target.innerHTML)"
  >
    <div class="editor__inner" :class="{ hidden: showSource }">
      <!-- WYSIWYG Editor Menubar and Bubble compontens -->

      <Menubar :options="options" v-if="editor" />
      <!-- WYSIWYG Editor  -->
      <editor-content
        id="wysiwyg-full"
        ref="editor"
        :class="['interface-wysiwyg', readonly ? 'readonly' : '']"
        class="editor__content"
        :editor="editor"
      />
    </div>
    <!-- Unformatted raw html view -->
    <RawHtmlView
      :id="name + '-raw'"
      :options="options"
      :show-source="showSource"
      :name="name"
    />
    <!-- raw html view toggler -->
    <p
      class="editor__button"
      @click="updateText(editor.view.dom.innerHTML)"
      v-html="showSource ? 'Show WYSIWYG' : 'Source Code'"
    ></p>
  </div>
</template>
<script>
import mixin from "@directus/extension-toolkit/mixins/interface";
import { Editor, EditorContent } from "tiptap";
import Menubar from "./components/Menubar";
import RawHtmlView from "./components/RawHtmlView";
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
        new Blockquote(),
        new BulletList(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3, 4, 5] }),
        new HorizontalRule(),
        new ListItem(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Bold(),
        new Image(),
        new Code(),
        new Italic(),
        new Link(),
        new Strike(),
        new Underline(),
        new History(),
        new Table(),
        new TableHeader(),
        new TableCell(),
        new TableRow()
      ];

      this.editor = new Editor({
        extensions: ext,
        content: ""
      });

      if (this.value) {
        this.editor.setContent(this.value);
      }
    },

    updateText($text) {
      if (this.showSource) {
        this.editor.setContent(this.editorText);
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
    }
  },
  components: {
    EditorContent,
    Menubar,
    RawHtmlView
  },

  data() {
    return {
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
