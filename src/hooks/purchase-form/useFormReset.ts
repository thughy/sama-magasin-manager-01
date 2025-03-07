import { Supplier } from "@/data/suppliersData";
import { useEffect } from "react";

interface UseFormResetProps {
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setPurchaseItems: React.Dispatch<React.SetStateAction<any[]>>;
  setPaymentMethods: React.Dispatch<React.SetStateAction<any[]>>;
  selectedSupplier: Supplier | null;
  supplierFocusRef: React.RefObject<HTMLInputElement>;
}

export const useFormReset = ({
  setFormData,
  setPurchaseItems,
  setPaymentMethods,
  selectedSupplier,
  supplierFocusRef
}: UseFormResetProps) => {
  // Function to reset the form after successful submission
  const resetForm = () => {
    // Reset form data but keep the supplier
    setFormData(prev => ({
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
    }));
    
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

  return { resetForm };
};
