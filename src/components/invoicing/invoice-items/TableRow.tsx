
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
    if (typeof value === 'number') return value;
    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const calculateTotalPrice = (quantity: number, unitPrice: number, discount: number): number => {
    const discountMultiplier = (100 - discount) / 100;
    return quantity * unitPrice * discountMultiplier;
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Math.max(1, ensureNumber(e.target.value));
    onUpdateItem(item.id, "quantity", newQuantity);
    
    // Also update the total price whenever quantity changes
    const unitPrice = ensureNumber(item.unitPrice);
    const discount = ensureNumber(item.discount || 0);
    const newTotalPrice = calculateTotalPrice(newQuantity, unitPrice, discount);
    onUpdateItem(item.id, "totalPrice", newTotalPrice);
    
    console.log("handleQuantityChange", { newQuantity, unitPrice, discount, newTotalPrice });
  };

  const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUnitPrice = Math.max(0, ensureNumber(e.target.value));
    onUpdateItem(item.id, "unitPrice", newUnitPrice);
    
    // Also update the total price whenever unit price changes
    const quantity = ensureNumber(item.quantity);
    const discount = ensureNumber(item.discount || 0);
    const newTotalPrice = calculateTotalPrice(quantity, newUnitPrice, discount);
    onUpdateItem(item.id, "totalPrice", newTotalPrice);
    
    console.log("handleUnitPriceChange", { quantity, newUnitPrice, discount, newTotalPrice });
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDiscount = Math.min(100, Math.max(0, ensureNumber(e.target.value)));
    onUpdateItem(item.id, "discount", newDiscount);
    
    // Also update the total price whenever discount changes
    const quantity = ensureNumber(item.quantity);
    const unitPrice = ensureNumber(item.unitPrice);
    const newTotalPrice = calculateTotalPrice(quantity, unitPrice, newDiscount);
    onUpdateItem(item.id, "totalPrice", newTotalPrice);
    
    console.log("handleDiscountChange", { quantity, unitPrice, newDiscount, newTotalPrice });
  };

  // Ensure item values are numbers for display
  const displayQuantity = ensureNumber(item.quantity);
  const displayUnitPrice = ensureNumber(item.unitPrice);
  const displayDiscount = ensureNumber(item.discount || 0);
  const displayTotalPrice = ensureNumber(item.totalPrice);

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
          value={displayQuantity}
          onChange={handleQuantityChange}
          className="w-20"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min="0"
          value={displayUnitPrice}
          onChange={handleUnitPriceChange}
          className="w-28"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min="0"
          max="100"
          value={displayDiscount}
          onChange={handleDiscountChange}
          className="w-20"
        />
      </TableCell>
      <TableCell className="text-right font-medium">
        {displayTotalPrice.toLocaleString()} FCFA
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
