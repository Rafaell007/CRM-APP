import type { ReactNode } from "react";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  cell: (item: T) => ReactNode;
  mobile?: "card" | "details";
}

export interface DataTableRowData {
  id: string;
  cells: Record<string, ReactNode>;
}
