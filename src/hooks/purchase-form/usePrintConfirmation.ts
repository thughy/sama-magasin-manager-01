
import { useState } from 'react';
import { PurchaseItem } from '@/types/purchase';

interface UsePrintConfirmationProps {
  formData: any;
  purchaseItems: PurchaseItem[];
}

export const usePrintConfirmation = ({ formData, purchaseItems }: UsePrintConfirmationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => boolean | void) | null>(null);

  // Function to show the confirmation dialog
  const showPrintConfirmation = (callback: () => boolean | void) => {
    setOnConfirmCallback(() => callback);
    setIsOpen(true);
  };

  // Function to handle confirmation
  const handleConfirm = () => {
    let result;
    if (onConfirmCallback) {
      result = onConfirmCallback();
    }
    setIsOpen(false);
    return result;
  };

  // Properties for the PrintConfirmationDialog
  const printConfirmationProps = {
    isOpen,
    depots: [...new Set(purchaseItems.filter(item => !!item.depot).map(item => item.depot))],
    handleConfirm,
    onClose: () => setIsOpen(false)
  };

  return {
    showPrintConfirmation,
    printConfirmationProps
  };
};
