
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface ProformaItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface ProformaItemsProps {
  items: ProformaItem[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, field: string, value: string | number) => void;
  getTotalAmount: () => number;
}

export function ProformaItems({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  getTotalAmount,
}: ProformaItemsProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Articles</h3>
        <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
          <Plus size={16} className="mr-2" /> Ajouter un article
        </Button>
      </div>
      
      {items.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted text-xs">
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-right w-20">Quantité</th>
                <th className="px-4 py-2 text-right w-28">Prix unit.</th>
                <th className="px-4 py-2 text-right w-28">Total</th>
                <th className="px-4 py-2 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">
                    <Input 
                      value={item.description}
                      onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
                      placeholder="Description de l'article"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input 
                      type="number"
                      value={item.quantity}
                      onChange={(e) => onUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      min="1"
                      className="text-right"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input 
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => onUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      min="0"
                      className="text-right"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    {item.total.toLocaleString()} F
                  </td>
                  <td className="px-4 py-2 text-center">
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="h-8 w-8 p-0"
                    >
                      &times;
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t bg-muted font-medium">
                <td colSpan={3} className="px-4 py-2 text-right">Total</td>
                <td className="px-4 py-2 text-right">{getTotalAmount().toLocaleString()} F</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="border rounded-md p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Aucun article ajouté. Cliquez sur "Ajouter un article" pour commencer.
          </p>
        </div>
      )}
    </div>
  );
}
