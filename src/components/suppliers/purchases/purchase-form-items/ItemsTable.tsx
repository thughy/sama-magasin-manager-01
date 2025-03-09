
import React from "react";
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
  console.log("ItemsTable rendering with items:", items);
  
  return (
    <Table>
      <ItemsTableHeader />
      <TableBody>
        {items.length === 0 ? (
          <TableEmptyState />
        ) : (
          items.map((item, index) => (
            <TableItem
              key={`item-${index}`} // Add a more specific key with index
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
