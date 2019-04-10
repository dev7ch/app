<template>
  <div class="interfacer-menu-builder">
    <CodeMirror
        :placeholder="'test'"
        class="textarea code"
        :id="id + '-raw-formatted'"
        :alt-options="options.codeMirrorOptions"
        :value="value"
        @input="emitValue"
        name="json"
        type="textarea"
    >
    </CodeMirror>
  </div>
</template>

<script>
  import mixin from "@directus/extension-toolkit/mixins/interface";
  import CodeMirror from "../code/input";

  export default {
    mixins: [mixin],
    methods: {
      emitValue(event) {
          try {
            const value = JSON.parse(event)
            this.$emit("input", value);
          } catch (e) {
            console.log("No valid json string found:", e.message)
          }
      }
    },
    components: {
      CodeMirror
    }
  };
</script>

<style lang="scss" scoped>
  input {
    border-radius: var(--border-radius);
  }
</style>
