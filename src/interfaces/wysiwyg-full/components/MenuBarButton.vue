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
    <v-icon class="icon" :name="icon" />
  </button>
</template>
<script>
export default {
  props: {
    icon: {
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
      type: Boolean,
      default: false
    }
  }
};
</script>
