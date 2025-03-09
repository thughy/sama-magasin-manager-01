
import React from "react";
import { ProductSearchBox } from "../../ProductSearchBox";
import { Product } from "@/types/purchaseOrder";
import { PurchaseItem } from "@/types/purchase";

interface ProductSelectorProps {
  items: PurchaseItem[];
  onSelectProduct: (product: Product, index: number) => void;
  onAddItem: () => void;
}

export const ProductSelector = ({ items, onSelectProduct, onAddItem }: ProductSelectorProps) => {
  console.log("ProductSelector received items:", items.length);
  
  const handleSelectProduct = (product: Product) => {
    // Find an empty item slot or create a new one
    const emptyItemIndex = items.findIndex(item => !item.productName);
    
    if (emptyItemIndex >= 0) {
      console.log(`Using existing empty item at index ${emptyItemIndex} for product ${product.name}`);
      onSelectProduct(product, emptyItemIndex);
    } else {
      // Add a new item first, then update it
      console.log(`Adding new item for product ${product.name}`);
      onAddItem();
      
      // Use setTimeout to ensure state updates have completed
      setTimeout(() => {
        // The new item will be at the end of the array
        const newIndex = items.length;
        console.log(`Setting product on new item at index ${newIndex}`);
        onSelectProduct(product, newIndex);
      }, 150); // Increased timeout for more reliability
    }
  };

  return (
    <ProductSearchBox
      onSelectProduct={handleSelectProduct}
      currentItems={items.filter(item => item.productId).map(item => parseInt(item.productId) || 0)}
    />
  );
};
