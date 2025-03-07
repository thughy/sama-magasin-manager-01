
import React from "react";
import { ItemsHeader } from "./ItemsHeader";
import { ItemsTable } from "./ItemsTable";
import { ProductSelector } from "./ProductSelector";
import { PurchaseItem } from "@/types/purchase";
import { Product } from "@/types/purchaseOrder";

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
  // A new direct state update function that doesn't rely on callbacks
  const handleSelectProduct = (product: Product, index: number) => {
    console.log("Product selected in PurchaseFormItems:", product, "for index:", index);
    
    // Create a complete item update rather than updating fields individually
    const updatedItem = {
      ...items[index],
      productId: String(product.id),
      productName: String(product.name),
      unitPrice: Number(product.purchasePrice),
      sellPrice: Number(product.sellPrice)
    };
    
    console.log("Will update item to:", updatedItem);
    
    // Update each field with a slight delay between them
    setTimeout(() => {
      onUpdateItem(index, 'productId', updatedItem.productId);
      
      setTimeout(() => {
        onUpdateItem(index, 'productName', updatedItem.productName);
        
        setTimeout(() => {
          onUpdateItem(index, 'unitPrice', updatedItem.unitPrice);
          
          setTimeout(() => {
            onUpdateItem(index, 'sellPrice', updatedItem.sellPrice);
            console.log("All fields should be updated now");
          }, 50);
        }, 50);
      }, 50);
    }, 50);
  };

  return (
    <div className="space-y-4">
      <ItemsHeader onAddItem={onAddItem} />
      
      <ProductSelector 
        items={items} 
        onSelectProduct={handleSelectProduct} 
        onAddItem={onAddItem} 
      />

      <ItemsTable 
        items={items} 
        onRemoveItem={onRemoveItem} 
        onUpdateItem={onUpdateItem} 
      />
    </div>
  );
};
