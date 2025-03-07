
import React, { useRef, useEffect } from "react";
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
    onClose,
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

  // CRITICAL: Use a controlled dialog that never closes itself
  // We're overriding the default Dialog behavior to ensure it stays open
  useEffect(() => {
    // This ensures the dialog never closes on its own
    if (!isOpen) {
      // If the parent component tries to close the dialog, we don't do anything
      console.log("Parent component requested to close dialog, but we're preventing it");
    }
  }, [isOpen]);

  // Calculate unique depots from purchase items
  const uniqueDepots = [...new Set(purchaseItems.map(item => item.depot))].filter(Boolean);

  // CRITICAL: We're using a fixed "true" value for open prop to ensure it always stays open
  // The only way to close it is through the explicit cancel button which calls onClose directly
  return (
    <Dialog open={true} onOpenChange={() => {
      console.log("Dialog onOpenChange triggered, but we're ignoring it");
      // We deliberately don't call onClose here to prevent the dialog from closing
    }}>
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
          onClose={onClose}
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
