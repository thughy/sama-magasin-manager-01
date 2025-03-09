
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
    documentTitle: `Achat_${formData.reference}`,
    onAfterPrint: () => {
      console.log("Print completed successfully");
    },
    // The contentRef option is now used instead of content
    contentRef: printRef
  });

  return {
    printRef,
    handlePrint
  };
};
