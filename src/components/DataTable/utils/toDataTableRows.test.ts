import { describe, it, expect } from "vitest";
import { toDataTableRows } from "./toDataTableRows";
import type { DataTableColumn } from "../types";

interface Item {
  id: string;
  name: string;
  price: number;
}

const columns: DataTableColumn<Item>[] = [
  { id: "name", header: "Name", cell: (item) => item.name },
  { id: "price", header: "Price", cell: (item) => `${item.price} zł` },
];

describe("toDataTableRows", () => {
  it("turns each item into a row with one cell per column", () => {
    const items = [
      { id: "1", name: "Soup", price: 12 },
      { id: "2", name: "Pizza", price: 30 },
    ];

    expect(toDataTableRows(items, columns)).toEqual([
      { id: "1", cells: { name: "Soup", price: "12 zł" } },
      { id: "2", cells: { name: "Pizza", price: "30 zł" } },
    ]);
  });

  it("returns no rows for no items", () => {
    expect(toDataTableRows([], columns)).toEqual([]);
  });
});
