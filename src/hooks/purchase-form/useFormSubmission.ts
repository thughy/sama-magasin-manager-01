
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

  return { handleSubmit };
};
