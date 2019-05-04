<template>
  <draggable
    class="interface-checkboxes draggable"
    :class="{ sortable: sortable }"
    element="div"
    v-model="sortableList"
    v-bind="dragOptions"
    @end="saveSort()"
    draggable=".sortable-box.active"
  >
    <template v-if="sortable">
      <div
        v-for="(item, val, idx) in sortableList"
        :key="idx"
        class="sortable-box"
        :class="{ active: selection.includes(item.val) }"
        :style="{ order: selection.indexOf(item.val) > -1 ? selection.indexOf(item.val) : 999 }"
      >
        <v-checkbox
          :id="item.label"
          :key="item.label"
          :value="item.val"
          :disabled="readonly"
          :label="item.label"
          :checked="selection.includes(item.val)"
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
        animation: 1,
        group: "description",
        disabled: !this.editable,
        ghostClass: "ghost"
      };
    },
    selection() {
      if (!this.value || this.value == null) return [];
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
      let choice = this.$props.options.choices;
      // Convert the value to an array
      if (typeof choice === "string") {
        if (choice.includes(",")) {
          choice = choice.split(",");
        } else {
          choice = [this.$props.options.choices];
        }
      } else if (typeof choice === "object") {
        choice = Object.keys(choice).map(k => ({
          val: k,
          label: choice[k]
        }));
      }
      return choice;
    }
  },

  created() {
    if (this.$props.sortable) {
      this.initSortable();
    }
    console.log(this);
  },

  data() {
    return {
      sortableList: [],
      editable: true,
      isDragging: false,
      delayedDragging: false
    };
  },

  methods: {
    saveSort() {
      let selection = [...this.selection];
      let staged = this.$lodash.map(this.sortableList, function(k) {
        return k.val;
      });
      staged = staged.filter(val => selection.includes(val));
      console.log(staged);
      return this.$emit("input", staged);
    },

    initSortable() {
      if (this.selection && this.choices) {
        let selection = [...this.selection];
        let staged = this.$lodash.map(this.choices, function(k) {
          return k.val;
        });
        staged = staged.filter(val => selection.includes(val.val));
        console.log(staged);
        console.log(selection);
        this.sortableList = [...staged, ...this.choices];
      }
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

  &.draggable {
    .sortable-box {
      order: 999;
      &.active {
        //order: -1;
      }
    }
  }
}
</style>
