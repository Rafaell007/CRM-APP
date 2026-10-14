import type { ReactNode } from "react";
import TableRow from "./TableRow";

export interface TableColumn<Id extends string = string> {
  id: Id;
  header: string;
  width?: string;
  mobile?: "card" | "details";
}

export interface TableRowData<Id extends string = string> {
  id: string;
  cells: Record<Id, ReactNode>;
}

interface TableProps<Id extends string> {
  columns: TableColumn<Id>[];
  rows: TableRowData<NoInfer<Id>>[];
  toolbar?: ReactNode;
  framed?: boolean;
  className?: string;
}

const Table = <Id extends string>({
  columns,
  rows,
  toolbar,
  framed = true,
  className = "",
}: TableProps<Id>) => {
  const cardColumns = columns.filter((column) => column.mobile === "card");
  const detailColumns = columns.filter((column) => column.mobile !== "card");
  // Rows render card cells first, so the header uses the same order
  const orderedColumns = [...cardColumns, ...detailColumns];

  const gridTemplateColumns = orderedColumns
    .map((column) => column.width ?? "1fr")
    .join(" ");

  const frame = framed ? "rounded-xl bg-panel p-3" : "";

  return (
    <section className={`flex flex-col ${frame} ${className}`}>
      {toolbar && <div className="sticky top-0 z-20 bg-panel">{toolbar}</div>}

      <div className="min-h-0 flex-1 overflow-auto">
        <div
          className="sticky top-0 z-10 hidden items-center gap-4 bg-panel px-4 pb-2.5 text-sm text-muted lg:grid"
          style={{ gridTemplateColumns }}
        >
          {orderedColumns.map((column) => (
            <span key={column.id}>{column.header}</span>
          ))}
        </div>

        <ul className="flex flex-col gap-2 lg:gap-0">
          {rows.map((row) => (
            <TableRow
              key={row.id}
              cells={row.cells}
              cardColumns={cardColumns}
              detailColumns={detailColumns}
              gridTemplateColumns={gridTemplateColumns}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Table;
