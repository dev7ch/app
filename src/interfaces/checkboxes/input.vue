<template>
  <draggable
    class="interface-checkboxes"
    :class="{ draggable: sortable, single: options.single }"
    element="div"
    v-model="sortableList"
    v-bind="dragOptions"
    @end="saveSort()"
    :draggable="sortable ? '.sortable-box.active' : false"
  >
    <v-checkbox
      name="list-sorting"
      v-for="(item, idx) in sortableList"
      :key="idx"
      class="sortable-box"
      :class="{ active: selection.includes(item.val || item) }"
      :id="_uid + idx + '-' + (item.val ? item.val : item)"
      :value="item.val ? item.val : item"
      :disabled="readonly"
      :label="item.label ? item.label : item"
      :checked="selection.includes(item.val ? item.val : item)"
      @change="updateValue(item.val ? item.val : item, $event)"
    ></v-checkbox>
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
        animation: 200,
        disabled: !this.editable,
        ghostClass: "ghost"
      };
    },
    selection() {
      if (this.value == null) return [];
      let selection;
      // Convert the value to an array
      if (typeof this.value === "string" && this.value) {
        if (this.value.includes(",")) {
          selection = this.value.split(",");
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
    choosable() {
      let options = this.$props.options.choices ? this.$props.options.choices : {};
      let selected = this.selection ? this.selection : [];
      if (typeof options === "object") {
        options = Object.keys(options).map(k => ({
          val: k,
          label: options[k]
        }));
      }
      if (selected.length > 0) {
        let _this = this;
        selected = this.$lodash.map(selected, k => {
          return {
            val: k,
            label: _this.findLabel(options, k)
          };
        });
      }
      return [...selected, ...options];
    }
  },

  created() {
    this.sortableList = this.trimValues(this.choosable, "val");
  },

  data() {
    return {
      sortableList: [],
      editable: true
    };
  },

  methods: {
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
    },

    saveSort() {
      let selection = this.selection;
      let staged = this.$lodash.map(this.sortableList, function(k) {
        return k.val ? k.val : k;
      });
      staged = staged.filter(val => selection.includes(val));
      return this.$emit("input", staged);
    },

    trimValues(arr, comp) {
      return arr
        .map(e => e[comp])
        .map((e, i, final) => final.indexOf(e) === i && i) // store the keys of the unique objects
        .filter(e => arr[e]) // eliminate the dead keys & store unique objects
        .map(e => arr[e]);
    },

    findLabel(choice, k) {
      if (k && choice.find(x => x.val === k)) {
        if (choice.find(x => x.val === k).label) {
          return choice.find(x => x.val === k).label;
        } else {
          return choice.find(x => x.val === k);
        }
      } else {
        return k;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.interface-checkboxes {
  width: var(--width-x-large);
  max-width: 100%;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(1, 1fr);

  @media only screen and (min-width: 330px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media only screen and (min-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media only screen and (min-width: 800px) {
    grid-template-columns: repeat(4, 1fr);
  }

  &.single {
    grid-template-columns: repeat(1, 1fr);
  }
  &.draggable {
    max-width: 100%;
    .sortable-box {
      transition: opacity ease-in-out 0.2s, background-color ease-in-out 0.3s;
      &.active {
        &.ghost {
          position: relative;
          &.sortable-chosen {
            opacity: 0.4;
            + .sortable-box.active {
              opacity: 0.7;
            }
          }
          :after {
            position: absolute;
            font-family: "Material Icons", sans-serif;
            display: inline-block;
            line-height: 1;
            letter-spacing: normal;
            vertical-align: middle;
            content: "drag_indicator";
            height: 100%;
            width: 24px;
            font-size: 24px;
            left: 0;
            color: var(--darker-gray);
            background-color: var(--white);
          }
        }
      }
    }
  }
}
</style>
