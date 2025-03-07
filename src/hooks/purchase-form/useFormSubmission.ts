
import { Purchase } from "@/types/purchase";
import { useFormReset } from "./useFormReset";

interface UseFormSubmitHandlerProps {
  isValid: boolean;
  formData: Omit<Purchase, 'id'> & { id?: string };
  purchaseItems: Purchase['items'];
  paymentMethods: Purchase['paymentMethods'];
  initialPurchase?: Purchase;
  supplierFocusRef: React.RefObject<HTMLInputElement>;
  resetForm: () => void;
  onSave: (purchase: Purchase) => void;
}

export const useFormSubmitHandler = ({
  isValid,
  formData,
  purchaseItems,
  paymentMethods,
  initialPurchase,
  supplierFocusRef,
  resetForm,
  onSave
}: UseFormSubmitHandlerProps) => {
  // Submit handler function
  const handleSubmit = (e: React.FormEvent) => {
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
    
    // Save the purchase and immediately exit the form
    console.log("Saving purchase and closing form:", newPurchase);
    onSave(newPurchase);
  };

  return { handleSubmit };
};

// Export useFormSubmission for backward compatibility
export const useFormSubmission = ({
  isValid,
  purchaseItems,
  showPrintConfirmation,
  completeSaveOperation
}: {
  isValid: boolean;
  purchaseItems: Purchase['items'];
  showPrintConfirmation: () => void;
  completeSaveOperation: () => void;
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      console.log("Form validation failed");
      return;
    }
    
    if (purchaseItems.length === 0) {
      console.log("Cannot submit purchase with no items");
      return;
    }
    
    // Show print confirmation before completing
    showPrintConfirmation();
  };
  
  return { handleSubmit };
};
