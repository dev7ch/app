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
        />
        <MenuButton
          v-if="optionsInclude('Italic')"
          plugin-name="Italic"
          icon="format_italic"
          :command="commands.italic"
          :active-condition="isActive.italic()"
        />
        <MenuButton
          v-if="optionsInclude('Strike')"
          plugin-name="Strike"
          icon="format_strikethrough"
          :command="commands.strike"
          :active-condition="isActive.strike()"
        />

        <MenuButton
          v-if="optionsInclude('Underline')"
          plugin-name="Underline"
          icon="format_underline"
          :command="commands.underline"
          :active-condition="isActive.underline()"
        />

        <MenuButton
          v-if="optionsInclude('Code')"
          plugin-name="Code"
          icon="code"
          :command="commands.code"
          :active-condition="isActive.code()"
        />

        <MenuButton
          v-if="optionsInclude('CodeBlock')"
          plugin-name="CodeBlock"
          icon="code"
          :command="commands.code_block"
          :active-condition="isActive.code_block()"
        />

        <MenuButton
          v-if="optionsInclude('Paragraph')"
          plugin-name="Paragraph"
          icon="subject"
          :command="commands.paragraph"
          :active-condition="isActive.paragraph()"
        />

        <MenuButton
          v-if="optionsInclude('BulletList')"
          plugin-name="BulletList"
          icon="format_list_bulleted"
          :command="commands.bullet_list"
          :active-condition="isActive.bullet_list()"
        />

        <MenuButton
          v-if="optionsInclude('OrderedList')"
          plugin-name="OrderedList"
          icon="format_list_numbered"
          :command="commands.ordered_list"
          :active-condition="isActive.ordered_list()"
        />
        <MenuButton
          v-if="optionsInclude('Blockquote')"
          plugin-name="Blockquote"
          icon="format_quote"
          :command="commands.blockquote"
          :active-condition="isActive.blockquote()"
        />

        <MenuButton
          v-if="optionsInclude('Link')"
          plugin-name="Link"
          icon="link"
          :command="setLink"
          :active-condition="linkBubble"
        />

        <MenuButton
          v-if="optionsInclude('Image')"
          plugin-name="Image"
          icon="image"
          :command="() => (chooseImage = !chooseImage)"
          :active-condition="chooseImage"
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
          />
        </template>

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
        <MenuButton
          v-if="optionsInclude('HorizontalRule')"
          plugin-name="HorizontalRule"
          icon="maximize"
          :command="commands.horizontal_rule"
        />

        <div
          class="history__actions"
          v-if="optionsInclude('History')"
          plugin-name="History"
          :style="{
            order: optionsIndex('History')
          }"
        >
          <MenuButton v-if="optionsInclude('History')" icon="undo" :command="commands.undo" />
          <MenuButton v-if="optionsInclude('History')" icon="redo" :command="commands.redo" />
        </div>
        <button
          class="menubar__button toggler"
          @click="
            $parent.updateText($parent.editor.view.dom.innerHTML),
              ($parent.showSource = !$parent.showSource)
          "
          :style="{
            order: 99
          }"
        >
          <v-icon name="code" v-if="!$parent.showSource" />
          <v-icon v-else name="arrow_back" />
        </button>
      </div>
    </editor-menu-bar>
    <Bubble :options="options" :editor="$parent.editor" :class="{ visible: linkBubble }" />
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
    },
    tablePosition: {
      x: {
        type: Number,
        defaultValue: 0
      },
      y: {
        type: Number,
        defaultValue: 0
      }
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
      return this.$parent.options.toolbarOptions.includes($val);
    },

    optionsIndex($val) {
      return this.$parent.options.toolbarOptions.indexOf($val);
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
    MenuButton,
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

  .menubar {
    min-height: 34px;
  }

  .toggler {
    height: 31px;
    padding-left: 5px;
    margin-left: auto;
    padding-right: 5px;
    border-radius: var(--border-radius);
    border: var(--input-border-width) solid var(--lightest-gray);

    //transform: translateY(-2px);
    transition: background-color ease-in-out 0.2s;
    background-color: var(--gray);
    color: var(--white);

    &:hover,
    &:focus {
      background-color: var(--action);
    }
  }
}
</style>
