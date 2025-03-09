
import React, { useEffect } from "react";
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
    console.log("ProductSelector items detail:", JSON.stringify(items, null, 2));
  }, [items]);
  
  const handleSelectProduct = (product: Product) => {
    console.log("ProductSelector handleSelectProduct called with product:", product);
    
    // Find an empty item slot or create a new one
    const emptyItemIndex = items.findIndex(item => !item.productId || item.productId === '');
    
    if (emptyItemIndex >= 0) {
      console.log(`Using existing empty item at index ${emptyItemIndex} for product ${product.name}`);
      onSelectProduct(product, emptyItemIndex);
    } else {
      console.log(`No empty item found, adding new item for product ${product.name}`);
      onAddItem();
      
      // Use setTimeout with a longer delay to ensure the new item is added before we try to update it
      setTimeout(() => {
        const newIndex = items.length;
        console.log(`Setting product on new item at index ${newIndex}, current items length: ${items.length}`);
        onSelectProduct(product, newIndex);
      }, 100);
    }
  };

  return (
    <ProductSearchBox
      onSelectProduct={handleSelectProduct}
      currentItems={items.filter(item => item.productId).map(item => parseInt(item.productId) || 0)}
    />
  );
};
