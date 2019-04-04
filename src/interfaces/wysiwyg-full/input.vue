<template>
  <div
    class="interface-wysiwyg-container editor"
    :id="name"
    :name="name"
    @input="$emit('input', $event.target.innerHTML)"
  >
    <div class="editor__inner" :class="{ hidden: showSource }">
      <Menubar :options="options" :editor="editor" />

      <editor-content
        ref="editor"
        :class="['interface-wysiwyg', readonly ? 'readonly' : '']"
        class="editor__content"
        :editor="editor"
      />
    </div>
    <div class="editor__raw" v-show="showSource">
      <v-textarea
        v-if="showSource && showRaw"
        v-model.lazy="editorText"
        class="textarea"
        :id="name"
        :value="editor.view.dom.innerHTML"
        :placeholder="options.placeholder"
        :rows="options.rows ? +options.rows : 10"
      ></v-textarea>

      <CodeMirror
        :placeholder="options.placeholder"
        class="textarea"
        v-if="showSource && !showRaw"
        :alt-options="options.codeMirrorOptions"
        :value="editor.view.dom.innerHTML"
        v-model.lazy="editorText"
        :name="'htmlmixed'"
        type="textarea"
      >
      </CodeMirror>

      <div
        class="editor__rawformat"
        v-if="showSource"
        @click="showRaw = !showRaw"
      >
        <span
          :style="{ color: !showRaw ? 'var(--accent)' : 'var(--light-gray)' }"
          >formatted</span
        >
        |
        <span
          :style="{ color: showRaw ? 'var(--accent)' : 'var(--light-gray)' }"
          >unformatted</span
        >
      </div>
    </div>
    <p
      class="editor__button"
      @click="updateText(editor.view.dom.innerHTML)"
      v-html="showSource ? 'Show WYSIWYG' : 'Source Code'"
    ></p>

    <portal to="modal" v-if="chooseImage">
      <v-modal
        ref="imageModal"
        :title="$t('choose_one')"
        :buttons="{
          done: {
            text: $t('done'),
            disabled: !imageUrlRaw || (imageUrlRaw && imageUrlRawBroken)
          }
        }"
        @close="chooseImage = false"
        @done="insertImageUrl(imageUrlRaw)"
      >
        <div
          class="interface-wysiwyg-modal-url-input"
          :class="{ 'is-active': imageUrlRaw }"
        >
          <v-input
            v-model="imageUrlRaw"
            placeholder="Paste url to image or select an existing"
            @input="imageUrlRawBroken = false"
          ></v-input>
          <div class="interface-wysiwyg-modal-url-preview" v-if="imageUrlRaw">
            <i v-if="imageUrlRawBroken" class="material-icons error icon"
              >broken_image</i
            >
            <img
              v-else
              :src="imageUrlRaw"
              alt="preview-url-image"
              class="image"
              @error="imageUrlRawBroken = true"
            />
          </div>
        </div>
        <v-items
          v-if="imageUrlRaw === ''"
          collection="directus_files"
          view-type="cards"
          :selection="[]"
          :view-options="viewOptions"
          @select="insertItem($event[0])"
        >
        </v-items>
      </v-modal>
    </portal>
  </div>
</template>
<script>
import mixin from "@directus/extension-toolkit/mixins/interface";
import { Editor, EditorContent } from "tiptap";
import Menubar from "./components/Menubar";
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

import CodeMirror from "../code/input";

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
        new Heading({ levels: [1, 2, 3] }),
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

    addImageCommand(data) {
      if (data.command !== null || data.command !== "data") {
        this.editor.commands.image({
          src: data
        });

        this.chooseImage = false;
      }
    },

    insertItem(item) {
      let url = item.data.full_url;
      if (this.options.custom_url) {
        url = `${this.options.custom_url}${item.filename}`;
      }
      // @todo implement image surce base url
      // const index = (this.editor.getSelection() || {}).index || this.editor.getLength();
      this.addImageCommand(url);
    },

    insertImageUrl(url) {
      if (url !== "") {
        this.chooseImage = false;
        this.addImageCommand(url);
      }
    },

    destroy() {
      this.editor.destroy();
    }
  },
  components: {
    EditorContent,
    Menubar,
    CodeMirror
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
      imageUrlRaw: "",
      imageUrlRawBroken: false,
      viewOptions: {
        title: "title",
        subtitle: "type",
        content: "description",
        src: "data"
      },
      lineCount: 0,
      codeMirrorOptions: {}
    };
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
