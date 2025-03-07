
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
  return (
    <TableRow>
      <TableCell data-testid={`product-name-${index}`}>{item.productName || "—"}</TableCell>
      <TableCell>
        <Input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onUpdateItem(index, 'quantity', Number(e.target.value))}
          className="w-16" // Keep existing width
        />
      </TableCell>
      <TableCell>
        <DepotSelector
          value={item.depot || ""}
          onChange={(value) => {
            console.log(`Updating depot for item ${index} to:`, value);
            onUpdateItem(index, 'depot', value);
          }}
          className="w-full" // Keep existing width class
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min="0"
          value={item.unitPrice}
          onChange={(e) => onUpdateItem(index, 'unitPrice', Number(e.target.value))}
          className="w-24" // Increased width from w-20 to w-24
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min="0"
          value={item.sellPrice || 0}
          onChange={(e) => onUpdateItem(index, 'sellPrice', Number(e.target.value))}
          className="w-24" // Increased width from w-20 to w-24
        />
      </TableCell>
      <TableCell className="font-medium">
        {(item.quantity * item.unitPrice).toLocaleString()}
      </TableCell>
      <TableCell className="font-medium">
        {(item.quantity * (item.sellPrice || 0)).toLocaleString()}
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
