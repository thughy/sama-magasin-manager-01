
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { OrderItem } from "@/types/purchaseOrder";

interface OrderItemsListProps {
  orderItems: OrderItem[];
  onAddItem: () => void;
  onRemoveItem: (id: number) => void;
  onItemChange: (id: number, field: keyof OrderItem, value: string | number) => void;
}

export const OrderItemsList = ({ 
  orderItems, 
  onAddItem, 
  onRemoveItem, 
  onItemChange 
}: OrderItemsListProps) => {
  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Articles</h3>
        <Button variant="outline" size="sm" onClick={onAddItem}>
          <Plus className="h-4 w-4 mr-2" /> Ajouter
        </Button>
      </div>
      
      <div className="space-y-4">
        {orderItems.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-5">
              <Label htmlFor={`item-${item.id}-desc`}>Description</Label>
              <Input 
                id={`item-${item.id}-desc`} 
                value={item.description} 
                onChange={(e) => onItemChange(item.id, "description", e.target.value)}
                placeholder="Description de l'article"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor={`item-${item.id}-qty`}>Quantité</Label>
              <Input 
                id={`item-${item.id}-qty`} 
                type="number" 
                min="1"
                value={item.quantity} 
                onChange={(e) => onItemChange(item.id, "quantity", parseInt(e.target.value))}
              />
            </div>
            <div className="col-span-3">
              <Label htmlFor={`item-${item.id}-price`}>Prix unitaire (FCFA)</Label>
              <Input 
                id={`item-${item.id}-price`} 
                type="number"
                min="0" 
                value={item.unitPrice} 
                onChange={(e) => onItemChange(item.id, "unitPrice", parseInt(e.target.value))}
              />
            </div>
            <div className="col-span-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onRemoveItem(item.id)}
                disabled={orderItems.length <= 1}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end mt-4">
        <div className="w-1/3">
          <div className="flex justify-between py-2">
            <span className="font-medium">Total:</span>
            <span className="font-medium">{calculateTotal().toLocaleString()} FCFA</span>
          </div>
        </div>
      </div>
    </div>
  );
};
