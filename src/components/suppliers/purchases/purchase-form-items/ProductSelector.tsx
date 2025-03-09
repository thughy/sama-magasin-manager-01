
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
    console.log("ProductSelector received items:", JSON.stringify(items));
  }, [items]);
  
  // Create a memoized product selection handler
  const handleSelectProduct = useCallback((product: Product) => {
    console.log("ProductSelector handleSelectProduct called with product:", product);
    
    // First add a new item, then in the next render cycle update it
    onAddItem();
    
    // Use setTimeout to ensure the new item is added before setting the product
    setTimeout(() => {
      // Get the latest empty item
      const newIndex = items.length;
      console.log(`Setting product on new item at index ${newIndex}`);
      onSelectProduct(product, newIndex);
    }, 100);
    
  }, [items, onAddItem, onSelectProduct]);

  return (
    <ProductSearchBox
      onSelectProduct={handleSelectProduct}
      currentItems={items.filter(item => item.productId).map(item => parseInt(item.productId) || 0)}
    />
  );
};
