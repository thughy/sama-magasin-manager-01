
import { useEffect, useState } from 'react';
import { Purchase, PurchaseItem, PaymentMethod } from '@/types/purchase';
import { Supplier } from '@/data/suppliersData';

interface UseFormCalculationsProps {
  formData: Omit<Purchase, 'id'> & { id?: string };
  setFormData: React.Dispatch<React.SetStateAction<Omit<Purchase, 'id'> & { id?: string }>>;
  selectedSupplier: Supplier | null;
  purchaseItems: PurchaseItem[];
  paymentMethods: PaymentMethod[];
}

export const useFormCalculations = ({
  formData,
  setFormData,
  selectedSupplier,
  purchaseItems,
  paymentMethods
}: UseFormCalculationsProps) => {
  const [isValid, setIsValid] = useState(false);

  // Calculate totals
  const calculateTotals = () => {
    const totalAmount = purchaseItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalPaid = paymentMethods.reduce((sum, method) => sum + method.amount, 0);
    const balance = totalAmount - totalPaid;
    
    setFormData(prev => ({
      ...prev,
      totalAmount,
      totalPaid,
      balance,
      status: balance <= 0 ? 'payée' : 'impayée'
    }));
  };

  // Validate form on data changes
  useEffect(() => {
    calculateTotals();
    
    const isFormValid = 
      formData.reference?.trim() !== '' && 
      formData.purchaseDate?.trim() !== '' &&
      selectedSupplier !== null &&
      purchaseItems.length > 0 &&
      purchaseItems.every(item => 
        item.quantity > 0 && 
        item.unitPrice > 0 && 
        item.depot
      );
    
    setIsValid(isFormValid);
  }, [formData, selectedSupplier, purchaseItems, paymentMethods]);

  return {
    isValid,
    calculateTotals
  };
};
