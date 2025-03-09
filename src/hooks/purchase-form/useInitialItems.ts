
import { useEffect } from 'react';
import { Purchase, PurchaseItem, PaymentMethod } from '@/types/purchase';

interface UseInitialItemsProps {
  initialPurchase?: Purchase;
  setPurchaseItems: React.Dispatch<React.SetStateAction<PurchaseItem[]>>;
  setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethod[]>>;
}

export const useInitialItems = ({
  initialPurchase,
  setPurchaseItems,
  setPaymentMethods
}: UseInitialItemsProps) => {
  // Load initial purchase items and payment methods if editing
  useEffect(() => {
    console.log("useInitialItems - initialPurchase:", initialPurchase?.id);
    
    if (initialPurchase) {
      // Load purchase items if they exist
      if (initialPurchase.items && initialPurchase.items.length > 0) {
        console.log("Setting purchase items from initialPurchase.items, count:", initialPurchase.items.length);
        console.log("Items details:", JSON.stringify(initialPurchase.items));
        
        // Create a completely fresh copy using JSON to avoid reference issues
        const itemsCopy = JSON.parse(JSON.stringify(initialPurchase.items));
        
        console.log("Items to set:", JSON.stringify(itemsCopy));
          
        setPurchaseItems(itemsCopy);
      } else {
        // We'll need to reconstruct purchaseItems from initialPurchase single item data
        console.log("Reconstructing purchase items from initialPurchase single item");
        
        const singleItem = {
          productId: initialPurchase.supplierId ? String(initialPurchase.supplierId) : '',
          productName: initialPurchase.productName || '',
          quantity: initialPurchase.quantity || 1,
          unitPrice: initialPurchase.unitPrice || 0,
          sellPrice: 0,
          depot: 'Principal'
        };
        
        console.log("Created single item:", JSON.stringify(singleItem));
        setPurchaseItems([singleItem]);
      }

      // Set payment methods if they exist
      if (initialPurchase.paymentMethods && initialPurchase.paymentMethods.length > 0) {
        // Create a fresh array with new object references
        const methodsCopy = JSON.parse(JSON.stringify(initialPurchase.paymentMethods));
        setPaymentMethods(methodsCopy);
      }
    } else {
      // Always start with at least one empty item for a new purchase
      setPurchaseItems([{
        productId: '',
        productName: '',
        quantity: 1,
        unitPrice: 0,
        sellPrice: 0,
        depot: 'Principal'
      }]);
    }
  }, [initialPurchase, setPurchaseItems, setPaymentMethods]);
};
