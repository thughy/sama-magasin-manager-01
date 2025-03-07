
import { useState } from 'react';
import { PurchaseItem } from '@/types/purchase';

export const usePurchaseFormItems = (initialItems: PurchaseItem[] = []) => {
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>(initialItems);

  const addPurchaseItem = () => {
    console.log("Adding new purchase item");
    
    const newItem = {
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      sellPrice: 0,
      depot: '' // Initialiser avec une valeur vide
    };
    
    setPurchaseItems(items => [...items, newItem]);
    console.log("New item should be added now");
  };

  const removePurchaseItem = (index: number) => {
    setPurchaseItems(items => items.filter((_, i) => i !== index));
  };

  const updatePurchaseItem = (index: number, field: keyof PurchaseItem, value: any) => {
    console.log(`Updating item ${index}, field: ${field}, value:`, value);
    
    setPurchaseItems(items => {
      // Make sure the index is valid
      if (index >= items.length) {
        console.warn(`Invalid index: ${index}, items length: ${items.length}`);
        return items;
      }
      
      // Create a new array with the updated item
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      console.log(`Item ${index} updated, new value for ${field}:`, newItems[index][field]);
      return newItems;
    });
  };

  // New method to update multiple fields at once
  const updatePurchaseItemFields = (index: number, fieldsToUpdate: Partial<PurchaseItem>) => {
    console.log(`Updating multiple fields for item ${index}:`, fieldsToUpdate);
    
    setPurchaseItems(items => {
      // Make sure the index is valid
      if (index >= items.length) {
        console.warn(`Invalid index: ${index}, items length: ${items.length}`);
        return items;
      }
      
      // Create a new array with the updated item
      const newItems = [...items];
      newItems[index] = { ...newItems[index], ...fieldsToUpdate };
      
      console.log(`Item ${index} updated with multiple fields, new value:`, newItems[index]);
      return newItems;
    });
  };

  return {
    purchaseItems,
    setPurchaseItems,
    addPurchaseItem,
    removePurchaseItem,
    updatePurchaseItem,
    updatePurchaseItemFields
  };
};
