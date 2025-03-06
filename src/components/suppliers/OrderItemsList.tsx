
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash, Plus } from "lucide-react";
import { OrderItem, Product } from "@/types/purchaseOrder";
import { ProductSearchBox } from "./ProductSearchBox";

interface OrderItemsListProps {
  orderItems: OrderItem[];
  onAddItem: () => void;
  onRemoveItem: (id: number) => void;
  onItemChange: (id: number, field: keyof OrderItem, value: string | number) => void;
  onSelectProduct: (id: number, product: Product) => void;
}

export const OrderItemsList = ({
  orderItems,
  onAddItem,
  onRemoveItem,
  onItemChange,
  onSelectProduct,
}: OrderItemsListProps) => {
  const calculateItemTotal = (item: OrderItem) => {
    return item.quantity * item.unitPrice;
  };

  const calculateOrderTotal = () => {
    return orderItems.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Articles</h3>
      
      <ProductSearchBox 
        onSelectProduct={(product) => {
          // Find first empty item or create new one
          const emptyItem = orderItems.find(item => !item.description);
          if (emptyItem) {
            onSelectProduct(emptyItem.id, product);
          } else {
            onAddItem();
            // Need to wait for next render to get the new item
            setTimeout(() => {
              const newItemId = Math.max(...orderItems.map(item => item.id)) + 1;
              onSelectProduct(newItemId, product);
            }, 0);
          }
        }}
        currentItems={orderItems.filter(item => item.description).map(item => parseInt(item.description.split('-')[0] || '0'))}
      />
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Description</TableHead>
            <TableHead className="text-right">Quantité</TableHead>
            <TableHead className="text-right">Prix unitaire</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Input
                  value={item.description}
                  onChange={(e) => onItemChange(item.id, "description", e.target.value)}
                  placeholder="Description de l'article"
                />
              </TableCell>
              <TableCell className="text-right">
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => onItemChange(item.id, "quantity", parseInt(e.target.value) || 0)}
                  className="w-16 ml-auto"
                />
              </TableCell>
              <TableCell className="text-right">
                <Input
                  type="number"
                  min="0"
                  value={item.unitPrice}
                  onChange={(e) => onItemChange(item.id, "unitPrice", parseInt(e.target.value) || 0)}
                  className="w-32 ml-auto"
                />
              </TableCell>
              <TableCell className="text-right font-medium">
                {calculateItemTotal(item).toLocaleString()} F CFA
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onAddItem}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Ajouter un article
        </Button>
        <div className="text-xl font-bold">
          Total: {calculateOrderTotal().toLocaleString()} F CFA
        </div>
      </div>
    </div>
  );
};
