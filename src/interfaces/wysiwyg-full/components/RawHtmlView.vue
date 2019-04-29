<template>
  <codemirror class="editor" v-model="$parent.editorText" :options="cmOptions"></codemirror>
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
.editor .CodeMirror {
  padding: calc(var(--page-padding) / 2);
}
</style>
