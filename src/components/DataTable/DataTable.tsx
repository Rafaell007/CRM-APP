import type { ReactNode } from "react";
import DataTableRow from "./DataTableRow";
import type { DataTableColumn, DataTableRowData } from "./types";

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: DataTableRowData[];
  toolbar?: ReactNode;
  framed?: boolean;
  className?: string;
}

const DataTable = <T,>({
  columns,
  rows,
  toolbar,
  framed = true,
  className = "",
}: DataTableProps<T>) => {
  const isCard = (column: DataTableColumn<T>, index: number) =>
    column.mobile ? column.mobile === "card" : index === 0;

  const cardColumns = columns.filter(isCard);
  const detailColumns = columns.filter((column, index) => !isCard(column, index));
  const orderedColumns = [...cardColumns, ...detailColumns];


  const gridTemplateColumns = orderedColumns
    .map((_, index) => (index === 0 ? "minmax(0, 1fr)" : "auto"))
    .join(" ");

  const frame = framed ? "rounded-xl bg-panel p-3" : "";

  return (
    <section className={`flex flex-col ${frame} ${className}`}>
      {toolbar && <div className="sticky top-0 z-20 bg-panel">{toolbar}</div>}

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="lg:grid lg:gap-x-4" style={{ gridTemplateColumns }}>
          <div className="sticky top-0 z-10 col-span-full hidden grid-cols-subgrid items-center bg-panel px-4 pb-2.5 text-sm text-muted lg:grid">
            {orderedColumns.map((column) => (
              <span key={column.id}>{column.header}</span>
            ))}
          </div>

          <ul className="flex flex-col gap-2 lg:col-span-full lg:grid lg:grid-cols-subgrid lg:gap-y-0">
            {rows.map((row) => (
              <DataTableRow
                key={row.id}
                cells={row.cells}
                cardColumns={cardColumns}
                detailColumns={detailColumns}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DataTable;
