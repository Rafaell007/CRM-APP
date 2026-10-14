import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import type { TableColumn } from "./Table";

const DETAILS_OPEN =
  "mt-1 flex basis-full flex-col items-start gap-2 border-t border-border pt-2.5";

interface TableRowProps<Id extends string> {
  cells: Record<Id, ReactNode>;
  cardColumns: TableColumn<Id>[];
  detailColumns: TableColumn<Id>[];
  gridTemplateColumns: string;
}

// Mobile: card cells in one line, details wrap below when opened. lg+: one grid row
const TableRow = <Id extends string>({
  cells,
  cardColumns,
  detailColumns,
  gridTemplateColumns,
}: TableRowProps<Id>) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasDetails = detailColumns.length > 0;

  return (
    <li
      className="flex flex-wrap items-center gap-2.5 rounded-lg bg-surface p-3 lg:grid lg:gap-4 lg:bg-transparent lg:px-4 lg:odd:bg-surface"
      style={{ gridTemplateColumns }}
    >
      {cardColumns.map((column, index) => (
        <div key={column.id} className={index === 0 ? "min-w-0 flex-1" : ""}>
          {cells[column.id]}
        </div>
      ))}

      {hasDetails && (
        <>
          <button
            className="group flex size-8 items-center justify-center text-ink lg:hidden"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-label="Toggle details"
          >
            <ChevronDown
              className="transition-transform duration-200 group-aria-expanded:rotate-180"
              size={18}
              aria-hidden="true"
            />
          </button>

          <div className={`${isOpen ? DETAILS_OPEN : "hidden"} lg:contents`}>
            {detailColumns.map((column) => (
              <div key={column.id} className="flex items-center gap-1 text-base">
                <span className="text-muted lg:hidden">{column.header}:</span>
                {cells[column.id]}
              </div>
            ))}
          </div>
        </>
      )}
    </li>
  );
};

export default TableRow;
