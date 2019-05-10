import { Node } from "tiptap";
import {
  tableEditing,
  columnResizing,
  goToNextCell,
  addColumnBefore,
  addColumnAfter,
  deleteColumn,
  addRowBefore,
  addRowAfter,
  deleteRow,
  deleteTable,
  mergeCells,
  splitCell,
  toggleHeaderColumn,
  toggleHeaderRow,
  toggleHeaderCell,
  setCellAttr,
  fixTables
} from "prosemirror-tables";
import { createTable } from "prosemirror-utils";
import TableNodes from "./../helpers/TableNodes";

export default class Table extends Node {
  get name() {
    return "table";
  }

  get schema() {
    return TableNodes.table;
  }

  commands({ schema }) {
    console.log(TableNodes);
    return {
      createTable: ({ rowsCount, colsCount, withHeaderRow }) => (state, dispatch) => {
        const nodes = createTable(schema, rowsCount, colsCount, withHeaderRow);
        const tr = state.tr.replaceSelectionWith(nodes).scrollIntoView();
        dispatch(tr);
      },
      addColumnBefore: () => addColumnBefore,
      addColumnAfter: () => addColumnAfter,
      deleteColumn: () => deleteColumn,
      addRowBefore: () => addRowBefore,
      addRowAfter: () => addRowAfter,
      deleteRow: () => deleteRow,
      deleteTable: () => deleteTable,
      toggleCellMerge: () => (state, dispatch) => {
        if (mergeCells(state, dispatch)) {
          return;
        }
        splitCell(state, dispatch);
      },
      mergeCells: () => mergeCells,
      splitCell: () => splitCell,
      toggleHeaderColumn: () => toggleHeaderColumn,
      toggleHeaderRow: () => toggleHeaderRow,
      toggleHeaderCell: () => toggleHeaderCell,
      setCellAttr: () => setCellAttr,
      fixTables: () => fixTables
    };
  }

  keys() {
    return {
      Tab: goToNextCell(1),
      "Shift-Tab": goToNextCell(-1)
    };
  }

  get plugins() {
    return [columnResizing(), tableEditing()];
  }
}
