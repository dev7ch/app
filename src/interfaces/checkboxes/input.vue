<template>
  <draggable
    class="interface-checkboxes"
    :class="{ draggable: sortable }"
    element="div"
    v-model="sortableList"
    v-bind="dragOptions"
    @end="saveSort()"
    :draggable="sortable ? '.sortable-box.active' : false"
  >
    <transition-group
      name="list-sorting"
      v-for="(item, idx) in sortableList"
      :key="idx"
      class="sortable-box"
      :class="{ active: selection.includes(item.val || item) }"
    >
      <v-checkbox
        :id="_uid + idx + '-' + (item.val ? item.val : item)"
        :key="idx"
        :value="item.val ? item.val : item"
        :disabled="readonly"
        :label="item.label ? item.label : item"
        :checked="selection.includes(item.val ? item.val : item)"
        @change="updateValue(item.val ? item.val : item, $event)"
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
        group: "description",
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
    choices() {
      let choice = this.$props.options.choices ? this.$props.options.choices : {};
      let selection = this.selection ? this.selection : [];

      // Convert the value to an array
      if (typeof choice === "string") {
        if (choice.includes(",")) {
          choice = choice.split(",");
        } else {
          choice = [choice];
        }
      }
      if (typeof choice === "object") {
        choice = Object.keys(choice).map(k => ({
          val: k,
          label: choice[k] ? choice[k] : k
        }));
      }
      if (selection) {
        selection = this.$lodash.map(selection, function(k) {
          return {
            val: k,
            label: choice.find(x => x.val === k)
              ? choice.find(x => x.val === k).label
                ? choice.find(x => x.val === k).label
                : choice.find(x => x.val === k)
              : k
          };
        });
        console.log(selection);
      }

      return [...selection, ...choice];
    }
  },

  created() {
    this.sortableList = this.trimValues([...this.choices], "val");
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
        return k.val ? k.val : k;
      });
      staged = staged.filter(val => selection.includes(val));
      return this.$emit("input", staged);
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
    },
    trimValues(arr, comp) {
      return arr
        .map(e => e[comp])
        .map((e, i, final) => final.indexOf(e) === i && i) // store the keys of the unique objects
        .filter(e => arr[e]) // eliminate the dead keys & store unique objects
        .map(e => arr[e]);
    }
  }
};
</script>

<style lang="scss" scoped>
.interface-checkboxes {
  max-width: var(--width-x-large);
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
              border-radius: var(--border-radius);
              color: var(--accent);
              opacity: 0.7;
              animation: move ease-in-out 0.3s;
            }
          }

          .form-checkbox {
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
              color: var(--accent);
              background-color: var(--white);
            }
          }
        }
      }
    }
  }
}
</style>
