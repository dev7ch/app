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
      let selection = this.selection;
      console.log(this.selection);
      if (this.options.formatting && selection.includes(", ")) {
        return selection
          .filter(val => val)
          .map(val => this.options.choices[val])
          .join(", ");
      }
      if (this.options.formatting) {
        return selection.filter(val => val).map(val => this.options.choices[val]);
      }
      return selection;
    }
  }
};
</script>
