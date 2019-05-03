<template>
  <div
    class="interface-wysiwyg-container editor"
    :class="{ fullscreen: distractionFree, night: blackMode }"
    :id="name"
    :name="name"
    @input="$emit('input', $event.target.innerHTML)"
  >
    <!-- Bubble with Editor menu bar -->
    <Bubble
      :options="options"
      :editor="editor"
      :buttons="options.extensions"
      :show-source="showSource"
    />

    <!-- WYSIWYG Editor -->
    <EditorContent
      :parent-value="editorText"
      :update-value="updateValue"
      :raw-view="showSource"
      :editor="editor"
      :is-blackmode="blackMode"
      :is-fullscreen="distractionFree"
      @toggleImageEdit="showImageEdit = $event || !showImageEdit"
      @selectionIsImage="selectionIsImage = $event"
      :selection-position="selectionPosition"
      :selection-is-image="selectionIsImage"
    />

    <p
      class="fullscreen-info"
      v-if="$parent.$parent.field.name && distractionFree"
      v-show="!showSource"
    >
      {{ $parent.$parent.field.name }}
    </p>

    <div class="options">
      <button
        @click="showSource = !showSource"
        type="button"
        class="back"
        v-tooltip="$t('interfaces-wysiwyg-go_back')"
      >
        <v-icon name="explore_off" />
      </button>
      <button
        v-if="distractionFree"
        type="button"
        class="black-mode"
        @click="blackMode = !blackMode"
        v-tooltip="$t('interfaces-wysiwyg-dark_mode')"
      >
        <v-icon :name="blackMode ? 'iso' : 'iso'" />
      </button>
      <button
        v-on:click="distractionFree = !distractionFree"
        type="button"
        class="fullscreen-toggle"
        v-tooltip="
          !distractionFree
            ? $t('interfaces-wysiwyg-distraction_free_mode')
            : $t('interfaces-wysiwyg-distraction_free_mode_exit')
        "
      >
        <v-icon :name="!distractionFree ? 'fullscreen' : 'cancel'" />
      </button>
    </div>
  </div>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";
import { Editor } from "tiptap";
import EditorContent from "./../wysiwyg-full/components/EditorContent";
const Bubble = () => import("./../wysiwyg-full/components/Bubble");

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

import { Image } from "./../wysiwyg-full/extensions";

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
        content: this.value ? this.value : "",
        onUpdate: ({ getHTML }) => {
          this.$emit("input", getHTML());
        }
      });
    },
    updateValue(value) {
      this.$emit("input", value);
      this.editor.view.dom.innerHTML = value;
    }
  },
  components: {
    EditorContent,
    Bubble
  },
  data() {
    return {
      blackMode: false,
      distractionFree: false,
      editorExtensions: [],
      selectionIsImage: false,
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

  &.fullscreen {
    position: fixed;
    top: 31px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    max-width: 100%;
    max-height: 100%;
    background-color: var(--body-background);
    transition: background-color 0.4s ease-in-out, color 0.3s ease-in-out,
      border-bottom 0.35s ease-in-out;

    .editor__content {
      min-height: 100vh;
      textarea {
        min-height: inherit;
      }
    }
    .raw-editor {
      min-height: 100vh;
    }
    &:after {
      transition: inherit;
      content: "";
      z-index: -1;
      position: absolute;
      top: -33px;
      width: 100%;
      height: 35px;
      background-color: var(--body-background);
    }
    &.night {
      &:after {
        background-color: var(--black);
      }
    }
  }
}

.options {
  position: absolute;
  z-index: 9;
  right: 0;
  top: 7px;

  .back {
    float: left;
  }
  > button {
    min-width: 40px;
  }
}

.fullscreen-info {
  position: absolute;
  padding-left: 10px;
  top: -24px;
  z-index: 1;
  width: 100%;
  min-height: 24px;
  max-width: 100%;
  border-bottom: 1px solid var(--lightest-gray);
  font-size: var(--size-2);
  padding-bottom: 6px;
  color: var(--darkest-gray);
  transition: background-color 0.4s ease-in-out, color 0.3s ease-in-out,
    border-bottom 0.35s ease-in-out;
}
</style>
