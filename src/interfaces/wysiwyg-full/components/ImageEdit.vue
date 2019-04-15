<template>
  <div
    class="image-options"
    :class="{ loaded: $parent.isImageSelection }"
    v-if="$parent.selectionPosition.target"
  >
    <v-input
      v-if="!!$parent.selectionPosition.target"
      class="image-options-item half"
      ref="editedTitle"
      :placeholder="$t('image_title')"
      v-model.lazy="$parent.selectionPosition.target.title"
      :value="$parent.selectionPosition.target.title"
    />
    <v-input
      v-if="!!$parent.selectionPosition.target"
      ref="editedAlt"
      :placeholder="$t('alt_text')"
      class="image-options-item half"
      :value="$parent.selectionPosition.target.alt"
      v-model.lazy="$parent.selectionPosition.target.alt"
    />
    <div class="v-input image-options-item dimension">
      <!--<label class=""><small>Width</small></label>-->
      <v-input
        v-if="!!$parent.selectionPosition"
        ref="editedClasses"
        :placeholder="$t('width_px')"
        class="image-options-item"
        :value="
          trimDimension($parent.selectionPosition.target.width.toString())
        "
        v-model.lazy="$parent.selectionPosition.target.width"
      />
      <!--<label><small>Height</small></label>-->
      <v-input
        v-if="!!$parent.selectionPosition"
        ref="editedClasses"
        :placeholder="$t('height_px')"
        class="image-options-item"
        :disabled="true"
        :value="'auto (' + $parent.selectionPosition.target.height + 'px)'"
      />
    </div>
    <v-input
      v-if="!!$parent.selectionPosition.target"
      class="image-options-item"
      ref="editedSource"
      :placeholder="$t('image_source')"
      v-model.lazy="$parent.selectionPosition.target.src"
      :value="$parent.selectionPosition.target.src"
    />
    <v-input
      v-if="!!$parent.selectionPosition"
      ref="editedClasses"
      :placeholder="$t('css_classes')"
      class="image-options-item"
      :value="$parent.selectionPosition.target.className"
      v-model.lazy="$parent.selectionPosition.target.className"
    />
    <div class="image-options-footer">
      <button
        type="button"
        :disabled="false"
        @click="$parent.isImageSelection = false"
      >
        <i class="material-icons">close</i>{{ $t("cancel") }}
      </button>
      <button type="button" :disabled="$parent.readonly" @click="setAll()">
        <i class="material-icons">check</i> {{ $t("confirm") }}
      </button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loaded: false
    };
  },
  methods: {
    trimDimension($str) {
      const regexStr = $str.match(/[a-z%]+|[^a-z%]+/gi);
      console.log(regexStr);
      return regexStr;
    },

    setAll() {
      this.$parent.setClasses(
        this.$parent.selectionPosition.target,
        this.$parent.selectionPosition.target.className
      ) &&
        this.$parent.setAltText(
          this.$parent.selectionPosition.target,
          this.$parent.selectionPosition.target.alt
        );
    }
  },
  mounted() {
    this.loaded = true;
  }
};
</script>
<style lang="scss" scoped>
.image-options {
  display: none;
  background-color: var(--lightest-gray);
  padding: calc(var(--page-padding) / 2);
  position: absolute;
  width: calc(100% - var(--page-padding) * 2);
  max-width: 100%;
  top: calc(50% + 15px);
  transform: translateY(-50%);
  margin: var(--page-padding);
  border-radius: var(--border-radius);
  border: 2px solid var(--lighter-gray);

  opacity: 0;
  animation: FadeOutImageEdit 0.2s ease-in-out;
  overflow-y: auto;
}

.v-input {
  padding-bottom: calc(var(--page-padding) / 2);
  &:last-of-type {
    padding-bottom: 0;
  }
}

.loaded {
  display: block;
  max-height: 100vh;
  opacity: 1;
  animation: FadeInImageEdit 0.3s ease-in-out;
}

.dimension {
  max-width: 120px;
  margin-left: auto;
  float: right;
  .image-options-item {
    display: inline-flex;
  }
}
.image-options-item {
  &.half {
    display: inline-flex;
    &:first-child {
      margin-right: calc(var(--page-padding) / 2);
    }
  }
}

.dimension {
}

.image-options-footer {
  display: flex;
  //padding-top: calc(var(--page-padding) / 2);
  button {
    padding-right: 10px;
    &:last-of-type {
      margin-left: auto;
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
