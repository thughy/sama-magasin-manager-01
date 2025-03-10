
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
  // Function to ensure we're working with numbers
  const ensureNumber = (value: any): number => {
    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Math.max(1, ensureNumber(e.target.value));
    onUpdateItem(item.id, "quantity", newQuantity);
  };

  const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUnitPrice = Math.max(0, ensureNumber(e.target.value));
    onUpdateItem(item.id, "unitPrice", newUnitPrice);
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDiscount = Math.min(100, Math.max(0, ensureNumber(e.target.value)));
    onUpdateItem(item.id, "discount", newDiscount);
  };

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
          onChange={handleQuantityChange}
          className="w-20"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min="0"
          value={item.unitPrice}
          onChange={handleUnitPriceChange}
          className="w-28"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min="0"
          max="100"
          value={item.discount || 0}
          onChange={handleDiscountChange}
          className="w-20"
        />
      </TableCell>
      <TableCell className="text-right font-medium">
        {ensureNumber(item.totalPrice).toLocaleString()} FCFA
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
