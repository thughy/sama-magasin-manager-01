
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
        setPurchaseItems([...initialPurchase.items]); // Create a new array to ensure state update
      } else {
        // We'll need to reconstruct purchaseItems from initialPurchase
        console.log("Reconstructing purchase items from initialPurchase single item");
        setPurchaseItems([{
          productId: '0',
          productName: initialPurchase.productName,
          quantity: initialPurchase.quantity,
          unitPrice: initialPurchase.unitPrice,
          sellPrice: 0,
          depot: 'Principal' // Default depot for existing items
        }]);
      }

      // Set payment methods if they exist
      if (initialPurchase.paymentMethods && initialPurchase.paymentMethods.length > 0) {
        setPaymentMethods([...initialPurchase.paymentMethods]); // Create a new array to ensure state update
      }
    }
  }, [initialPurchase, setPurchaseItems, setPaymentMethods]);
};
