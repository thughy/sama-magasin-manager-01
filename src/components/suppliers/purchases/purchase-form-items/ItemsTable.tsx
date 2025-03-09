
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
    console.log("ItemsTable items:", JSON.stringify(items));
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
              key={`item-${index}-${item.productId || 'empty'}`}
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
