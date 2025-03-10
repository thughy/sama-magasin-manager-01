
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { InvoiceItem } from "@/services/api/invoicing";

interface InvoiceItemRowProps {
  item: InvoiceItem;
  onUpdateItem: (id: string, field: keyof InvoiceItem, value: any) => void;
  onRemoveItem: (id: string) => void;
}

export function InvoiceItemRow({ item, onUpdateItem, onRemoveItem }: InvoiceItemRowProps) {
  return (
    <TableRow key={item.id}>
      <TableCell>
        <div className="flex items-center">
          {item.productName}
          {item.type === 'service' && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
              Service
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => {
            const newQuantity = Number(e.target.value) || 1;
            onUpdateItem(item.id, "quantity", newQuantity);
            onUpdateItem(item.id, "totalPrice", newQuantity * item.unitPrice);
          }}
          className="w-20"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min="0"
          value={item.unitPrice}
          onChange={(e) => {
            const newUnitPrice = Number(e.target.value) || 0;
            onUpdateItem(item.id, "unitPrice", newUnitPrice);
            onUpdateItem(item.id, "totalPrice", item.quantity * newUnitPrice);
          }}
          className="w-28"
        />
      </TableCell>
      <TableCell className="text-right font-medium">
        {item.totalPrice.toLocaleString()} FCFA
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemoveItem(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
