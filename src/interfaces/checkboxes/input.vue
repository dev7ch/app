<template>
  <draggable
    class="interface-checkboxes draggable"
    element="div"
    v-model="list"
    v-bind="dragOptions"
    @end="saveSort()"
    @start="getChoices()"
  >
    <transition-group v-for="(label, val, idx) in options.choices" :key="idx">
      <v-checkbox
        :id="label"
        :key="label"
        :value="name + '-' + val"
        :disabled="readonly"
        :label="label"
        :checked="selection.includes(val)"
        @change="updateValue(val, $event)"
      ></v-checkbox>
    </transition-group>
  </draggable>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";
import draggable from "vuedraggable";

export default {
  name: "interface-checkboxes",
  mixins: [mixin],
  watch: {
    isDragging(newValue) {
      if (newValue) {
        this.delayedDragging = true;
        return;
      }
      this.$nextTick(() => {
        this.delayedDragging = false;
      });
    }
  },

  components: {
    draggable
  },

  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: !this.editable,
        ghostClass: "ghost"
      };
    },
    fieldsWithSort() {
      return this.fields.map((field, index) => ({
        ...field,
        sort: index + 1
      }));
    },
    selection() {
      if (!this.value) return [];

      let selection;

      // Convert the value to an array
      if (typeof this.value === "string") {
        if (this.value.includes(",")) {
          selection = selection.split(",");
        } else {
          selection = [this.value];
        }
      } else {
        selection = this.value;
      }

      if (this.options.wrap && selection.length > 2) {
        selection.pop();
        selection.shift();
      }

      return selection;
    }
  },

  data() {
    return {
      list: [],
      editable: true,
      isDragging: false,
      delayedDragging: false
    };
  },

  methods: {
    saveSort() {
      // console.log(this.values)
      // console.log(this.value)
      console.log(this.list);
    },
    getChoices() {
      let choices = this.value;
      if (typeof choices === "string") {
        if (choices.includes(",")) {
          choices = choices.split(",");
        } else {
          choices = [choices];
        }
      }
      console.log(choices);
      //this.list = choices;
    },
    sort() {
      this.options.map((name, index) => {
        return { name, order: index + 1, fixed: false };
      });
    },

    updateValue(val) {
      let selection = [...this.selection];

      if (selection.includes(val)) {
        selection.splice(selection.indexOf(val), 1);
      } else {
        selection.push(val);
      }

      selection = selection.join(",");

      if (this.options.wrap && selection.length > 0) {
        selection = `,${selection},`;
      }

      if (this.type === "array") {
        selection = selection.split(",");
      }

      this.$emit("input", selection);
    }
  }
};
</script>

<style lang="scss" scoped>
.interface-checkboxes {
  max-width: var(--width-x-large);
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(4, 1fr);
}
</style>
