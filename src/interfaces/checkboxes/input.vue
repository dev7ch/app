<template>
  <draggable
    class="interface-checkboxes"
    :class="{ draggable: sortable }"
    element="div"
    v-model="sortableList"
    v-bind="dragOptions"
    @end="saveSort()"
    draggable=".sortable-box.active"
  >
    <template v-if="sortable && sortableList.length > 1">
      <transition-group
        name="list-sorting"
        tag="div"
        v-for="(item, idx) in sortableList"
        :key="idx"
        class="sortable-box"
        :class="{ active: selection.includes(item.val) }"
        :style="{
          order:
            selection.indexOf(item.val) > -1 ? selection.indexOf(item.val) : selection.length + 1
        }"
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
      </transition-group>
    </template>
    <span v-else-if="!sortable">
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
    </span>
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
      if (!this.$props.options.choices || this.$props.options.choices == null) return [];
      let choice = this.$props.options.choices;
      // Convert the value to an array
      if (typeof choice === "string") {
        if (choice.includes(",")) {
          choice = choice.split(",");
        } else {
          choice = [choice];
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

  beforeMount() {
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
      transition: opacity ease-in-out 0.2s, box-shadow ease-in-out 0.3s;
      &.active {
        &.ghost {
          position: relative;
          &.sortable-chosen {
            opacity: 0.4;
            order: initial;
            + .sortable-box.active {
              color: var(--accent);
              position: relative;
              .form-checkbox {
                position: relative;
                border: var(--border-radius);
                box-shadow: inset 1px 1px 2px var(--light-gray);
              }
            }
          }

          .form-checkbox {
            :after {
              font-family: "Material Icons", sans-serif;
              font-weight: normal;
              font-style: normal;
              display: inline-block;
              line-height: 1;
              text-transform: none;
              letter-spacing: normal;
              word-wrap: normal;
              white-space: nowrap;
              -webkit-font-feature-settings: "liga";
              font-feature-settings: "liga";
              vertical-align: middle;
              content: "drag_indicator";
              height: 100%;
              width: 24px;
              font-size: 24px;
              position: absolute;
              left: 0;
              color: var(--accent);
              background-color: var(--white);
            }
          }
        }
      }
    }
  }

  @keyframes appear {
    0% {
      opacity: 0.2;
    }
    100% {
    }
  }
}
</style>
