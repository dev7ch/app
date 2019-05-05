<template>
  <div class="readonly-checkboxes no-wrap">{{ displayValue.toString() }}</div>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";

export default {
  name: "readonly-checkboxes",
  mixins: [mixin],
  computed: {
    selection() {
      if (this.value == null) return [];

      const selection = this.type === "VARCHAR" ? this.value.split(",") : this.value;
      if (this.options.wrap) {
        selection.pop();
        selection.shift();
      }
      return selection;
    },
    displayValue() {
      const display = this.selection;
      if (this.options.formatting && this.type === "array") {
        return display.filter(val => val).map(val => this.options.choices[val]);
      }
      return display;
    }
  }
};
</script>
