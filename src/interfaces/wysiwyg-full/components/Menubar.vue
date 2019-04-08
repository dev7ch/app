<template>
  <div class="menubar__wrapper">
    <editor-menu-bar :editor="$parent.editor">
      <div
        class="menubar"
        slot-scope="{ commands, isActive }"
        :class="{
          'options-is-open': $parent.options.toolbarOptions.includes('Table')
            ? isActive.table()
            : false
        }"
      >
        <button
          v-if="$parent.options.toolbarOptions.includes('Bold')"
          class="menubar__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
          :style="{ order: $parent.options.toolbarOptions.indexOf('Bold') }"
        >
          <icon name="format_bold" />
        </button>

        <button
          v-if="$parent.options.toolbarOptions.includes('Italic')"
          class="menubar__button"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
          :style="{ order: $parent.options.toolbarOptions.indexOf('Italic') }"
        >
          <icon name="format_italic" title="Italic" />
        </button>

        <button
          v-if="$parent.options.toolbarOptions.includes('Strike')"
          class="menubar__button"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
          :style="{ order: $parent.options.toolbarOptions.indexOf('Strike') }"
        >
          <icon name="format_strikethrough" />
        </button>

        <button
          class="menubar__button"
          v-if="$parent.options.toolbarOptions.includes('Underline')"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
          :style="{
            order: $parent.options.toolbarOptions.indexOf('Underline')
          }"
        >
          <icon name="format_underline" />
        </button>

        <button
          v-if="$parent.options.toolbarOptions.includes('Code')"
          class="menubar__button"
          :class="{ 'is-active': isActive.code() }"
          @click="commands.code"
          :style="{ order: $parent.options.toolbarOptions.indexOf('Code') }"
        >
          <icon name="code" />
        </button>

        <button
          v-if="$parent.options.toolbarOptions.includes('CodeBlock')"
          class="menubar__button"
          :class="{ 'is-active': isActive.code_block() }"
          @click="commands.code_block"
          :style="{
            order: $parent.options.toolbarOptions.indexOf('CodeBlock')
          }"
        >
          <icon name="settings_ethernet" />
        </button>

        <button
          v-if="$parent.options.toolbarOptions.includes('Paragraph')"
          class="menubar__button"
          :class="{ 'is-active': isActive.paragraph() }"
          @click="commands.paragraph"
          :style="{
            order: $parent.options.toolbarOptions.indexOf('Paragraph')
          }"
        >
          <icon name="subject" />
        </button>

        <button
          v-show="$parent.options.toolbarOptions.includes('h1')"
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
          :style="{ order: $parent.options.toolbarOptions.indexOf('h1') }"
        >
          <span class="label">H1</span>
          <icon name="crop_square" />
        </button>

        <button
          v-show="$parent.options.toolbarOptions.includes('h2')"
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
          :style="{ order: $parent.options.toolbarOptions.indexOf('h2') }"
        >
          <span class="label">H2</span>
          <icon name="crop_square" />
        </button>

        <button
          v-show="$parent.options.toolbarOptions.includes('h3')"
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
          :style="{ order: $parent.options.toolbarOptions.indexOf('h3') }"
        >
          <span class="label">H3</span>
          <icon name="crop_square" />
        </button>

        <button
          v-if="$parent.options.toolbarOptions.includes('BulletList')"
          class="menubar__button"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
          :style="{
            order: $parent.options.toolbarOptions.indexOf('BulletList')
          }"
        >
          <icon name="format_list_bulleted" />
        </button>

        <button
          v-if="$parent.options.toolbarOptions.includes('OrderedList')"
          class="menubar__button"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
          :style="{
            order: $parent.options.toolbarOptions.indexOf('OrderedList')
          }"
        >
          <icon name="format_list_numbered" />
        </button>

        <button
          v-if="$parent.options.toolbarOptions.includes('Blockquote')"
          class="menubar__button"
          :class="{ 'is-active': isActive.blockquote() }"
          @click="commands.blockquote"
          :style="{
            order: $parent.options.toolbarOptions.indexOf('Blockquote')
          }"
        >
          <icon name="format_quote" />
        </button>

        <button
          v-if="$parent.options.toolbarOptions.includes('Link')"
          class="menubar__button"
          :class="{ 'is-active': linkBubble }"
          @click="setLink()"
          :style="{ order: $parent.options.toolbarOptions.indexOf('Link') }"
        >
          <icon name="link" />
        </button>
        <button
          v-if="$parent.options.toolbarOptions.includes('Image')"
          class="menubar__button"
          @click="chooseImage = !chooseImage"
          :style="{ order: $parent.options.toolbarOptions.indexOf('Image') }"
        >
          <icon name="image" />
        </button>
        <button
          v-if="$parent.options.toolbarOptions.includes('Table')"
          class="menubar__button"
          :class="{ 'is-active': isActive.table() }"
          :style="{ order: $parent.options.toolbarOptions.indexOf('Table') }"
          @click="
            commands.createTable({
              rowsCount: 3,
              colsCount: 3,
              withHeaderRow: false
            })
          "
        >
          <icon name="table_chart" />
        </button>
        <div
          class="options-fixed"
          v-if="
            $parent.options.toolbarOptions.includes('Table')
              ? isActive.table()
              : false
          "
          :class="{ 'is-open': isActive.table() }"
        >
          <button class="menubar__button" @click="commands.deleteTable">
            <span class="sup remove">
              <icon name="remove_circle" />
            </span>
            <icon name="table_chart" />
          </button>
          <button
            title="Insert before column"
            class="menubar__button"
            @click="commands.addColumnBefore"
          >
            <span class="sup add">
              <icon name="add_circle" />
            </span>
            <icon name="tab" />
          </button>
          <button
            title="Insert after column"
            class="menubar__button"
            @click="commands.addColumnAfter"
          >
            <span class="sup add">
              <icon name="add_circle" />
            </span>
            <icon name="tab" />
          </button>
          <button
            title="Delete column"
            class="menubar__button"
            @click="commands.deleteColumn"
          >
            <span class="sup remove">
              <icon name="remove_circle" />
            </span>
            <icon name="tab" />
          </button>
          <button
            title="Add row before"
            class="menubar__button"
            @click="commands.addRowBefore"
          >
            <span class="sup add">
              <icon name="add_circle" />
            </span>
            <icon name="border_top" />
          </button>
          <button class="menubar__button" @click="commands.addRowAfter">
            <span class="sup add">
              <icon name="add_circle" />
            </span>
            <icon name="border_bottom" />
          </button>
          <button class="menubar__button" @click="commands.deleteRow">
            <span class="sup remove">
              <icon name="remove_circle" />
            </span>
            <icon name="border_horizontal" />
          </button>
          <button class="menubar__button" @click="commands.toggleCellMerge">
            <icon name="merge_type" />
          </button>
        </div>
        <button
          v-if="$parent.options.toolbarOptions.includes('HorizontalRule')"
          :style="{
            order: $parent.options.toolbarOptions.indexOf('HorizontalRule')
          }"
          class="menubar__button"
          @click="commands.horizontal_rule"
        >
          <icon name="maximize" />
        </button>
        <div
          class="history__actions"
          v-if="$parent.options.toolbarOptions.includes('History')"
          :style="{
            order: $parent.options.toolbarOptions.indexOf('History')
          }"
        >
          <button class="menubar__button" @click="commands.undo">
            <icon name="undo" />
          </button>
          <button class="menubar__button" @click="commands.redo">
            <icon name="redo" />
          </button>
        </div>
        <button
          class="menubar__button toggler"
          @click="
            $parent.updateText($parent.editor.view.dom.innerHTML),
              ($parent.showSource = !$parent.showSource)
          "
          v-html="$parent.showSource ? 'WYSIWYG' : 'Code'"
          :style="{
            order: 99
          }"
        ></button>
      </div>
    </editor-menu-bar>
    <Bubble
      :options="options"
      :editor="$parent.editor"
      :class="{ visible: linkBubble }"
    />
    <!-- image selection modal interface  -->
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
import { EditorMenuBar } from "tiptap";
import Icon from "./Icon";
import Bubble from "./Bubble";

export default {
  props: {
    options: {
      type: Object,
      defaultValue: {}
    },
    editor: {
      type: Object,
      defaultValue: {}
    },
    showSource: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      linkUrl: null,
      linkBubble: false,
      chooseImage: false,
      imageUrlRaw: "",
      imageUrlRawBroken: false,
      viewOptions: {
        title: "title",
        subtitle: "type",
        content: "description",
        src: "data"
      }
    };
  },

  methods: {
    setLink() {
      this.linkBubble = !this.linkBubble;
    },

    addImageCommand(data) {
      if (data.command !== null || data.command !== "data") {
        this.$parent.editor.commands.image({
          src: data
        });

        this.chooseImage = false;
      }
    },

    insertItem(item) {
      let url = item.data.full_url;
      if (this.$parent.options.custom_url) {
        url = `${this.$parent.options.custom_url}${item.filename}`;
      }
      // @todo implement image source base url
      // const index = (this.editor.getSelection() || {}).index || this.editor.getLength();
      this.addImageCommand(url);
    },

    insertImageUrl(url) {
      if (url !== "") {
        this.chooseImage = false;
        this.addImageCommand(url);
      }
    }
  },
  components: {
    EditorMenuBar,
    Icon,
    Bubble
  }
};
</script>
<style lang="scss" scoped>
.menubar__wrapper {
  border: var(--input-border-width) solid var(--lighter-gray);
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  color: var(--gray);
  background-color: var(--lightest-gray);
  transition: var(--fast) var(--transition);
  transition-property: color, border-color;
  margin-bottom: -5px;
  padding-top: 0;

  .toggler {
    margin-left: auto;
    padding-right: 5px;
    transform: translateY(-2px);
  }
}
</style>
