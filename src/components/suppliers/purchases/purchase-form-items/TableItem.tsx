
import React from "react";
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
  console.log(`Rendering TableItem at index ${index} with item:`, item);
  
  // Calculate subtotals
  const purchaseSubtotal = (item.quantity || 0) * (item.unitPrice || 0);
  const sellSubtotal = (item.quantity || 0) * (item.sellPrice || 0);
  
  return (
    <TableRow key={`purchase-item-${index}`}>
      <TableCell data-testid={`product-name-${index}`}>{item.productName || "—"}</TableCell>
      <TableCell>
        <Input
          type="number"
          min="1"
          value={item.quantity || 1}
          onChange={(e) => onUpdateItem(index, 'quantity', Number(e.target.value))}
          className="w-16"
        />
      </TableCell>
      <TableCell>
        <DepotSelector
          value={item.depot || "Principal"}
          onChange={(value) => {
            console.log(`Updating depot for item ${index} to:`, value);
            onUpdateItem(index, 'depot', value);
          }}
          className="w-full"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min="0"
          value={item.unitPrice || 0}
          onChange={(e) => onUpdateItem(index, 'unitPrice', Number(e.target.value))}
          className="w-24"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min="0"
          value={item.sellPrice || 0}
          onChange={(e) => onUpdateItem(index, 'sellPrice', Number(e.target.value))}
          className="w-24"
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
        >
          <Trash className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
