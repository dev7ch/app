<template>
  <div
    class="image-options"
    v-if="selectionPosition.target && isImageEdit"
    :style="{
      top: '50%',
      width: 'var(--width-x-large)'
    }"
    @keyup.esc="quit()"
  >
    <h1 class="title image-options-item">Edit image attributes</h1>
    <button type="button" class="top-close" :disabled="false" @click="quit()">
      <v-icon name="close" />
    </button>
    <div class="image-options-preview image-options-item half" v-if="selectionPosition.src">
      <v-icon
        v-if="!selectionPosition.src || imageUrlRawBroken"
        class="material-icons error icon"
        name="broken_image"
      ></v-icon>
      <img
        v-else
        :src="selectionPosition.src"
        alt="image-options-preview"
        class="image"
        @error="imageUrlRawBroken = true"
      />
    </div>
    <div class="image-options-item half">
      <v-input
        v-if="!!selectionPosition.target"
        class="image-options-item"
        ref="editedTitle"
        :placeholder="$t('interfaces-wysiwyg-full-image_title')"
        v-model.lazy="selectionPosition.title"
        :value="selectionPosition.title"
        @keyup.13="setAll()"
      />
      <v-input
        v-if="!!selectionPosition.target"
        ref="editedAlt"
        :placeholder="$t('interfaces-wysiwyg-full-image_alt')"
        class="image-options-item"
        :value="selectionPosition.alt"
        v-model.lazy="selectionPosition.alt"
        @keyup.13="setAll()"
      />
      <div class="v-input image-options-item dimension">
        <div class="image-options-item quart">
          <label class="">
            <small>{{ $t("interfaces-wysiwyg-full-image_width_px") }}</small>
          </label>
          <v-input
            v-if="!!selectionPosition"
            ref="editedClasses"
            :placeholder="$t('interfaces-wysiwyg-full-image_width_px')"
            :value="trimDimension(selectionPosition.target.width.toString())"
            v-model.lazy="selectionPosition.target.width"
            @keyup.13="setAll()"
          />
        </div>
        <div class="image-options-item quart">
          <label>
            <small>{{ $t("interfaces-wysiwyg-full-image_height_px") }}</small>
          </label>
          <v-input
            v-if="!!selectionPosition"
            ref="editedClasses"
            :placeholder="$t('interfaces-wysiwyg-full-image_height_px')"
            class="image-options-item quart"
            :disabled="true"
            :value="selectionPosition.target.height"
          />
        </div>
      </div>
    </div>
    <v-input
      v-if="!!selectionPosition.target"
      class="image-options-item"
      ref="editedSource"
      @input="imageUrlRawBroken = false"
      :placeholder="$t('interfaces-wysiwyg-full-image_source')"
      v-model.lazy="selectionPosition.src"
      :value="selectionPosition.src"
      @keyup.13="setAll()"
    />
    <v-input
      v-if="!!selectionPosition"
      ref="editedClasses"
      :placeholder="$t('interfaces-wysiwyg-full-image_css_classes')"
      class="image-options-item"
      :value="selectionPosition.classes"
      v-model.lazy="selectionPosition.classes"
      @keyup.13="setAll()"
    />
    <div class="image-options-footer">
      <v-button type="button" :disabled="false" @click="quit()">
        <v-icon name="close" />
        {{ $t("cancel") }}
      </v-button>
      <v-button type="button" :disabled="$parent.readonly || imageUrlRawBroken" @click="setAll()">
        <v-icon name="check" />
        {{ $t("confirm") }}
      </v-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    selectionPosition: {
      required: true,
      type: Object
    },
    isImageEdit: {
      required: true,
      type: Boolean,
      default: false
    },
    updateValue: {
      type: Function
    },
    editor: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loaded: false,
      imageUrlRawBroken: false
    };
  },
  methods: {
    trimDimension($str) {
      if ($str) {
        return $str.match(/[a-z%]+|[^a-z%]+/gi);
      }
    },
    quit() {
      console.log(this);
      if (this.$parent.editImage) {
        this.$parent.editImage = false;
      }
      this.loaded = false;
    },
    setAll() {
      // Apply changes to real target in editor, collected by observer
      // $parent is here supposed due the observer is located in the $parent
      this.$parent.selectionPosition.target.className = this.selectionPosition.classes;
      this.$parent.selectionPosition.target.alt = this.selectionPosition.alt;
      this.$parent.selectionPosition.target.src = this.selectionPosition.src;
      this.$parent.selectionPosition.target.title = this.selectionPosition.title;
      // Emit all changes manually due @input with newValue is not triggered
      this.updateValue(this.editor.view.dom.innerHTML);
      if (this.$parent.editImage) {
        this.$parent.editImage = false;
      }
    }
  },
  mounted() {
    this.loaded = true;
  }
};
</script>
<style lang="scss" scoped>
.image-options {
  display: flex;
  z-index: 99;
  flex-flow: row wrap;
  background-color: var(--lightest-gray);
  padding: calc(var(--page-padding) / 2);
  position: fixed;
  left: calc(var(--page-padding) * 1.2);
  transform: translateY(-50%);
  right: calc(var(--page-padding) * 1.2);
  max-width: 100%;
  overflow-y: auto;
  top: 50%;
  width: 100%;
  margin-top: var(--header-height);
  border-radius: var(--border-radius);
  border: 2px solid var(--lighter-gray);
  max-height: 100vh;
  opacity: 1;
  animation: FadeInImageEdit 0.3s ease-in-out;

  .title {
    font-size: var(--size-2);
    margin-bottom: 10px;
    color: var(--darkest-gray);
  }

  @media (min-width: 480px) {
    right: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 390px;
    width: calc(100% - var(--page-padding) * 2);
  }

  @media (min-width: 800px) {
    min-width: 440px;
    left: calc(50% - var(--nav-sidebar-width));
    margin-left: calc(var(--nav-sidebar-width) + var(--page-padding));
  }
}

.v-input {
  width: initial;
  padding-bottom: calc(var(--page-padding) / 2);
  &:last-of-type {
    padding-bottom: 0;
  }
}

.top-close {
  position: absolute;
  right: calc(var(--page-padding) / 2);
  top: calc(var(--page-padding) / 3.25);
}

.image-options-item {
  flex: 1 0 100%;
  &.half {
    flex: 1 0 100%;
    @media (min-width: 480px) {
      flex: 1 0 40%;
    }
  }
  .dimension {
    display: inline-flex;
    margin-bottom: calc(var(--page-padding) / 2);
    .quart {
      flex: 1 0 20%;
      float: left;
      margin-right: 10px;

      &:last-of-type {
        margin-right: 0;
      }
    }
  }
}

.image-options-preview {
  width: 100%;
  position: relative;
  height: 180px;
  background-color: var(--off-white);
  margin-bottom: calc(var(--page-padding) / 2);

  @media (min-width: 480px) {
    width: 40%;
    margin-right: calc(var(--page-padding) / 2);
  }
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 180px;
    height: 180px;
    object-fit: contain;
    max-width: 100%;
  }

  .icon {
    color: var(--lightest-gray);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(4);
  }
}

.image-options-footer {
  display: block;
  @media (min-width: 480px) {
    display: inline-flex;
  }
  width: 100%;
  button {
    margin-bottom: calc(var(--page-padding) / 2);
    width: 100%;

    &:last-of-type {
      margin-bottom: 0;
    }

    @media (min-width: 480px) {
      width: auto;
      margin-bottom: 0;
      &:last-of-type {
        margin-left: auto;
        float: right;
        align-self: end;
      }
    }
  }
}
@keyframes FadeInImageEdit {
  0% {
    opacity: 0;
    max-height: 0;
  }
  100% {
    opacity: 1;
    max-height: 100vh;
  }
}
@keyframes FadeOutImageEdit {
  0% {
    opacity: 1;
    max-height: 100vh;
  }
  99% {
    opacity: 0;
    max-height: 20%;
  }
  100% {
    max-height: 0;
    opacity: 0;
  }
}
</style>
