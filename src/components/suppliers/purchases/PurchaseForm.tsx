
import React, { useRef, useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Purchase } from "@/types/purchase";
import { 
  useFormDataManager,
  usePaymentMethods,
  usePurchaseFormItems,
  useFormCalculations,
  useSavePurchase,
  useFormSubmission,
  useInitialItems,
  useDepotEntryPrinting,
  usePrintConfirmation
} from "@/hooks/purchase-form";
import { useFormReset } from "@/hooks/purchase-form/useFormReset";
import { PurchaseFormContent } from "./purchase-form/PurchaseFormContent";
import { PrintConfirmationDialog } from "./PrintConfirmationDialog";

interface PurchaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialPurchase?: Purchase;
  onSave: (purchase: Purchase) => void;
}

export const PurchaseForm = ({ 
  isOpen, 
  onClose, 
  initialPurchase,
  onSave
}: PurchaseFormProps) => {
  // Add local state to control dialog open state
  const [dialogOpen, setDialogOpen] = useState(true);
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

  // Save purchase functionality - Ne pas réinitialiser le formulaire après sauvegarde
  const { completeSaveOperation } = useSavePurchase({
    initialPurchase,
    onSave,
    onClose: () => {
      // Override the onClose to prevent accidental closing
      console.log("onClose called from useSavePurchase but we're preventing it");
      // We do NOT call the actual onClose here
    },
    formData,
    purchaseItems,
    paymentMethods,
    shouldResetForm: false
  });

  // Form submission - Pass proper reset function and related references
  const { handleSubmit } = useFormSubmission({
    isValid,
    purchaseItems,
    showPrintConfirmation,
    completeSaveOperation,
    shouldKeepFormOpen: true,
    resetForm,
    supplierFocusRef,
    setSelectedSupplier
  });

  // Custom handler for dialog close events - only close when explicitly requested via the cancel button
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      console.log("Dialog onOpenChange detected a close attempt");
      // We prevent the automatic closing here by maintaining our local open state
      // The only way to close is through the explicit cancel button
      setDialogOpen(true);
    }
  };

  // Handler for the explicit cancel button
  const handleCancel = () => {
    console.log("Cancel button clicked, closing form");
    setDialogOpen(false);
    // Use a small timeout to ensure React has time to process state changes
    setTimeout(() => onClose(), 50);
  };

  // Calculate unique depots from purchase items
  const uniqueDepots = [...new Set(purchaseItems.map(item => item.depot))].filter(Boolean);

  // Force reopen the dialog if parent tries to close it but we're not ready
  useEffect(() => {
    if (isOpen && !dialogOpen) {
      setDialogOpen(true);
    }
  }, [isOpen]);

  // Return null if the dialog is explicitly closed via cancel button
  if (!dialogOpen) return null;

  // Use our local state to control the dialog
  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <PurchaseFormContent
          formData={formData}
          selectedSupplier={selectedSupplier}
          purchaseItems={purchaseItems}
          paymentMethods={paymentMethods}
          uniqueDepots={uniqueDepots}
          isValid={isValid}
          initialPurchase={initialPurchase}
          supplierFocusRef={supplierFocusRef}
          onSubmit={handleSubmit}
          onClose={handleCancel}
          setFormData={setFormData}
          setSelectedSupplier={setSelectedSupplier}
          addPurchaseItem={addPurchaseItem}
          removePurchaseItem={removePurchaseItem}
          updatePurchaseItem={updatePurchaseItem}
          updatePurchaseItemFields={updatePurchaseItemFields}
          addPaymentMethod={addPaymentMethod}
          removePaymentMethod={removePaymentMethod}
          updatePaymentMethod={updatePaymentMethod}
          printDepotEntry={printDepotEntry}
        />
        
        {/* Hidden div for printing */}
        <div style={{ display: 'none' }}>
          <div ref={printRef}></div>
        </div>

        {/* Print Confirmation Dialog */}
        <PrintConfirmationDialog {...printConfirmationProps} />
      </DialogContent>
    </Dialog>
  );
};
