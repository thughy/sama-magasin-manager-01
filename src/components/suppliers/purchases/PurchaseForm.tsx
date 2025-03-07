
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
  }, [isOpen]);

  // Return null early if dialog is closed
  if (!dialogOpen) return null;

  // Calculate unique depots from purchase items
  const uniqueDepots = [...new Set(purchaseItems.map(item => item.depot))].filter(Boolean);

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => {
      if (!open) {
        // Prevent automatic closing - we want to control this ourselves
        console.log("Dialog tried to close automatically, preventing");
      }
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
          onSubmit={handleInternalSubmit}
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
