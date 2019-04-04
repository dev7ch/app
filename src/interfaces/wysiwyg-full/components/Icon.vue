<template>
  <div
    class="icon"
    :class="[`icon--${name}`, `icon--${size}`, `icon--${modifier}`]"
  >
    <i class="material-icons icon" :title="title ? title : name">{{ name }}</i>
  </div>
</template>

<script>
export default {
  props: {
    name: {},
    title: {},
    size: {
      default: "normal"
    },
    modifier: {
      default: null
    }
  }
};
</script>

<style lang="scss" scoped>
.icon {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 30px;
  height: 30px;
  margin: 0 0.3rem;
  top: -0.05rem;
  fill: currentColor;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
}

// svg sprite
body > svg,
.icon use > svg,
symbol {
  path,
  rect,
  circle,
  g {
    fill: currentColor;
    stroke: none;
  }

  *[d="M0 0h24v24H0z"] {
    display: none;
  }
}
</style>
