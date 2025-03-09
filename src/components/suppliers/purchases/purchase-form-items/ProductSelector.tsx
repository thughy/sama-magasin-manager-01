
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
    const emptyItemIndex = items.findIndex(item => !item.productName || item.productName === '');
    
    if (emptyItemIndex >= 0) {
      console.log(`Using existing empty item at index ${emptyItemIndex} for product ${product.name}`);
      onSelectProduct(product, emptyItemIndex);
    } else {
      // Add a new item first and then update it in the next render cycle
      console.log(`No empty item found, adding new item for product ${product.name}`);
      onAddItem();
      
      // Use setTimeout to ensure the new item is added before we try to update it
      setTimeout(() => {
        // The new item should be at the end of the array
        const newIndex = items.length;
        console.log(`Setting product on new item at index ${newIndex}, current items length: ${items.length}`);
        onSelectProduct(product, newIndex);
      }, 0);
    }
  };

  return (
    <ProductSearchBox
      onSelectProduct={handleSelectProduct}
      currentItems={items.filter(item => item.productId).map(item => parseInt(item.productId) || 0)}
    />
  );
};
