
import { useState, useEffect, useCallback } from 'react';
import { PurchaseItem } from '@/types/purchase';

export const usePurchaseFormItems = (initialItems: PurchaseItem[] = []) => {
  // Initialize state with a function to avoid reference issues
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>(() => {
    console.log("Initializing usePurchaseFormItems with:", initialItems);
    return initialItems.length > 0 
      ? initialItems.map(item => ({ ...item }))  // Create new objects to avoid reference issues
      : [];
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
      console.log("Items after adding:", newItems);
      return newItems;
    });
  }, []);

  const removePurchaseItem = useCallback((index: number) => {
    console.log(`Removing purchase item at index ${index}`);
    setPurchaseItems(prevItems => prevItems.filter((_, i) => i !== index));
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
      
      console.log(`Item ${index} updated, new value:`, newItems[index]);
      return newItems;
    });
  }, []);

  // New method to update multiple fields at once
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
