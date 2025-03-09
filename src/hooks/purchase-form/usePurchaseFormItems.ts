
import { useState, useEffect, useCallback } from 'react';
import { PurchaseItem } from '@/types/purchase';

export const usePurchaseFormItems = (initialItems: PurchaseItem[] = []) => {
  // Initialize state with a function to avoid reference issues
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>(() => {
    console.log("Initializing usePurchaseFormItems with:", initialItems);
    
    // Create a deep copy to avoid reference issues
    return initialItems.length > 0 
      ? initialItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          sellPrice: item.sellPrice || 0,
          depot: item.depot || 'Principal'
        }))
      : [];
  });

  // Log when purchaseItems changes
  useEffect(() => {
    console.log("usePurchaseFormItems - Current purchase items count:", purchaseItems.length);
    console.log("usePurchaseFormItems - Current purchase items:", JSON.stringify(purchaseItems, null, 2));
  }, [purchaseItems]);

  // Initialize with at least one empty item if none provided
  useEffect(() => {
    if (purchaseItems.length === 0) {
      console.log("Adding default empty purchase item");
      addPurchaseItem();
    }
  }, []);

  const addPurchaseItem = useCallback(() => {
    console.log("Adding new purchase item");
    
    const newItem = {
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      sellPrice: 0,
      depot: 'Principal' // Initialize with a default value
    };
    
    setPurchaseItems(prevItems => {
      const newItems = [...prevItems, newItem];
      console.log("Items after adding:", newItems.length);
      return newItems;
    });
  }, []);

  const removePurchaseItem = useCallback((index: number) => {
    console.log(`Removing purchase item at index ${index}`);
    setPurchaseItems(prevItems => {
      const newItems = prevItems.filter((_, i) => i !== index);
      console.log(`Items after removing index ${index}:`, newItems.length);
      return newItems;
    });
  }, []);

  const updatePurchaseItem = useCallback((index: number, field: keyof PurchaseItem, value: any) => {
    console.log(`Updating item ${index}, field: ${field}, value:`, value);
    
    setPurchaseItems(prevItems => {
      // Make sure the index is valid
      if (index >= prevItems.length) {
        console.warn(`Invalid index: ${index}, items length: ${prevItems.length}`);
        return prevItems;
      }
      
      // Create a new array with the updated item
      const newItems = [...prevItems];
      newItems[index] = { ...newItems[index], [field]: value };
      
      console.log(`Item ${index} updated, field: ${field}, new value:`, newItems[index][field]);
      return newItems;
    });
  }, []);

  // Method to update multiple fields at once with improved debugging
  const updatePurchaseItemFields = useCallback((index: number, fieldsToUpdate: Partial<PurchaseItem>) => {
    console.log(`Updating multiple fields for item ${index}:`, fieldsToUpdate);
    
    setPurchaseItems(prevItems => {
      // Make sure the index is valid
      if (index >= prevItems.length) {
        console.warn(`Invalid index: ${index}, items length: ${prevItems.length}`);
        return prevItems;
      }
      
      // Create a new array with the updated item
      const newItems = [...prevItems];
      newItems[index] = { ...newItems[index], ...fieldsToUpdate };
      
      console.log(`Item ${index} updated with multiple fields, new value:`, newItems[index]);
      return newItems;
    });
  }, []);

  return {
    purchaseItems,
    setPurchaseItems,
    addPurchaseItem,
    removePurchaseItem,
    updatePurchaseItem,
    updatePurchaseItemFields
  };
};
