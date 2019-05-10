<template>
  <div
    class="interface-wysiwyg-container editor"
    :class="{ fullscreen: distractionFree, night: blackMode }"
    :id="name"
    :name="name"
  >
    <!-- Bubble with Editor menu bar -->

    <!-- WYSIWYG Editor -->
    <EditorContent
      :parent-value="editorText ? editorText : value"
      :update-value="updateValue"
      :show-source="rawView"
      :editor="editor"
      :is-blackmode="blackMode"
      :is-fullscreen="distractionFree"
    />

    <Bubble
      :options="options"
      :editor="editor"
      :buttons="options.extensions"
      :show-source="rawView"
      :toggle-source="showSource"
      :show-link="linkBubble"
      :toggle-link="toggleLinkBar"
    />

    <p class="fullscreen-info" v-if="$parent.$parent.field.name && distractionFree">
      {{ $parent.$parent.field.name }}
    </p>

    <div class="options">
      <button
        v-if="rawView"
        @click="showSource"
        type="button"
        class="back"
        v-tooltip="$t('interfaces-wysiwyg-go_back')"
      >
        <v-icon name="code" />
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
  TableHeader,
  TableRow,
  TableCell
} from "tiptap-extensions";

import { Image, Table } from "./../wysiwyg-full/extensions";

export default {
  name: "interface-wysiwyg",
  mixins: [mixin],
  watch: {
    value(newVal) {
      if (newVal && !this.rawView) {
        this.editorText = newVal;
      } else {
        this.$emit("input", this.editorText);
      }
    }
  },
  methods: {
    toggleLinkBar() {
      return (this.linkBubble = !this.linkBubble);
    },
    showSource() {
      if (!this.rawView) {
        this.updateValue(this.editor.view.dom.innerHTML);
      } else {
        this.updateValue(this.editorText);
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
      this.editorText = value;
      if (this.editorText !== this.editor.view.dom.innerHTML) {
        this.editor.view.dom.innerHTML = value;
      }
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
      editorText: "",
      editor: null,
      rawView: false,
      linkBubble: false,
      selectionPosition: {
        pos: null,
        editorPos: null,
        alt: {
          value: null
        },
        title: null,
        src: null,
        target: null
      }
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
  --wysiwyg-padding: calc(var(--page-padding) / 2);
  border: var(--input-border-width) solid var(--lighter-gray);
  border-radius: var(--border-radius);
  -webkit-transition: border-color var(--fast) var(--transition);
  transition: border-color var(--fast) var(--transition), background-color var(--slow) ease-in-out,
    color var(--fast) ease-in-out;

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
      background-color: var(--darkest-gray);
    }
    &.night {
      &:after {
        background-color: var(--black);
      }

      .fullscreen-info {
        background-color: var(--darkest-gray);
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
  top: -48px;
  z-index: 1;
  width: 100%;
  padding-top: 24px;
  min-height: 24px;
  max-width: 100%;
  font-size: var(--size-2);
  padding-bottom: 6px;
  color: var(--darkest-gray);
  background-color: var(--body-background);
  transition: background-color var(--slow) ease-in-out, color var(--fast) ease-in-out,
    border-bottom 0.3s ease-in-out;
}
</style>
