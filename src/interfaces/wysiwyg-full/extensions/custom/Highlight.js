import { Mark, updateMark, updateAttrs } from "tiptap";
import HightlightView from "./view/highlight";
export default class highlight extends Mark {
  get name() {
    return "highlight";
  }

  get schema() {
    return {
      attrs: {
        "highlight-id": {
          default: null
        }
      },
      inclusive: true,
      parseDOM: [
        {
          tag: "highlight",
          getAttrs: dom => ({
            "highlight-id": dom.getAttribute("highlight-id")
          })
        }
      ],
      toDOM: mark => [
        "highlight",
        {
          "highlight-id": mark.attrs["highlight-id"]
        },
        0
      ]
    };
  }

  commands({ type, schema }) {
    return attrs => {
      let newHighlightId;
      if (attrs && attrs["highlight-id"]) {
        newHighlightId = attrs["highlight-id"];
      } else {
        newHighlightId = parseInt(Math.random() * 10000000);
      }
      return updateMark(type, { "highlight-id": newHighlightId });
    };
  }

  get view() {
    return HightlightView;
  }
}
