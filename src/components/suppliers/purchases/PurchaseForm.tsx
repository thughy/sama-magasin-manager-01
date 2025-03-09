
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Purchase } from "@/types/purchase";
import { usePurchaseFormDialog } from "@/hooks/purchase-form/usePurchaseFormDialog";
import { PurchaseFormContent } from "./purchase-form/PurchaseFormContent";
import { PrintConfirmationDialog } from "./PrintConfirmationDialog";
import { X } from "lucide-react";
import { PrintablePurchase } from "./PrintablePurchase";
import { usePurchasePrinting } from "@/hooks/purchase-form/usePurchasePrinting";

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
    printRef: depotPrintRef,
    supplierFocusRef,
    formData,
    selectedSupplier,
    purchaseItems,
    paymentMethods,
    isValid,
    uniqueDepots,
    printConfirmationProps,
    handleInternalSubmit,
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

  // Add purchase printing functionality
  const { printRef: purchasePrintRef, handlePrint: handlePrintPurchase } = usePurchasePrinting({
    formData,
    purchaseItems,
    paymentMethods
  });

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          type="button"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fermer</span>
        </button>
        
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
          onPrintPurchase={handlePrintPurchase}
        />
        
        {/* Hidden print components */}
        <div style={{ display: 'none' }}>
          <div ref={depotPrintRef}></div>
          <PrintablePurchase 
            ref={purchasePrintRef}
            purchase={formData}
            items={purchaseItems}
            paymentMethods={paymentMethods}
          />
        </div>

        <PrintConfirmationDialog {...printConfirmationProps} />
      </DialogContent>
    </Dialog>
  );
};
