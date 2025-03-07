
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
import { PurchaseFormHeader } from "./PurchaseFormHeader";
import { PurchaseFormItems } from "./PurchaseFormItems";
import { PaymentMethodsSection } from "./PaymentMethodsSection";
import { DepotEntryPrintingSection } from "./DepotEntryPrintingSection";
import { PurchaseFormFooter } from "./PurchaseFormFooter";
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
  const { isValid, calculateTotals } = useFormCalculations({
    formData,
    setFormData,
    selectedSupplier,
    purchaseItems,
    paymentMethods
  });

  // Printing functionality
  const { printDepotEntry } = useDepotEntryPrinting(formData, purchaseItems);
  const { showPrintConfirmation, printConfirmationProps } = usePrintConfirmation({
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

  // Function to reset the form after successful submission
  const resetForm = () => {
    // Reset form data
    setFormData({
      reference: `F-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      purchaseDate: new Date().toISOString().split('T')[0],
      supplierId: selectedSupplier ? selectedSupplier.id : 0,
      supplierName: selectedSupplier ? selectedSupplier.name : '',
      productName: '',
      quantity: 0,
      unitPrice: 0,
      totalAmount: 0,
      totalPaid: 0,
      balance: 0,
      status: 'impayée',
    });
    
    // Clear items but keep the supplier
    setPurchaseItems([]);
    setPaymentMethods([]);
    
    // Focus on supplier input after form reset
    setTimeout(() => {
      if (supplierFocusRef.current) {
        supplierFocusRef.current.focus();
      }
    }, 100);
  };

  // Form submission with option to keep form open
  const { handleSubmit } = useFormSubmission({
    isValid,
    purchaseItems,
    showPrintConfirmation: (callback) => {
      showPrintConfirmation(() => {
        const success = callback();
        if (success !== undefined) {
          if (success) {
            resetForm();
          }
          return success;
        }
        return true;
      });
    },
    completeSaveOperation: (shouldCloseForm) => {
      const success = completeSaveOperation(shouldCloseForm);
      if (success && !shouldCloseForm) {
        resetForm();
      }
      return success;
    },
    shouldKeepFormOpen: true
  });

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
            supplierFocusRef={supplierFocusRef}
          />

          {/* Purchase Items Section */}
          <PurchaseFormItems 
            items={purchaseItems}
            onAddItem={addPurchaseItem}
            onRemoveItem={removePurchaseItem}
            onUpdateItem={updatePurchaseItem}
            onUpdateItemFields={updatePurchaseItemFields}
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
        <PrintConfirmationDialog {...printConfirmationProps} />
      </DialogContent>
    </Dialog>
  );
};
