
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
    if (onConfirmCallback) {
      onConfirmCallback();
    }
    setIsOpen(false);
  };

  // Print Confirmation Dialog component
  const PrintConfirmationDialog = () => {
    // Get all unique depots that have items
    const depots = [...new Set(purchaseItems.filter(item => !!item.depot).map(item => item.depot))];
    
    return {
      isOpen,
      depots,
      handleConfirm,
      onClose: () => setIsOpen(false)
    };
  };

  return {
    showPrintConfirmation,
    PrintConfirmationDialog
  };
};
