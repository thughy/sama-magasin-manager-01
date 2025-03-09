
import React, { useEffect } from "react";
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
  onUpdateItemFields?: (index: number, fieldsToUpdate: Partial<PurchaseItem>) => void;
}

export const PurchaseFormItems = ({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onUpdateItemFields
}: PurchaseFormItemsProps) => {
  // Improved logging to track component state
  useEffect(() => {
    console.log("PurchaseFormItems rendered with items count:", items.length);
    console.log("PurchaseFormItems items:", JSON.stringify(items));
  }, [items]);

  // A more robust product selection handler that uses onUpdateItemFields when available
  const handleSelectProduct = (product: Product, index: number) => {
    console.log("Product selected in PurchaseFormItems:", product.name, "for index:", index);
    
    if (onUpdateItemFields) {
      // If the parent component provided the multi-field update function, use it
      onUpdateItemFields(index, {
        productId: String(product.id),
        productName: String(product.name),
        unitPrice: Number(product.purchasePrice),
        sellPrice: Number(product.sellPrice)
      });
    } else {
      // Fallback to individual field updates
      onUpdateItem(index, 'productId', String(product.id));
      onUpdateItem(index, 'productName', String(product.name));
      onUpdateItem(index, 'unitPrice', Number(product.purchasePrice));
      onUpdateItem(index, 'sellPrice', Number(product.sellPrice));
    }
    
    console.log("Product fields updated for index:", index);
  };

  return (
    <div className="space-y-4" data-testid="purchase-form-items">
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
