<template>
  <div
    class="image-options"
    v-show="$parent.isImageSelection"
    :class="{ loaded: $parent.isImageSelection }"
    v-if="$parent.selectionPosition.target"
    :style="{
      top: $parent.getTopPosition($parent.selectionPosition.target),
      left: getEditorPos($parent.$refs.editor.$el).left,
      width: getEditorPos($parent.$refs.editor.$el).width
    }"
  >
    <h1 class="title image-options-item">Edit image attributes</h1>
    <button
      type="button"
      class="top-close"
      :disabled="false"
      @click="($parent.isImageSelection = false), ($parent.hasSettings = false)"
    >
      <v-icon name="close" />
    </button>
    <div class="image-options-preview image-options-item half" v-if="$parent.selectionPosition.src">
      <v-icon
        v-if="!$parent.selectionPosition.src || imageUrlRawBroken"
        class="material-icons error icon"
        name="broken_image"
      ></v-icon>
      <img
        v-else
        :src="$parent.selectionPosition.src"
        alt="image-options-preview"
        class="image"
        @error="imageUrlRawBroken = true"
      />
    </div>
    <div class="image-options-item half">
      <v-input
        v-if="!!$parent.selectionPosition.target"
        class="image-options-item"
        ref="editedTitle"
        :placeholder="$t('image_title')"
        v-model.lazy="$parent.selectionPosition.title"
        :value="$parent.selectionPosition.title"
      />
      <v-input
        v-if="!!$parent.selectionPosition.target"
        ref="editedAlt"
        :placeholder="$t('alt_text')"
        class="image-options-item"
        :value="$parent.selectionPosition.alt"
        v-model.lazy="$parent.selectionPosition.alt"
      />
      <div class="v-input image-options-item dimension">
        <div class="image-options-item quart">
          <label class="">
            <small>{{ $t("width_px") }}</small>
          </label>
          <v-input
            v-if="!!$parent.selectionPosition"
            ref="editedClasses"
            :placeholder="$t('width_px')"
            :value="trimDimension($parent.selectionPosition.target.width.toString())"
            v-model.lazy="$parent.selectionPosition.target.width"
          />
        </div>
        <div class="image-options-item quart">
          <label>
            <small>{{ $t("height_px") }}</small>
          </label>
          <v-input
            v-if="!!$parent.selectionPosition"
            ref="editedClasses"
            :placeholder="$t('height_px')"
            class="image-options-item quart"
            :disabled="true"
            :value="'auto (' + $parent.selectionPosition.target.height + 'px)'"
          />
        </div>
      </div>
    </div>
    <v-input
      v-if="!!$parent.selectionPosition.target"
      class="image-options-item"
      ref="editedSource"
      @input="imageUrlRawBroken = false"
      :placeholder="$t('image_source')"
      v-model.lazy="$parent.selectionPosition.src"
      :value="$parent.selectionPosition.src"
    />
    <v-input
      v-if="!!$parent.selectionPosition"
      ref="editedClasses"
      :placeholder="$t('css_classes')"
      class="image-options-item"
      :value="$parent.selectionPosition.classes"
      v-model.lazy="$parent.selectionPosition.classes"
    />
    <div class="image-options-footer">
      <v-button
        type="button"
        :disabled="false"
        @click="($parent.isImageSelection = false), ($parent.hasSettings = false)"
      >
        <v-icon name="close" />
        {{ $t("cancel") }}
      </v-button>
      <v-button type="button" :disabled="$parent.readonly" @click="setAll()">
        <v-icon name="check" />
        {{ $t("confirm") }}
      </v-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loaded: false,
      imageUrlRawBroken: false
    };
  },
  methods: {
    getEditorPos($elem) {
      return {
        left: $elem.getBoundingClientRect().x - 10 + "px",
        width: $elem.getBoundingClientRect().width - 45 + "px"
      };
    },
    trimDimension($str) {
      const regexStr = $str.match(/[a-z%]+|[^a-z%]+/gi);
      // console.log(regexStr);
      return regexStr;
    },

    setAll() {
      this.$parent.selectionPosition.target.className = this.$parent.selectionPosition.classes;
      this.$parent.selectionPosition.target.alt = this.$parent.selectionPosition.alt;
      this.$parent.selectionPosition.target.src = this.$parent.selectionPosition.src;
      this.$parent.selectionPosition.target.title = this.$parent.selectionPosition.title;
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
  flex-flow: row wrap;
  background-color: var(--lightest-gray);
  padding: calc(var(--page-padding) / 2);
  position: fixed;
  width: 100%;
  max-width: 100%;
  top: calc(50% + 15px);
  transform: translateY(-100vh);
  margin-top: var(--page-padding);
  border-radius: var(--border-radius);
  border: 2px solid var(--lighter-gray);

  .title {
    font-size: var(--size-2);
    margin-bottom: 10px;
    color: var(--darkest-gray);
  }

  @media (min-width: 480px) {
    width: calc(100% - var(--page-padding) * 2);
    margin: var(--page-padding);
  }

  opacity: 0;
  animation: FadeOutImageEdit 0.2s ease-in-out;
  overflow-y: auto;
}

.v-input {
  width: initial;
  padding-bottom: calc(var(--page-padding) / 2);
  &:last-of-type {
    padding-bottom: 0;
  }
}

.loaded {
  display: flex;
  max-height: 100vh;
  opacity: 1;
  z-index: 1;
  animation: FadeInImageEdit 0.3s ease-in-out;
}

.top-close {
  position: absolute;
  right: calc(var(--page-padding) / 2);
  top: calc(var(--page-padding) / 3.25);
}

.image-options-item {
  flex: 1 0 100%;
  &.half {
    //width: calc(100% - 180px);
    //display: flex;
    flex: 1 0 100%;
    @media (min-width: 480px) {
      flex: 1 0 40%;
    }

    &:first-child {
      //margin-right: calc(var(--page-padding) / 2);
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
  //padding-top: calc(var(--page-padding) / 2);
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
