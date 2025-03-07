
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
    if (initialPurchase) {
      // Load purchase items if they exist
      if (initialPurchase.items && initialPurchase.items.length > 0) {
        setPurchaseItems(initialPurchase.items);
      } else {
        // We'll need to reconstruct purchaseItems from initialPurchase
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
        setPaymentMethods(initialPurchase.paymentMethods);
      }
    }
  }, [initialPurchase, setPurchaseItems, setPaymentMethods]);
};
