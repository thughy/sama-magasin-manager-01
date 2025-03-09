
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Purchase, PurchaseItem, PaymentMethod } from '@/types/purchase';

interface UsePurchasePrintingProps {
  formData: Omit<Purchase, 'id'> & { id?: string };
  purchaseItems: PurchaseItem[];
  paymentMethods: PaymentMethod[];
}

export const usePurchasePrinting = ({ 
  formData, 
  purchaseItems, 
  paymentMethods 
}: UsePurchasePrintingProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Achat_${formData.reference}`,
    onAfterPrint: () => {
      console.log("Print completed successfully");
    }
  });

  return {
    printRef,
    handlePrint
  };
};
