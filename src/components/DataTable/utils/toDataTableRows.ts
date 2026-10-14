import type { DataTableColumn, DataTableRowData } from "../types";

export const toDataTableRows = <T extends { id: string }>(
  items: T[],
  columns: DataTableColumn<T>[],
): DataTableRowData[] =>
  items.map((item) => ({
    id: item.id,
    cells: Object.fromEntries(
      columns.map((column) => [column.id, column.cell(item)]),
    ),
  }));
