<template>
  <div class="readonly-checkboxes no-wrap">{{ displayValue }}</div>
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
      if (this.options.formatting && this.type === "array") {
        // Check if label exist for value in options, if not add value as label
        return this.selection
          .map(val => (this.options.choices[val] ? this.options.choices[val] : val))
          .toString();
      }
      return this.selection;
    }
  }
};
</script>
