
import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { PurchaseItem } from "@/types/purchase";
import { DepotSelector } from "../DepotSelector";

interface ItemsTableProps {
  items: PurchaseItem[];
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, field: keyof PurchaseItem, value: any) => void;
}

export const ItemsTable = ({ items, onRemoveItem, onUpdateItem }: ItemsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Article</TableHead>
          <TableHead>Quantité</TableHead>
          <TableHead>Dépôt</TableHead>
          <TableHead>Prix d'achat (FCFA)</TableHead>
          <TableHead>Prix de vente (FCFA)</TableHead>
          <TableHead>Total Achat</TableHead>
          <TableHead>Total Vente</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
              Aucun article. Utilisez le champ de recherche ou le bouton "Ajouter" pour ajouter des articles.
            </TableCell>
          </TableRow>
        ) : (
          items.map((item, index) => (
            <TableRow key={index}>
              <TableCell data-testid={`product-name-${index}`}>{item.productName || "—"}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => onUpdateItem(index, 'quantity', Number(e.target.value))}
                  className="w-20"
                />
              </TableCell>
              <TableCell>
                <DepotSelector
                  value={item.depot || "Principal"}
                  onChange={(value) => onUpdateItem(index, 'depot', value)}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="0"
                  value={item.unitPrice}
                  onChange={(e) => onUpdateItem(index, 'unitPrice', Number(e.target.value))}
                  className="w-28"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="0"
                  value={item.sellPrice || 0}
                  onChange={(e) => onUpdateItem(index, 'sellPrice', Number(e.target.value))}
                  className="w-28"
                />
              </TableCell>
              <TableCell className="font-medium">
                {(item.quantity * item.unitPrice).toLocaleString()}
              </TableCell>
              <TableCell className="font-medium">
                {(item.quantity * item.sellPrice).toLocaleString()}
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
          ))
        )}
      </TableBody>
    </Table>
  );
};
