<template>
  <button
    v-if="$parent.$parent.options.toolbarOptions.includes(pluginName)"
    :style="{
      order: $parent.$parent.options.toolbarOptions.indexOf(pluginName)
    }"
    class="menubar__button"
    :class="{ 'is-active': activeCondition }"
    @click="command"
  >
    <span v-if="supIcon || supType" :class="'sup ' + supType">
      <v-icon
        class="small"
        :name="supType === 'add' && !supIcon ? 'add_circle' : 'remove_circle' || supIcon"
      />
    </span>
    <span v-if="label" class="label">{{ label }}</span>
    <v-icon class="icon" :name="icon" />
  </button>
</template>
<script>
export default {
  name: "menu-bar-button",
  props: {
    icon: {
      type: String,
      default: null
    },
    supType: {
      type: String,
      default: ""
    },
    supIcon: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    pluginName: {
      type: String,
      default: ""
    },
    command: {
      type: Function,
      default: () => {}
    },
    activeCondition: {
      type: Boolean
    }
  }
};
</script>
