
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Purchase } from "@/types/purchase";
import { usePurchaseFormDialog } from "@/hooks/purchase-form/usePurchaseFormDialog";
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
  const {
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
  } = usePurchaseFormDialog({
    isOpen,
    onClose,
    initialPurchase,
    onSave
  });

  // Return null early if dialog is closed
  if (!dialogOpen) return null;

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
