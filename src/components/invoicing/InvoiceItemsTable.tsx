import { useState } from "react";
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
import { InvoiceItem } from "@/services/api/invoicing";
import { Item } from "@/types/product";
import { ItemSearchBox } from "./ItemSearchBox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  onAddItem: (item: any) => void;
  onUpdateItem: (id: string, field: keyof InvoiceItem, value: any) => void;
  onRemoveItem: (id: string) => void;
}

export function InvoiceItemsTable({ 
  items, 
  onAddItem, 
  onUpdateItem, 
  onRemoveItem 
}: InvoiceItemsTableProps) {
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  
  const handleItemSelect = (item: Item) => {
    const newItem = {
      id: `item-${Date.now()}`,
      productId: item.id,
      productName: item.name,
      quantity: 1,
      unitPrice: item.type === 'product' ? item.sellPrice : item.amount,
      totalPrice: item.type === 'product' ? item.sellPrice : item.amount,
      type: item.type
    };
    
    onAddItem(newItem);
    setIsAddItemDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Articles et services</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAddItemDialogOpen(true)}
        >
          Ajouter un article/service
        </Button>
      </div>
      
      {items.length === 0 ? (
        <div className="border rounded-md p-8 text-center">
          <p className="text-muted-foreground">Aucun article/service dans la facture. Cliquez sur "Ajouter un article/service" pour commencer.</p>
        </div>
      ) : (
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
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-bold">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold">
                  {items.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString()} FCFA
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un article ou service</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <ItemSearchBox 
              onSelectItem={handleItemSelect} 
              onShowAddItemDialog={() => {
                console.log("Fonctionnalité: Ajouter un nouvel article");
              }} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
