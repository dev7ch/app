<template>
  <div
    class="interface-wysiwyg-container editor"
    :class="{ fullscreen: distractionFree, night: blackMode }"
    :id="name"
    :name="name"
    @input="$emit('input', $event.target.innerHTML)"
  >
    <Bubble :options="options" :editor="editor" />
    <p
      class="fullscreen-info"
      v-if="$parent.$parent.field.name && distractionFree"
      v-show="!showSource"
    >
      {{ $parent.$parent.field.name }}
    </p>

    <div class="options">
      <button
        v-if="showSource"
        @click="updateText(editorText)"
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
        <v-icon name="filter_b_and_w" />
      </button>
      <button
        v-on:click="distractionFree = !distractionFree"
        type="button"
        class="fullscreen-toggle"
        v-tooltip="!distractionFree ? $t('interfaces-wysiwyg-distraction_free_mode') : false"
      >
        <v-icon :name="!distractionFree ? 'fullscreen' : 'close'" />
      </button>
    </div>
    <div class="editor__inner" :class="{ shrinked: showSource }" v-show="!showSource">
      <!-- WYSIWYG Editor  -->
      <editor-content
        id="wysiwyg"
        ref="editor"
        :class="[
          'interface-wysiwyg editor__content',
          readonly ? 'readonly' : '',
          { hidden: showSource }
        ]"
        :editor="editor"
        v-show="!showSource"
      />
      <div
        class="options-toggler"
        v-if="selectionPosition.target && hasSettings && !showSource"
        :class="{ active: hasSettings }"
        @click="isImageSelection = !isImageSelection"
        :style="{
          top: getTopPosition(selectionPosition.target),
          left: getLeftPosition(selectionPosition.target)
        }"
      >
        <v-icon name="settings"></v-icon>
      </div>
    </div>
    <template v-if="showSource">
      <RawHtmlView
        class="raw-editor"
        :id="name + '-raw'"
        :options="options"
        :show-source="showSource"
        :name="name"
        :editor="editor"
        :editor-text="editorText"
      />
    </template>
    <ImageEdit />
  </div>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";
import { Editor, EditorContent } from "tiptap";
const Bubble = () => import("./../wysiwyg-full/components/Bubble");
const RawHtmlView = () => import("./../wysiwyg-full/components/RawHtmlView");
import ImageEdit from "./../wysiwyg-full/components/ImageEdit";

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
    getTopPosition($elem) {
      let editorTop = this.$refs.editor.$el.getBoundingClientRect().top;
      if (editorTop) {
        return $elem.getBoundingClientRect().top
          ? $elem.getBoundingClientRect().top -
              editorTop +
              ($elem.getBoundingClientRect().height / 2 + 34) +
              "px"
          : "19px";
      }
    },
    getLeftPosition($elem) {
      return $elem.getBoundingClientRect().width
        ? $elem.getBoundingClientRect().width / 2 - 12 + "px"
        : "0";
    },
    init() {
      if (
        !this.options.toolbarOptions ||
        (this.options.toolbarOptions !== null && this.options.toolbarOptions.length === 0)
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
        this.options.toolbarOptions.includes("Blockquote") ? new Blockquote() : "disabled",
        this.options.toolbarOptions.includes("BulletList") ? new BulletList() : "disabled",
        this.options.toolbarOptions.includes("CodeBlock") ? new CodeBlock() : "disabled",
        this.options.toolbarOptions.includes("HardBreak") ? new HardBreak() : "disabled",
        new Heading({ levels: [1, 2, 3, 4, 5] }),
        this.options.toolbarOptions.includes("HorizontalRule") ? new HorizontalRule() : "disabled",
        this.options.toolbarOptions.includes("ListItem") ? new ListItem() : "disabled",
        this.options.toolbarOptions.includes("OrderedList") ? new OrderedList() : "disabled",
        this.options.toolbarOptions.includes("TodoItem") ? new TodoItem() : "disabled",
        this.options.toolbarOptions.includes("TodoList") ? new TodoList() : "disabled",
        this.options.toolbarOptions.includes("Bold") ? new Bold() : "disabled",
        this.options.toolbarOptions.includes("Image") ? new Image() : "disabled",
        this.options.toolbarOptions.includes("Code") ? new Code() : "disabled",
        this.options.toolbarOptions.includes("Italic") ? new Italic() : "disabled",
        this.options.toolbarOptions.includes("Link") ? new Link() : "disabled",
        this.options.toolbarOptions.includes("Strike") ? new Strike() : "disabled",
        this.options.toolbarOptions.includes("Underline") ? new Underline() : "disabled",
        this.options.toolbarOptions.includes("History") ? new History() : "disabled",
        this.options.toolbarOptions.includes("Table") ? new Table() : "disabled",
        this.options.toolbarOptions.includes("Table") ? new TableHeader() : "disabled",
        this.options.toolbarOptions.includes("Table") ? new TableCell() : "disabled",
        this.options.toolbarOptions.includes("Table") ? new TableRow() : "disabled"
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
      this.handleEditorScroll();
    },
    updateText($text) {
      if (this.showSource) {
        this.editor.view.dom.innerHTML = this.editorText;
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
    },
    handleEditorScroll() {
      this.editor.view.dom.onscroll = () => {
        this.hasSettings ? (this.hasSettings = false) : null;
      };
    }
  },
  components: {
    EditorContent,
    Bubble,
    RawHtmlView,
    ImageEdit
  },
  data() {
    return {
      blackMode: false,
      distractionFree: false,
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

  beforeUpdate() {
    this.observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.target.localName === "img") {
          this.selectionPosition = {
            title: m.target.attributes.title ? m.target.attributes.title.value : "",
            alt: m.target.attributes.alt ? m.target.attributes.alt.value : "",
            target: m.target,
            src: m.target.src,
            classes: m.target.className.includes("ProseMirror-selectednode")
              ? m.target.className.replace(/ProseMirror-selectednode/gi, "")
              : m.target.className,
            height: m.target.height,
            width: m.target.width
          };
          if (m.target.className.includes("ProseMirror-selectednode")) {
            this.hasSettings = true;
          }
        } else if (m.type === "childList") {
          this.isImageSelection = false;
          this.hasSettings = false;
        }
      }
    });
  },
  mounted() {
    this.init();
    this.$nextTick(function() {
      if (this.$refs.editor.$el) {
        this.observer.observe(this.$refs.editor.$el, {
          nodeList: false,
          childList: true,
          subtree: true,
          attributeFilter: ["class"]
        });
      }
    });
  },
  beforeDestroy() {
    this.editor.destroy();
    this.observer.disconnect();
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleEditorScroll);
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
.editor {
  position: relative;
  min-height: 220px;
  .editor__inner {
    min-height: inherit;

    &.shrinked {
      min-height: 0;
      .menubar__button:not(.toggler) {
        display: none;
      }
    }
    .editor__content {
      &.hidden {
        min-height: 0;
        display: none;
      }
    }
    img {
      max-width: 100%;
    }
  }
}
.options {
  position: absolute;
  z-index: 9;
  right: 10px;
  top: 10px;

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
