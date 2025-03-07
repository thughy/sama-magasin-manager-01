
import { useRef } from "react";
import { Purchase } from "@/types/purchase";
import { 
  useFormDataManager,
  usePurchaseFormItems,
  usePaymentMethods,
  useFormCalculations,
  useDepotEntryPrinting,
  usePrintConfirmation,
  useInitialItems,
  useFormReset,
  useDialogController,
  useFormSubmitHandler
} from "@/hooks/purchase-form";

interface UsePurchaseFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialPurchase?: Purchase;
  onSave: (purchase: Purchase) => void;
}

export const usePurchaseFormDialog = ({ 
  isOpen, 
  onClose, 
  initialPurchase,
  onSave
}: UsePurchaseFormDialogProps) => {
  // Use dialog controller
  const { dialogOpen, handleCancel } = useDialogController({ isOpen, onClose });
  
  // References
  const printRef = useRef<HTMLDivElement>(null);
  const supplierFocusRef = useRef<HTMLInputElement>(null);
  
  // Form data management
  const { formData, setFormData, selectedSupplier, setSelectedSupplier } = 
    useFormDataManager({ initialPurchase });
  
  // Purchase items and payment methods management
  const { 
    purchaseItems, 
    setPurchaseItems, 
    addPurchaseItem, 
    removePurchaseItem, 
    updatePurchaseItem,
    updatePurchaseItemFields 
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
  const { isValid } = useFormCalculations({
    formData,
    setFormData,
    selectedSupplier,
    purchaseItems,
    paymentMethods
  });

  // Form reset functionality
  const { resetForm } = useFormReset({
    setFormData,
    setPurchaseItems,
    setPaymentMethods,
    selectedSupplier,
    supplierFocusRef
  });

  // Form submission handler
  const { handleSubmit } = useFormSubmitHandler({
    isValid,
    formData,
    purchaseItems,
    paymentMethods,
    initialPurchase,
    supplierFocusRef,
    resetForm,
    onSave
  });

  // Printing functionality
  const { printDepotEntry } = useDepotEntryPrinting(formData, purchaseItems);
  const { showPrintConfirmation, printConfirmationProps } = usePrintConfirmation({
    formData,
    purchaseItems
  });

  // Calculate unique depots from purchase items
  const uniqueDepots = [...new Set(purchaseItems.map(item => item.depot))].filter(Boolean);

  return {
    dialogOpen,
    printRef,
    supplierFocusRef,
    formData,
    selectedSupplier,
    purchaseItems,
    paymentMethods,
    isValid,
    uniqueDepots,
    printConfirmationProps,
    handleInternalSubmit: handleSubmit,
    handleCancel,
    setFormData,
    setSelectedSupplier,
    addPurchaseItem,
    removePurchaseItem,
    updatePurchaseItem,
    updatePurchaseItemFields,
    addPaymentMethod,
    removePaymentMethod,
    updatePaymentMethod,
    printDepotEntry
  };
};
