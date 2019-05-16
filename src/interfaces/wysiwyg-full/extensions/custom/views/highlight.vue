<template>
    <span class="highlight" @click="openDetails()">
        <span ref="content"
              class=""
              :highlight-id="idhighlight"
        /></span>
</template>
<script>
  export default {
    name: "HighlightView",
    props: ['node', 'updateAttrs', 'editable'],
    data() {
      return {}
    },
    computed:
      {
        idhighlight: {
          get() {
            return this.node.attrs["highlight-id"];
          },
        },
      },
    methods:
      {
        openDetails: function () {
//Do Stuff
        }
      }
  }

</script>
