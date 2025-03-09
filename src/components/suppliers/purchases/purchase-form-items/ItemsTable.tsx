
import React, { useEffect } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { PurchaseItem } from "@/types/purchase";
import { ItemsTableHeader } from "./TableHeader";
import { TableItem } from "./TableItem";
import { TableEmptyState } from "./TableEmptyState";

interface ItemsTableProps {
  items: PurchaseItem[];
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, field: keyof PurchaseItem, value: any) => void;
}

export const ItemsTable = ({ items, onRemoveItem, onUpdateItem }: ItemsTableProps) => {
  // Add more detailed logging to trace the items being rendered
  useEffect(() => {
    console.log("ItemsTable rendered with items count:", items.length);
    if (items.length > 0) {
      console.log("ItemsTable first few items:",
        items.slice(0, 3).map((item, idx) => `${idx}: ${item.productName || "empty"}`).join(', '));
    }
  }, [items]);
  
  return (
    <Table>
      <ItemsTableHeader />
      <TableBody>
        {items.length === 0 ? (
          <TableEmptyState />
        ) : (
          items.map((item, index) => (
            <TableItem
              key={`item-${index}`}
              item={item}
              index={index}
              onRemoveItem={onRemoveItem}
              onUpdateItem={onUpdateItem}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};
