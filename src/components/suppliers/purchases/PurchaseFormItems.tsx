
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Trash, Plus } from "lucide-react";
import { ProductSearchBox } from "../ProductSearchBox";
import { Product } from "@/types/purchaseOrder";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Liste des dépôts (dans une application réelle, cela viendrait d'une API ou d'un store)
const depots = [
  "Principal",
  "Secondaire",
  "Entrepôt central",
  "Magasin 1",
  "Magasin 2"
];

interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  sellPrice: number;
  depot: string;
}

interface PurchaseFormItemsProps {
  items: PurchaseItem[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, field: keyof PurchaseItem, value: any) => void;
}

export const PurchaseFormItems = ({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem
}: PurchaseFormItemsProps) => {
  const handleSelectProduct = (product: Product, index: number) => {
    onUpdateItem(index, 'productId', product.id.toString());
    onUpdateItem(index, 'productName', product.name);
    onUpdateItem(index, 'unitPrice', product.purchasePrice);
    onUpdateItem(index, 'sellPrice', product.sellPrice);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Articles</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddItem}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Ajouter
        </Button>
      </div>

      <ProductSearchBox
        onSelectProduct={(product) => {
          // If there's an empty item, use it, otherwise add a new one
          const emptyItemIndex = items.findIndex(item => !item.productName);
          if (emptyItemIndex >= 0) {
            handleSelectProduct(product, emptyItemIndex);
          } else {
            onAddItem();
            // Need to wait for state update
            setTimeout(() => {
              handleSelectProduct(product, items.length);
            }, 0);
          }
        }}
        currentItems={[]}
      />

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
                <TableCell>{item.productName || "—"}</TableCell>
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
                  <Select
                    value={item.depot || "Principal"}
                    onValueChange={(value) => onUpdateItem(index, 'depot', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sélectionner un dépôt" />
                    </SelectTrigger>
                    <SelectContent>
                      {depots.map((depot) => (
                        <SelectItem key={depot} value={depot}>
                          {depot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    readOnly
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
    </div>
  );
};
