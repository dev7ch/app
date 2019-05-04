<template>
  <draggable
    class="interface-checkboxes draggable"
    :class="{ sortable: sortable }"
    element="div"
    v-model="sortableList"
    v-bind="dragOptions"
    @end="saveSort()"
    @start="setSort()"
    draggable=".sortable-box"
  >
    <template v-if="sortable">
      <div v-for="(item, idx) in sortableList" :key="idx" class="sortable-box">
        <v-checkbox
          :id="item.label"
          :key="item.label"
          :value="item.val"
          :disabled="readonly"
          :label="item.label"
          :checked="selection.includes(item.val || idx)"
          @change="updateValue(item.val, $event)"
        ></v-checkbox>
      </div>
    </template>
    <template v-else-if="!sortable">
      <v-checkbox
        v-for="(label, val) in options.choices"
        :id="label"
        :key="label"
        :value="name + '-' + val"
        :disabled="readonly"
        :label="label"
        :checked="selection.includes(val)"
        @change="updateValue(val, $event)"
      ></v-checkbox>
    </template>
  </draggable>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";
import draggable from "vuedraggable";

export default {
  name: "interface-checkboxes",
  mixins: [mixin],
  props: {
    sortable: {
      type: Boolean,
      default: true
    }
  },

  components: {
    draggable
  },

  computed: {
    dragOptions() {
      return {
        animation: 3,
        group: "description",
        disabled: !this.editable,
        ghostClass: "ghost"
      };
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
    },
    choices() {
      if (!this.$props.options.choices) return [];
      let choice;
      // Convert the value to an array
      if (typeof this.$props.options.choices === "string") {
        if (this.$props.options.choices.includes(",")) {
          choice = choice.split(",");
        } else {
          choice = [this.$props.options.choices];
        }
      } else if (typeof this.$props.options.choices === "object") {
        choice = this.$props.options.choices;
        choice = Object.keys(this.$props.options.choices).map(k => ({
          val: k,
          label: this.$props.options.choices[k],
          sort: k.ke
        }));
      }
      console.log(choice);
      return choice;
    }
  },

  data() {
    return {
      sortableList: [],
      editable: true,
      isDragging: false,
      delayedDragging: false
    };
  },

  mounted() {
    if (this.$props.sortable) {
      this.initSortable();
    }
  },

  methods: {
    saveSort() {
      let selection = [...this.selection];
      let staged = this.$lodash.map(this.sortableList, function(value) {
        return value.val;
      });
      staged = staged.filter(val => selection.includes(val));
      console.log(staged);
      console.log(this.options);
      return this.$emit("input", staged);
    },

    setSort() {
      this.initSortable();
    },

    initSortable() {
      this.sortableList = [...this.choices];
    },

    updateValue(val) {
      let selection = [...this.selection];

      console.log(val);
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

      console.log(selection);

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
