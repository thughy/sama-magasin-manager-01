
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

export interface ProformaItem {
  id: string;
  name: string;
  type: "product" | "service";
  quantity: number;
  unitPrice: number;
}

interface ProformaItemsTableProps {
  items: ProformaItem[];
  onUpdateItem: (id: string, field: string, value: string | number) => void;
  onRemoveItem: (id: string) => void;
}

export function ProformaItemsTable({ items, onUpdateItem, onRemoveItem }: ProformaItemsTableProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Aucun article ajouté à la facture
      </div>
    );
  }

  const calculateItemTotal = (item: ProformaItem) => {
    return item.quantity * item.unitPrice;
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Article/Service</TableHead>
            <TableHead className="w-24">Quantité</TableHead>
            <TableHead className="w-32">Prix unitaire</TableHead>
            <TableHead className="w-32 text-right">Total</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => onUpdateItem(item.id, "quantity", Number(e.target.value) || 1)}
                  className="w-20"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="0"
                  value={item.unitPrice}
                  onChange={(e) => onUpdateItem(item.id, "unitPrice", Number(e.target.value) || 0)}
                  className="w-28"
                />
              </TableCell>
              <TableCell className="text-right font-medium">
                {calculateItemTotal(item).toLocaleString()} XOF
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
          ))}
          <TableRow>
            <TableCell colSpan={3} className="text-right font-bold">
              Total
            </TableCell>
            <TableCell className="text-right font-bold">
              {calculateTotal().toLocaleString()} XOF
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
