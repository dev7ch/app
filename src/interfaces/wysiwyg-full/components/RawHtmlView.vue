<template>
  <codemirror
    class="code-editor"
    :value="value"
    @input="$emit('input', $event)"
    :options="cmOptions"
  ></codemirror>
</template>
<script>
import "codemirror/lib/codemirror.css";
import "codemirror/addon/display/autorefresh.js";
import "codemirror/mode/xml/xml.js";

import { codemirror } from "vue-codemirror";

export default {
  components: {
    codemirror
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  computed: {
    cmOptions() {
      return {
        tabSize: 4,
        autoRefresh: true,
        indentUnit: 4,
        mode: "text/html",
        showCursorWhenSelecting: true,
        theme: "default",
        lineWrapping: true
      };
    }
  }
};
</script>

<style lang="scss">
.code-editor .CodeMirror {
  padding: calc(var(--page-padding) / 2);
  margin-bottom: 0;
  border: 0;
}
</style>
