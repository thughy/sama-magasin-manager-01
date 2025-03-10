
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceItem } from "@/services/api/invoicing";
import { InvoiceItemRow } from "./TableRow";

interface ItemsTableProps {
  items: InvoiceItem[];
  onUpdateItem: (id: string, field: keyof InvoiceItem, value: any) => void;
  onRemoveItem: (id: string) => void;
}

export function ItemsTable({ items, onUpdateItem, onRemoveItem }: ItemsTableProps) {
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Article/Service</TableHead>
            <TableHead className="w-24">Quantité</TableHead>
            <TableHead className="w-32">Prix unitaire</TableHead>
            <TableHead className="w-24">Remise (%)</TableHead>
            <TableHead className="w-32 text-right">Total</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <InvoiceItemRow
              key={item.id}
              item={item}
              onUpdateItem={onUpdateItem}
              onRemoveItem={onRemoveItem}
            />
          ))}
          <TableRow>
            <TableCell colSpan={4} className="text-right font-bold">
              Total
            </TableCell>
            <TableCell className="text-right font-bold">
              {totalAmount.toLocaleString()} FCFA
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
