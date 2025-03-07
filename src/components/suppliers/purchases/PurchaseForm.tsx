
import React, { useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Purchase } from "@/types/purchase";
import { usePurchaseForm } from "@/hooks/purchase-form";
import { PurchaseFormHeader } from "./PurchaseFormHeader";
import { PurchaseFormItems } from "./PurchaseFormItems";
import { PaymentMethodsSection } from "./PaymentMethodsSection";
import { DepotEntryPrintingSection } from "./DepotEntryPrintingSection";
import { PurchaseFormFooter } from "./PurchaseFormFooter";

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
  
  const {
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
    handleSubmit,
    printDepotEntry,
    PrintConfirmationDialog
  } = usePurchaseForm({ initialPurchase, onSave, onClose });

  // Calculate unique depots from purchase items
  const uniqueDepots = [...new Set(purchaseItems.map(item => item.depot))].filter(Boolean);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Header and Basic Information */}
          <PurchaseFormHeader
            reference={formData.reference}
            purchaseDate={formData.purchaseDate}
            selectedSupplier={selectedSupplier}
            onReferenceChange={(value) => setFormData({...formData, reference: value})}
            onPurchaseDateChange={(value) => setFormData({...formData, purchaseDate: value})}
            onSupplierChange={setSelectedSupplier}
          />

          {/* Purchase Items Section */}
          <PurchaseFormItems 
            items={purchaseItems}
            onAddItem={addPurchaseItem}
            onRemoveItem={removePurchaseItem}
            onUpdateItem={updatePurchaseItem}
          />

          {/* Payment Methods Section */}
          <PaymentMethodsSection
            paymentMethods={paymentMethods}
            onAddPaymentMethod={addPaymentMethod}
            onRemovePaymentMethod={removePaymentMethod}
            onUpdatePaymentMethod={updatePaymentMethod}
          />
          
          {/* Depot Entry Printing Section */}
          <DepotEntryPrintingSection
            uniqueDepots={uniqueDepots}
            onPrintDepotEntry={printDepotEntry}
          />

          {/* Form Footer with Totals and Actions */}
          <PurchaseFormFooter
            formData={formData}
            isValid={isValid}
            isEditing={!!initialPurchase}
            onCancel={onClose}
            onSubmit={handleSubmit}
          />
        </form>
        
        {/* Hidden div for printing */}
        <div style={{ display: 'none' }}>
          <div ref={printRef}></div>
        </div>

        {/* Print Confirmation Dialog */}
        <PrintConfirmationDialog />
      </DialogContent>
    </Dialog>
  );
};
