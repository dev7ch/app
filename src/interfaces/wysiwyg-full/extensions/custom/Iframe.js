import { Node } from "tiptap";

// example from https://github.com/scrumpy/tiptap#create-a-node-as-a-vue-component

export default class IframeNode extends Node {
  get name() {
    return "iframe";
  }

  get schema() {
    return {
      // here you have to specify all values that can be stored in this node
      attrs: {
        src: {
          default: null
        }
      },
      group: "block",
      selectable: false,
      // parseDOM and toDOM is still required to make copy and paste work
      parseDOM: [
        {
          tag: "iframe",
          getAttrs: dom => ({
            src: dom.getAttribute("src")
          })
        }
      ],
      toDOM: node => [
        "iframe",
        {
          src: node.attrs.src,
          frameborder: 0,
          allowfullscreen: "true"
        }
      ]
    };
  }

  // return a vue component
  // this can be an object or an imported component
  get view() {
    return {
      // there are some props available
      // `node` is a Prosemirror Node Object
      // `updateAttrs` is a function to update attributes defined in `schema`
      // `editable` is the global editor prop whether the content can be edited
      // `options` is an array of your extension options
      // `selected`
      props: ["node", "updateAttrs", "editable"],
      computed: {
        src: {
          get() {
            return this.node.attrs.src;
          },
          set(src) {
            // we cannot update `src` itself because `this.node.attrs` is immutable
            this.updateAttrs({
              src
            });
          }
        }
      },
      template: `
        <div class="iframe">
          <iframe class="iframe__embed" :src="src"></iframe>
          <input class="iframe__input" type="text" v-model="src" v-if="editable" />
        </div>
      `
    };
  }
}
