
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
  const handleSelectProduct = (product: Product) => {
    // If there's an empty item, use it, otherwise add a new one
    const emptyItemIndex = items.findIndex(item => !item.productName);
    if (emptyItemIndex >= 0) {
      onSelectProduct(product, emptyItemIndex);
    } else {
      // First add the item, then wait for the state to update before setting the product
      onAddItem();
      
      // Use a longer timeout to ensure the new item is properly added to the state
      setTimeout(() => {
        // Make sure we're updating the correct index (which should be the last item)
        const newIndex = items.length;
        console.log("Adding to new item at index:", newIndex);
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
