<template>
  <div class="menubar">
    <editor-menu-bar :editor="editor">
      <div class="buttons" slot-scope="{ commands, isActive }">
        <button
          v-if="buttons.includes('bold')"
          v-tooltip.bottom="$t('editor.bold')"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <v-icon name="format_bold" />
        </button>

        <button
          v-if="buttons.includes('italic')"
          v-tooltip.bottom="$t('editor.italic')"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <v-icon name="format_italic" />
        </button>

        <button
          v-if="buttons.includes('strike')"
          v-tooltip.bottom="$t('editor.strike')"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        >
          <v-icon name="format_strikethrough" />
        </button>

        <button
          v-if="buttons.includes('underline')"
          v-tooltip.bottom="$t('editor.underline')"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <v-icon name="format_underline" />
        </button>

        <button
          v-if="buttons.includes('code')"
          v-tooltip.bottom="$t('editor.code')"
          :class="{ 'is-active': isActive.code() }"
          @click="commands.code"
        >
          <v-icon name="code" />
        </button>

        <button
          v-if="buttons.includes('code_block')"
          v-tooltip.bottom="$t('editor.code_block')"
          :class="{ 'is-active': isActive.code_block() }"
          @click="commands.code_block"
        >
          <v-icon name="code" />
        </button>

        <button
          v-if="buttons.includes('bullet_list')"
          v-tooltip.bottom="$t('editor.bullet_list')"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <v-icon name="format_list_bulleted" />
        </button>

        <button
          v-if="buttons.includes('ordered_list')"
          v-tooltip.bottom="$t('editor.ordered_list')"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >
          <v-icon name="format_list_numbered" />
        </button>

        <button
          v-if="buttons.includes('blockquote')"
          v-tooltip.bottom="$t('editor.blockquote')"
          :class="{ 'is-active': isActive.blockquote() }"
          @click="commands.blockquote"
        >
          <v-icon name="format_quote" />
        </button>

        <button
          v-if="buttons.includes('link')"
          v-tooltip.bottom="$t('editor.link')"
          :class="{ 'is-active': linkActive }"
          @click="linkActive = !linkActive"
        >
          <v-icon name="link" />
        </button>

        <button
          v-if="buttons.includes('image')"
          v-tooltip.bottom="$t('editor.image')"
          :class="{ 'is-active': isActive.image() }"
          @click="chooseImage = !chooseImage"
        >
          <v-icon name="image" />
        </button>

        <template v-for="n in 6">
          <button
            v-if="buttons.includes('h' + n)"
            v-tooltip.bottom="$tc('editor.heading', { level: n })"
            :key="n"
            :class="{ 'is-active': isActive.heading({ level: n }) }"
            @click="commands.heading({ level: n })"
          >
            H{{ n }}
          </button>
        </template>

        <button
          v-if="buttons.includes('horizontal_rule')"
          v-tooltip.bottom="$t('editor.horizontal_rule')"
          :class="{ 'is-active': isActive.horizontal_rule() }"
          @click="commands.horizontal_rule"
        >
          <v-icon name="maximize" />
        </button>

        <button
          v-if="buttons.includes('table')"
          v-tooltip.bottom="$t('editor.table')"
          :class="{ 'is-active': isActive.table() }"
          @click="
            commands.createTable({
              rowsCount: 3,
              colsCount: 3,
              withHeaderRow: false
            })
          "
        >
          <v-icon name="table_chart" />
        </button>

        <div
          class="table-bar"
          v-if="buttons.includes('table')"
          :class="{ 'is-open': isActive.table() }"
        >
          <button v-tooltip.top="$t('editor.table_remove')" @click="commands.deleteTable">
            <v-icon name="delete" />
          </button>

          <button
            v-tooltip.top="$t('editor.table_add_column_before')"
            @click="commands.addColumnBefore"
          >
            <v-icon name="border_left" />
            <v-icon name="add" class="sub" />
          </button>

          <button
            v-tooltip.top="$t('editor.table_add_column_after')"
            @click="commands.addColumnAfter"
          >
            <v-icon name="border_right" />
            <v-icon name="add" class="sub" />
          </button>

          <button v-tooltip.top="$t('editor.table_delete_column')" @click="commands.deleteColumn">
            <v-icon name="border_outer" />
            <v-icon name="remove" class="sub" />
          </button>

          <button v-tooltip.top="$t('editor.table_add_row_before')" @click="commands.addRowBefore">
            <v-icon name="border_top" />
            <v-icon name="add" class="sub" />
          </button>

          <button v-tooltip.top="$t('editor.table_add_row_after')" @click="commands.addRowAfter">
            <v-icon name="border_bottom" />
            <v-icon name="add" class="sub" />
          </button>

          <button v-tooltip.top="$t('editor.table_delete_row')" @click="commands.deleteRow">
            <v-icon name="border_horizontal" />
            <v-icon name="remove" class="sub" />
          </button>

          <button v-tooltip.top="$t('editor.table_merge_cells')" @click="commands.toggleCellMerge">
            <v-icon name="merge_type" />
          </button>
        </div>

        <div class="spacer" />

        <div class="history" v-if="buttons.includes('history')">
          <button v-tooltip.bottom="$t('editor.undo')" @click="commands.undo">
            <v-icon name="undo" />
          </button>
          <button v-tooltip.bottom="$t('editor.redo')" @click="commands.redo">
            <v-icon name="redo" />
          </button>
        </div>

        <button class="source-toggle" @click="$emit('toggleSource')">
          <v-icon name="code" :color="$parent.showSource ? 'accent' : 'light-gray'" />
        </button>
      </div>
    </editor-menu-bar>

    <!-- editor bubble for link interface -->
    <LinkBar :editor="editor" v-if="buttons.includes('link') && linkActive" />

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
        <div class="interface-wysiwyg-modal-url-input" :class="{ 'is-active': imageUrlRaw }">
          <v-input
            v-model="imageUrlRaw"
            placeholder="Paste url to image or select an existing"
            @input="imageUrlRawBroken = false"
          ></v-input>
          <div class="interface-wysiwyg-modal-url-preview" v-if="imageUrlRaw">
            <v-icon
              v-if="imageUrlRawBroken"
              class="material-icons error icon"
              name="broken_image"
            ></v-icon>
            <img
              v-else
              :src="imageUrlRaw"
              alt="preview-url-image"
              class="image"
              @error="imageUrlRawBroken = true"
            />
          </div>
        </div>
        <!-- @todo make selection better (sorting, file selection, multiples, file upload, upload path) -->
        <v-items
          v-if="imageUrlRaw === ''"
          collection="directus_files"
          view-type="cards"
          :filters="viewOptions.defaultFilters"
          :selection="[]"
          :view-options="viewOptions"
          @select="insertItem($event[0])"
        ></v-items>
      </v-modal>
    </portal>
  </div>
</template>
<script>
import { EditorMenuBar } from "tiptap";
import LinkBar from "./LinkBar";

export default {
  props: {
    buttons: {
      type: Array,
      required: true
    },
    editor: {
      type: Object,
      defaultValue: {}
    }
  },
  data() {
    return {
      showSource: false,
      linkUrl: null,
      linkActive: false,
      chooseImage: false,
      imageUrlRaw: "",
      imageUrlRawBroken: false,
      viewOptions: {
        title: "title",
        subtitle: "type",
        content: "description",
        src: "data",
        defaultFilters: [
          {
            field: "type",
            operator: "contains",
            value: "image"
          }
        ]
      }
    };
  },

  methods: {
    addImageCommand(data) {
      if (data.command !== null || data.command !== "data") {
        this.$parent.editor.commands.image({
          src: data
        });

        this.chooseImage = false;
      }
    },
    insertItem(item) {
      this.addImageCommand(item);
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
    LinkBar
  }
};
</script>

<style lang="scss" scoped>
.menubar {
  border-bottom: var(--input-border-width) solid var(--lighter-gray);
  color: var(--gray);
  background-color: var(--off-white);
  transition: var(--fast) var(--transition);
  transition-property: color, border-color;
  padding-top: 0;
}

.buttons {
  min-height: 34px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

button {
  color: var(--gray);
  width: 34px;
  height: 34px;
  font-weight: var(--weight-2);
  position: relative;
}

button.is-active {
  color: var(--darkest-gray);
}

.sub {
  position: absolute;
  left: 1px;
  bottom: 2px;
  background-color: var(--off-white);
  border-radius: 50%;
  width: 12px;
  height: 12px;
  font-size: 12px !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spacer {
  flex-grow: 1;
}

.table-bar {
  position: absolute;
  opacity: 0;
  z-index: 1;
  background-color: var(--off-white);
  width: 100%;
  border-top: var(--input-border-width) solid var(--lighter-gray);
  border-color: var(--lighter-gray);
  color: var(--gray);
  left: 0;
  transition: var(--fast) var(--transition);
  transition-property: color, border-color;
  bottom: 0;
  pointer-events: none;

  &.is-open {
    pointer-events: auto;
    opacity: 1;
  }
}

.toggler {
  height: 31px;
  width: 31px;
  text-align: center;
  margin-left: auto;
}

.history__actions {
  display: inline-flex;
  margin-left: auto;

  + .toggler {
    margin-left: initial;
  }
}

.editor__button {
  cursor: pointer;
}

.modal-container {
  .interface-wysiwyg-modal-url-input {
    margin: var(--page-padding);

    &.is-active {
      height: 100%;
    }
  }

  .interface-wysiwyg-modal-url-preview {
    height: inherit;
    padding-top: 20px;
    max-height: 100%;
    img {
      max-width: 100%;
    }

    .error {
      margin: auto;
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -100%);
      font-size: 90px;
      color: var(--lightest-gray);
    }
  }
}
</style>
