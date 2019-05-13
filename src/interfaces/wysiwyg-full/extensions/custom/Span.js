import { Node } from "tiptap";
import { toggleBlockType, textblockTypeInputRule } from "tiptap-commands";

export default class Span extends Node {
  get name() {
    return "span";
  }

  get schema() {
    return {
      attrs: {
        class: {
          default: null
        },
        style: {
          default: null
        }
      },
      content: "text*",
      group: "block",
      draggable: false,
      parseDOM: [
        {
          tag: "span",
          getAttrs: dom => ({
            class: dom.getAttribute("class"),
            style: dom.getAttribute("style")
          })
        }
      ],

      toDOM: node => [
        "span",
        {
          class: node.attrs.class,
          style: node.attrs.style
        },
        ["p", 0]
      ]
    };
  }
  commands({ type }) {
    return () => toggleBlockType(type);
  }

  inputRules({ type }) {
    return [textblockTypeInputRule(/^<span>$/, type)];
  }
}
