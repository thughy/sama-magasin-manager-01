
import { useRef, useEffect, useState } from "react";
import { Purchase } from "@/types/purchase";
import { 
  useFormDataManager,
  usePurchaseFormItems,
  usePaymentMethods,
  useFormCalculations,
  useDepotEntryPrinting,
  usePrintConfirmation,
  useInitialItems,
  useFormReset
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
  // Internal dialog state - this is what we'll use to control the dialog
  const [dialogOpen, setDialogOpen] = useState(isOpen);
  const printRef = useRef<HTMLDivElement>(null);
  
  // Create a reference to the supplier input for focusing after save
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

  // Printing functionality
  const { printDepotEntry } = useDepotEntryPrinting(formData, purchaseItems);
  const { showPrintConfirmation, printConfirmationProps } = usePrintConfirmation({
    formData,
    purchaseItems
  });

  // Submit handler function
  const handleInternalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form internally submitted, checking validity...");
    
    if (!isValid) {
      console.log("Form is invalid, not proceeding");
      return;
    }

    // Create a new purchase object
    const newPurchase: Purchase = {
      id: initialPurchase?.id || `ACH${Date.now().toString().substring(8)}`,
      reference: formData.reference,
      purchaseDate: formData.purchaseDate,
      supplierId: formData.supplierId,
      supplierName: formData.supplierName,
      productName: purchaseItems[0]?.productName || '',
      quantity: purchaseItems[0]?.quantity || 0,
      unitPrice: purchaseItems[0]?.unitPrice || 0,
      totalAmount: formData.totalAmount,
      totalPaid: formData.totalPaid,
      balance: formData.balance,
      status: formData.status,
      paymentMethods: paymentMethods,
      items: purchaseItems
    };
    
    // Save the purchase
    console.log("Saving purchase:", newPurchase);
    onSave(newPurchase);

    // Reset the form for next entry
    console.log("Purchase saved, resetting form for next entry");
    resetForm();
    
    // Focus the supplier input for the next entry
    setTimeout(() => {
      if (supplierFocusRef.current) {
        supplierFocusRef.current.focus();
        console.log("Focus set on supplier input for next entry");
      }
    }, 100);
  };

  // Manual cancel handler
  const handleCancel = () => {
    console.log("Cancel button clicked, closing form");
    setDialogOpen(false);
    setTimeout(() => onClose(), 50);
  };

  // Sync our internal state with parent's isOpen prop
  useEffect(() => {
    if (isOpen !== dialogOpen) {
      console.log(`Syncing dialog state: parent=${isOpen}, internal=${dialogOpen}`);
      setDialogOpen(isOpen);
    }
  }, [isOpen, dialogOpen]);

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
    handleInternalSubmit,
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
