
import React, { useEffect, useCallback } from "react";
import { ProductSearchBox } from "../../ProductSearchBox";
import { Product } from "@/types/purchaseOrder";
import { PurchaseItem } from "@/types/purchase";

interface ProductSelectorProps {
  items: PurchaseItem[];
  onSelectProduct: (product: Product, index: number) => void;
  onAddItem: () => void;
}

export const ProductSelector = ({ items, onSelectProduct, onAddItem }: ProductSelectorProps) => {
  // Add effect to log items when they change
  useEffect(() => {
    console.log("ProductSelector received items:", items.length);
  }, [items]);
  
  // Create a memoized product selection handler
  const handleSelectProduct = useCallback((product: Product) => {
    console.log("ProductSelector handleSelectProduct called with product:", product);
    
    // Find an empty item slot or create a new one
    const emptyItemIndex = items.findIndex(item => !item.productId || item.productId === '');
    
    if (emptyItemIndex >= 0) {
      console.log(`Using existing empty item at index ${emptyItemIndex} for product ${product.name}`);
      onSelectProduct(product, emptyItemIndex);
    } else {
      console.log(`No empty item found, adding new item for product ${product.name}`);
      // Add the item first, then wait for the state to update
      onAddItem();
      
      // Use setTimeout to ensure the new item is added before updating it
      setTimeout(() => {
        const newIndex = items.length;
        console.log(`Setting product on new item at index ${newIndex}`);
        onSelectProduct(product, newIndex);
      }, 200); // Increased timeout for better reliability
    }
  }, [items, onAddItem, onSelectProduct]);

  return (
    <ProductSearchBox
      onSelectProduct={handleSelectProduct}
      currentItems={items.filter(item => item.productId).map(item => parseInt(item.productId) || 0)}
    />
  );
};
