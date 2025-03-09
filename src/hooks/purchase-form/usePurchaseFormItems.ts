
import { useState, useEffect } from 'react';
import { PurchaseItem } from '@/types/purchase';

export const usePurchaseFormItems = (initialItems: PurchaseItem[] = []) => {
  // Create a deep copy of initialItems to prevent reference issues
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>(() => {
    console.log("Initializing usePurchaseFormItems with:", initialItems);
    return initialItems.length > 0 ? JSON.parse(JSON.stringify(initialItems)) : [];
  });

  // Log when purchaseItems changes
  useEffect(() => {
    console.log("usePurchaseFormItems - Current purchase items:", purchaseItems);
  }, [purchaseItems]);

  // Initialize with at least one empty item if none provided
  useEffect(() => {
    if (purchaseItems.length === 0) {
      console.log("Adding default empty purchase item");
      addPurchaseItem();
    }
  }, []);

  const addPurchaseItem = () => {
    console.log("Adding new purchase item");
    
    const newItem = {
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      sellPrice: 0,
      depot: '' // Initialize with an empty value
    };
    
    setPurchaseItems(items => {
      const newItems = [...items, newItem];
      console.log("Items after adding:", newItems.length);
      return newItems;
    });
  };

  const removePurchaseItem = (index: number) => {
    console.log(`Removing purchase item at index ${index}`);
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
