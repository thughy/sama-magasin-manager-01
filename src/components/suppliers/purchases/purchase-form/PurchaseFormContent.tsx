
import React from "react";
import { Purchase, PurchaseItem, PaymentMethod } from "@/types/purchase";
import { Supplier } from "@/data/suppliersData";
import { PurchaseFormHeader } from "../PurchaseFormHeader";
import { PurchaseFormItems } from "../purchase-form-items";
import { PaymentMethodsSection } from "../PaymentMethodsSection";
import { DepotEntryPrintingSection } from "../DepotEntryPrintingSection";
import { PurchaseFormFooter } from "../PurchaseFormFooter";
import { PurchaseFormSummary } from "../PurchaseFormSummary";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PurchaseFormContentProps {
  formData: any;
  selectedSupplier: Supplier | null;
  purchaseItems: PurchaseItem[];
  paymentMethods: PaymentMethod[];
  uniqueDepots: string[];
  isValid: boolean;
  initialPurchase?: Purchase;
  supplierFocusRef: React.RefObject<HTMLInputElement>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setSelectedSupplier: (supplier: Supplier) => void;
  addPurchaseItem: () => void;
  removePurchaseItem: (index: number) => void;
  updatePurchaseItem: (index: number, field: keyof PurchaseItem, value: any) => void;
  updatePurchaseItemFields: (index: number, fieldsToUpdate: Partial<PurchaseItem>) => void;
  addPaymentMethod: () => void;
  removePaymentMethod: (id: string) => void;
  updatePaymentMethod: (id: string, field: keyof PaymentMethod, value: any) => void;
  printDepotEntry: (depot: string) => void;
  onPrintPurchase?: () => void;
}

export const PurchaseFormContent: React.FC<PurchaseFormContentProps> = ({
  formData,
  selectedSupplier,
  purchaseItems,
  paymentMethods,
  uniqueDepots,
  isValid,
  initialPurchase,
  supplierFocusRef,
  onSubmit,
  onClose,
  setFormData,
  setSelectedSupplier,
  addPurchaseItem,
  removePurchaseItem,
  updatePurchaseItem,
  updatePurchaseItemFields,
  addPaymentMethod,
  removePaymentMethod,
  updatePaymentMethod,
  printDepotEntry,
  onPrintPurchase
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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

      {/* Purchase Summary Information */}
      <div className="flex justify-between items-center">
        <PurchaseFormSummary formData={formData} />
        {onPrintPurchase && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrintPurchase}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Imprimer la facture
          </Button>
        )}
      </div>

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
        onSubmit={onSubmit}
      />
    </form>
  );
};
