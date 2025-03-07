
import { PurchaseItem } from '@/types/purchase';

export const useInventoryUpdater = () => {
  // Function to update inventory in localStorage (simulated database)
  const updateInventory = (items: PurchaseItem[]) => {
    try {
      // Get current inventory from localStorage
      const inventoryString = localStorage.getItem('inventory');
      const inventory = inventoryString ? JSON.parse(inventoryString) : [];
      
      // Update inventory with new items
      items.forEach(item => {
        const existingItemIndex = inventory.findIndex(
          (invItem: any) => invItem.id === item.productId && invItem.depot === item.depot
        );
        
        if (existingItemIndex >= 0) {
          // Update existing item quantity
          inventory[existingItemIndex].quantity += item.quantity;
        } else {
          // Add new inventory item
          inventory.push({
            id: item.productId,
            name: item.productName,
            quantity: item.quantity,
            purchasePrice: item.unitPrice,
            sellPrice: item.sellPrice || 0,
            depot: item.depot
          });
        }
      });
      
      // Save updated inventory back to localStorage
      localStorage.setItem('inventory', JSON.stringify(inventory));
      
      return true;
    } catch (error) {
      console.error('Error updating inventory:', error);
      return false;
    }
  };

  return { updateInventory };
};
