<template>
  <div class="editor__raw" v-show="showSource">
    <v-textarea
      @input="$emit('input', $event.target)"
      v-if="showSource && showRaw"
      v-model.lazy="$parent.editorText"
      class="textarea"
      :id="name + '-raw'"
      :value="$parent.editor.view.dom.innerHTML"
      :placeholder="$parent.options.placeholder"
      :rows="options.rows ? +options.rows : 10"
    ></v-textarea>

    <!-- include code mirror component for formatted raw view -->

    <CodeMirror
      :placeholder="options.placeholder"
      class="textarea code"
      :id="id + '-raw-formatted'"
      v-if="$parent.showSource && !showRaw"
      :alt-options="$parent.options.codeMirrorOptions"
      :value="$parent.editor.view.dom.innerHTML"
      v-model.lazy="$parent.editorText"
      :name="'htmlmixed'"
      type="textarea"
      @input="$emit('input', $event.target)"
    >
    </CodeMirror>
    <!-- formatted / unformatted  view toggler -->
    <div
      class="editor__rawformat"
      v-if="showSource"
      @click="showRaw = !showRaw"
    >
      <span :style="{ color: !showRaw ? 'var(--accent)' : 'var(--light-gray)' }"
        >formatted</span
      >
      |
      <span :style="{ color: showRaw ? 'var(--accent)' : 'var(--light-gray)' }"
        >unformatted</span
      >
    </div>
  </div>
</template>
<script>
import CodeMirror from "../../code/input";
export default {
  props: ["showSource", "options", "editor", "id", "name"],
  components: {
    CodeMirror
  },
  data() {
    return {
      showRaw: false
    };
  }
};
</script>
