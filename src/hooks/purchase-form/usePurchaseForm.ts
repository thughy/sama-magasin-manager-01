
import { Purchase } from '@/types/purchase';
import { useFormDataManager } from './useFormDataManager';
import { useInventoryUpdater } from './useInventoryUpdater';
import { usePurchaseFormItems } from './usePurchaseFormItems';
import { usePaymentMethods } from './usePaymentMethods';
import { useDepotEntryPrinting } from './useDepotEntryPrinting';
import { usePrintConfirmation } from './usePrintConfirmation';
import { useFormCalculations } from './useFormCalculations';
import { useSavePurchase } from './useSavePurchase';
import { useFormSubmission } from './useFormSubmission';
import { useInitialItems } from './useInitialItems';

interface UsePurchaseFormProps {
  initialPurchase?: Purchase;
  onSave: (purchase: Purchase) => void;
  onClose: () => void;
}

export const usePurchaseForm = ({ initialPurchase, onSave, onClose }: UsePurchaseFormProps) => {
  // Form data management
  const { formData, setFormData, selectedSupplier, setSelectedSupplier } = 
    useFormDataManager({ initialPurchase });
  
  // Purchase items and payment methods management
  const { 
    purchaseItems, 
    setPurchaseItems, 
    addPurchaseItem, 
    removePurchaseItem, 
    updatePurchaseItem 
  } = usePurchaseFormItems();
  
  const { 
    paymentMethods, 
    setPaymentMethods, 
    addPaymentMethod, 
    removePaymentMethod, 
    updatePaymentMethod 
  } = usePaymentMethods();

  // Initialize items from initial purchase
  useInitialItems({
    initialPurchase,
    setPurchaseItems,
    setPaymentMethods
  });

  // Form calculations and validation
  const { isValid, calculateTotals } = useFormCalculations({
    formData,
    setFormData,
    selectedSupplier,
    purchaseItems,
    paymentMethods
  });

  // Printing functionality
  const { printDepotEntry } = useDepotEntryPrinting(formData, purchaseItems);
  const { showPrintConfirmation, PrintConfirmationDialog } = usePrintConfirmation({
    formData,
    purchaseItems
  });

  // Save purchase functionality
  const { completeSaveOperation } = useSavePurchase({
    initialPurchase,
    onSave,
    onClose,
    formData,
    purchaseItems,
    paymentMethods
  });

  // Form submission
  const { handleSubmit } = useFormSubmission({
    isValid,
    purchaseItems,
    showPrintConfirmation,
    completeSaveOperation
  });

  return {
    formData,
    selectedSupplier,
    purchaseItems,
    paymentMethods,
    isValid,
    setFormData,
    setSelectedSupplier,
    addPurchaseItem,
    removePurchaseItem,
    updatePurchaseItem,
    addPaymentMethod,
    removePaymentMethod,
    updatePaymentMethod,
    calculateTotals,
    handleSubmit,
    printDepotEntry,
    PrintConfirmationDialog
  };
};
