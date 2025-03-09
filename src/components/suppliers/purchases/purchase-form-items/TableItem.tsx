
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash } from "lucide-react";
import { PurchaseItem } from "@/types/purchase";
import { DepotSelector } from "../DepotSelector";

interface TableItemProps {
  item: PurchaseItem;
  index: number;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, field: keyof PurchaseItem, value: any) => void;
}

export const TableItem = ({ item, index, onRemoveItem, onUpdateItem }: TableItemProps) => {
  // Add effect to log when item changes
  useEffect(() => {
    console.log(`TableItem at index ${index} rendered with:`, JSON.stringify(item));
  }, [item, index]);
  
  // Calculate subtotals
  const purchaseSubtotal = (item.quantity || 0) * (item.unitPrice || 0);
  const sellSubtotal = (item.quantity || 0) * (item.sellPrice || 0);
  
  return (
    <TableRow data-testid={`item-row-${index}`}>
      <TableCell data-testid={`product-name-${index}`}>
        {item.productName || "—"}
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min="1"
          value={item.quantity || 1}
          onChange={(e) => onUpdateItem(index, 'quantity', Number(e.target.value))}
          className="w-16"
          data-testid={`quantity-input-${index}`}
        />
      </TableCell>
      <TableCell>
        <DepotSelector
          value={item.depot || "Principal"}
          onChange={(value) => onUpdateItem(index, 'depot', value)}
          className="w-full"
          data-testid={`depot-selector-${index}`}
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min="0"
          value={item.unitPrice || 0}
          onChange={(e) => onUpdateItem(index, 'unitPrice', Number(e.target.value))}
          className="w-24"
          data-testid={`unit-price-input-${index}`}
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min="0"
          value={item.sellPrice || 0}
          onChange={(e) => onUpdateItem(index, 'sellPrice', Number(e.target.value))}
          className="w-24"
          data-testid={`sell-price-input-${index}`}
        />
      </TableCell>
      <TableCell className="font-medium">
        {purchaseSubtotal.toLocaleString()}
      </TableCell>
      <TableCell className="font-medium">
        {sellSubtotal.toLocaleString()}
      </TableCell>
      <TableCell>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemoveItem(index)}
          data-testid={`remove-item-${index}`}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
