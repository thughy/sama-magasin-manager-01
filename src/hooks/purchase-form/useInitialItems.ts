
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
    console.log("useInitialItems - initialPurchase:", initialPurchase);
    
    if (initialPurchase) {
      // Load purchase items if they exist
      if (initialPurchase.items && initialPurchase.items.length > 0) {
        console.log("Setting purchase items from initialPurchase.items:", initialPurchase.items);
        
        // Create a fresh array with new object references
        const itemsCopy = initialPurchase.items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          sellPrice: item.sellPrice || 0,
          depot: item.depot || 'Principal'
        }));
        
        console.log("Mapped items copy:", itemsCopy);
        setPurchaseItems(itemsCopy);
      } else {
        // We'll need to reconstruct purchaseItems from initialPurchase
        console.log("Reconstructing purchase items from initialPurchase single item");
        setPurchaseItems([{
          productId: initialPurchase.productName ? '0' : '',
          productName: initialPurchase.productName || '',
          quantity: initialPurchase.quantity || 1,
          unitPrice: initialPurchase.unitPrice || 0,
          sellPrice: 0,
          depot: 'Principal' // Default depot for existing items
        }]);
      }

      // Set payment methods if they exist
      if (initialPurchase.paymentMethods && initialPurchase.paymentMethods.length > 0) {
        // Create a fresh array with new object references
        const methodsCopy = initialPurchase.paymentMethods.map(method => ({
          id: method.id,
          method: method.method,
          amount: method.amount
        }));
        
        setPaymentMethods(methodsCopy);
      }
    }
  }, [initialPurchase, setPurchaseItems, setPaymentMethods]);
};
