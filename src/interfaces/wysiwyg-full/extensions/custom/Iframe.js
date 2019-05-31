import { Node } from "tiptap";
import { nodeInputRule, toggleBlockType } from "tiptap-commands";

import Iframe from "./views/Iframe";

// example from https://github.com/scrumpy/tiptap#create-a-node-as-a-vue-component
// a bit extend to support classes and styles

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
        },
        style: {
          default: null
        },
        class: {
          default: null
        }
      },
      atom: false,
      content: "text*",
      // editable: true,
      // selectable: true,
      draggable: true,
      group: "block",
      // parseDOM and toDOM is still required to make copy and paste work
      parseDOM: [
        {
          tag: "iframe",
          getAttrs: dom => ({
            src: dom.getAttribute("src"),
            style: dom.getAttribute("style"),
            class: dom.getAttribute("class")
          })
        }
      ],
      toDOM: node => [
        "iframe",
        {
          frameborder: 0,
          allowfullscreen: "true",
          src: node.attrs.src,
          style: node.attrs.style,
          class: node.attrs.class
        },
        0
      ]
    };
  }

  inputRules({ type }) {
    return [nodeInputRule(/^<iframe(.*)<$/, type)];
  }

  commands({ type, schema }) {
    return () => toggleBlockType(type, schema);
  }
  // }
  // commands({ type, schema }) {
  //   return attrs => (state, dispatch, view) => {
  //     const { selection } = state;
  //     const position = selection.$cursor
  //       ? selection.$cursor.pos
  //       : selection.$to.pos;
  //     let $pos = state.doc.resolve(position);
  //     let $parent = $pos.parent;
  //     let updateAttrs = $parent ? _.clone($parent.attrs) : {};
  //
  //     Object.assign(updateAttrs, attrs);
  //
  //     const isActive = nodeIsActive(state, type, attrs);
  //
  //     if (isActive) {
  //       return setBlockType(toggletype)(state, dispatch, view);
  //     }
  //
  //     return setBlockType(type, updateAttrs)(state, dispatch, view);
  //   };
  // }

  get view() {
    return Iframe;
  }
}
