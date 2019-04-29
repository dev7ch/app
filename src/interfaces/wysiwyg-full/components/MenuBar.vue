<template>
  <div class="menubar__wrapper">
    <editor-menu-bar :editor="$parent.editor">
      <div
        class="menubar"
        slot-scope="{ commands, isActive }"
        :class="{
          'options-is-open': optionsInclude('Table') ? isActive.table() : false
        }"
      >
        <MenuButton
          v-if="optionsInclude('Bold')"
          plugin-name="Bold"
          icon="format_bold"
          :command="commands.bold"
          :active-condition="isActive.bold()"
          :disabled="!!$parent.showSource"
        ></MenuButton>
        <MenuButton
          v-if="optionsInclude('Italic')"
          plugin-name="Italic"
          icon="format_italic"
          :command="commands.italic"
          :active-condition="isActive.italic()"
          :disabled="!!$parent.showSource"
        />
        <MenuButton
          v-if="optionsInclude('Strike')"
          plugin-name="Strike"
          icon="format_strikethrough"
          :command="commands.strike"
          :active-condition="isActive.strike()"
          :disabled="!!$parent.showSource"
        />

        <MenuButton
          v-if="optionsInclude('Underline')"
          plugin-name="Underline"
          icon="format_underline"
          :command="commands.underline"
          :active-condition="isActive.underline()"
          :disabled="!!$parent.showSource"
        />

        <MenuButton
          v-if="optionsInclude('Code')"
          plugin-name="Code"
          icon="code"
          :command="commands.code"
          :active-condition="isActive.code()"
          :disabled="!!$parent.showSource"
        />

        <MenuButton
          v-if="optionsInclude('CodeBlock')"
          plugin-name="CodeBlock"
          icon="code"
          :command="commands.code_block"
          :active-condition="isActive.code_block()"
          :disabled="!!$parent.showSource"
        />

        <MenuButton
          v-if="optionsInclude('Paragraph')"
          plugin-name="Paragraph"
          icon="subject"
          :command="commands.paragraph"
          :active-condition="isActive.paragraph()"
          :disabled="!!$parent.showSource"
        />

        <MenuButton
          v-if="optionsInclude('BulletList')"
          plugin-name="BulletList"
          icon="format_list_bulleted"
          :command="commands.bullet_list"
          :active-condition="isActive.bullet_list()"
          :disabled="!!$parent.showSource"
        />

        <MenuButton
          v-if="optionsInclude('OrderedList')"
          plugin-name="OrderedList"
          icon="format_list_numbered"
          :command="commands.ordered_list"
          :active-condition="isActive.ordered_list()"
          :disabled="!!$parent.showSource"
        />
        <MenuButton
          v-if="optionsInclude('Blockquote')"
          plugin-name="Blockquote"
          icon="format_quote"
          :command="commands.blockquote"
          :active-condition="isActive.blockquote()"
          :disabled="!!$parent.showSource"
        />

        <MenuButton
          v-if="optionsInclude('Link')"
          plugin-name="Link"
          icon="link"
          :command="setLink"
          :active-condition="linkBubble"
          :disabled="!!$parent.showSource"
        />

        <MenuButton
          v-if="optionsInclude('Image')"
          plugin-name="Image"
          icon="image"
          :command="() => (chooseImage = !chooseImage)"
          :active-condition="chooseImage"
          :disabled="!!$parent.showSource"
        />
        <template v-for="n in 6">
          <MenuButton
            :key="n"
            v-if="optionsInclude('h' + n)"
            :plugin-name="'h' + n"
            icon="crop_square"
            :label="'H' + n"
            :command="() => commands.heading({ level: n })"
            :active-condition="isActive.heading({ level: n })"
            :disabled="!!$parent.showSource"
          />
        </template>

        <MenuButton
          v-if="optionsInclude('HorizontalRule')"
          plugin-name="HorizontalRule"
          icon="maximize"
          :command="commands.horizontal_rule"
          :disabled="!!$parent.showSource"
        />
        <!-- table and table toolbar -->
        <MenuButton
          v-if="optionsInclude('Table')"
          plugin-name="Table"
          icon="table_chart"
          :command="
            () =>
              commands.createTable({
                rowsCount: 3,
                colsCount: 3,
                withHeaderRow: false
              })
          "
          :active-condition="isActive.table()"
          :disabled="!!$parent.showSource"
        />

        <div
          class="options-fixed"
          v-if="optionsInclude('Table') && !$parent.showSource ? isActive.table() : false"
          :class="{ 'is-open': isActive.table() }"
        >
          <MenuButton
            v-if="optionsInclude('Table')"
            plugin-name="Table"
            icon="table_chart"
            :command="commands.deleteTable"
            sup-type="remove"
          />

          <MenuButton
            v-if="optionsInclude('Table')"
            plugin-name="Table"
            icon="border_left"
            :command="commands.addColumnBefore"
            sup-type="add"
          />

          <MenuButton
            v-if="optionsInclude('Table')"
            plugin-name="Table"
            icon="border_right"
            sup-type="add"
            :command="commands.addColumnAfter"
          />

          <MenuButton
            v-if="optionsInclude('Table')"
            plugin-name="Table"
            icon="border_outer"
            sup-type="remove"
            :command="commands.deleteColumn"
          />

          <MenuButton
            v-if="optionsInclude('Table')"
            plugin-name="Table"
            icon="border_top"
            sup-type="add"
            :command="commands.addRowBefore"
          />

          <MenuButton
            v-if="optionsInclude('Table')"
            plugin-name="Table"
            icon="border_bottom"
            sup-type="add"
            :command="commands.addRowAfter"
          />

          <MenuButton
            v-if="optionsInclude('Table')"
            plugin-name="Table"
            icon="border_horizontal"
            sup-type="remove"
            :command="commands.deleteRow"
          />

          <MenuButton
            v-if="optionsInclude('Table')"
            plugin-name="Table"
            icon="merge_type"
            :command="commands.toggleCellMerge"
          />
        </div>
        <!-- history -->
        <div
          class="history__actions"
          v-if="optionsInclude('History')"
          :style="{
            order: optionsIndex('History')
          }"
        >
          <MenuButton
            v-if="optionsInclude('History')"
            class="menubar__button"
            icon="undo"
            :command="commands.undo"
            :disabled="!!$parent.showSource"
          />
          <MenuButton
            v-if="optionsInclude('History')"
            class="menubar__button"
            icon="redo"
            :command="commands.redo"
            :disabled="!!$parent.showSource"
          />
        </div>
        <!-- menu raw view toggler -->
        <button
          v-if="!$props.editor"
          class="menubar__button toggler"
          @click="$parent.updateText($parent.editor.view.dom.innerHTML)"
          :style="{
            order: 999
          }"
        >
          <v-icon name="explore" v-if="!$parent.showSource" />
          <v-icon v-else name="explore_off" />
        </button>
        <button
          v-else-if="$props.editor"
          class="menubar__button toggler"
          @click="updates.updateText(updates.editor.view.dom.innerHTML)"
          :style="{
            order: 999
          }"
        >
          <v-icon name="explore" v-if="!updates.showSource" />
          <v-icon v-else name="explore_off" />
        </button>
      </div>
    </editor-menu-bar>
    <!-- editor bubble for link interface -->
    <LinkBubble :options="options" :editor="$parent.editor" :class="{ visible: linkBubble }" />
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
import MenuButton from "./MenuBarButton";
import { EditorMenuBar } from "tiptap";
import LinkBubble from "./LinkBubble";

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
    updates: {
      type: Object,
      defaultValue: null
    }
  },
  data() {
    return {
      showSource: false,
      linkUrl: null,
      linkBubble: false,
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
    setLink() {
      this.linkBubble = !this.linkBubble;
    },
    optionsInclude($val) {
      return this.$props.options.toolbarOptions.includes($val);
    },
    optionsIndex($val) {
      return this.$props.options.toolbarOptions.indexOf($val);
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
      if (this.$props.options.custom_url) {
        url = `${this.$props.options.custom_url}${item.filename}`;
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
    MenuButton,
    LinkBubble
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

  .menubar {
    min-height: 34px;
    display: flex;
    flex-flow: row wrap;
    &.options-is-open {
      + .editor__content {
        //padding-top: 42px;
      }
    }
  }
}

.options-fixed {
  position: absolute;
  margin-bottom: -2px;
  transform: translateY(-100%);
  opacity: 0;
  z-index: 1;
  background-color: var(--lightest-gray);
  width: 100%;
  border: var(--input-border-width) solid var(--lighter-gray);
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  border-bottom-color: var(--lighter-gray);
  color: var(--gray);
  left: 0;
  transition: var(--fast) var(--transition);
  transition-property: color, border-color;

  .menubar__button {
    margin-left: 1px;
    position: relative;
  }
  &.is-open {
    opacity: 1;
  }
}

.toggler {
  height: 31px;
  width: 31px;

  text-align: center;
  margin-left: auto;
  border-bottom-left-radius: 50%;
  border-top-left-radius: 50%;
  border: var(--input-border-width) solid var(--lightest-gray);
  transition: background-color ease-in-out 0.2s, color 0.15s ease-in-out;
  background-color: var(--lightest-gray);
  color: var(--gray);

  &:hover,
  &:focus {
    color: var(--white);
    background-color: var(--action);
  }
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

.layout-cards {
  .toolbar {
    display: none !important;
  }

  .cards {
    padding-top: 0;
  }
  max-height: calc(100% - 128px);
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
