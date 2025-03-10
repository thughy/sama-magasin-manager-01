
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ItemSearchBox } from "./ItemSearchBox";
import { ProformaItem, ProformaItemsTable } from "./ProformaItemsTable";
import { Item } from "@/types/product";

interface ProformaItemsProps {
  items: ProformaItem[];
  onAddItem: (item: Item) => void;
  onUpdateItem: (id: string, field: string, value: string | number) => void;
  onRemoveItem: (id: string) => void;
}

export function ProformaItems({ 
  items, 
  onAddItem, 
  onUpdateItem, 
  onRemoveItem 
}: ProformaItemsProps) {
  const handleSelectItem = (item: Item) => {
    onAddItem(item);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Articles et services</h3>
      </div>
      
      <ItemSearchBox onSelectItem={handleSelectItem} />
      
      <ProformaItemsTable 
        items={items} 
        onUpdateItem={onUpdateItem} 
        onRemoveItem={onRemoveItem} 
      />
    </div>
  );
}
