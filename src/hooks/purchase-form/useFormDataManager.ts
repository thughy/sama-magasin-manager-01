
import { useState, useEffect } from 'react';
import { Purchase } from '@/types/purchase';
import { Supplier } from '@/data/suppliersData';

interface UseFormDataManagerProps {
  initialPurchase?: Purchase;
}

export const useFormDataManager = ({ initialPurchase }: UseFormDataManagerProps) => {
  const [formData, setFormData] = useState<Omit<Purchase, 'id'> & { id?: string }>({
    reference: `F-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    purchaseDate: new Date().toISOString().split('T')[0],
    supplierId: 0,
    supplierName: '',
    productName: '',
    quantity: 0,
    unitPrice: 0,
    totalAmount: 0,
    totalPaid: 0,
    balance: 0,
    status: 'impayée',
    paymentMethods: []
  });

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Load initial data if editing
  useEffect(() => {
    if (initialPurchase) {
      setFormData({
        ...initialPurchase
      });
    }
  }, [initialPurchase]);

  // Update supplier info when supplier is selected
  useEffect(() => {
    if (selectedSupplier) {
      setFormData(prev => ({
        ...prev,
        supplierId: selectedSupplier.id,
        supplierName: selectedSupplier.name
      }));
    }
  }, [selectedSupplier]);

  return {
    formData,
    setFormData,
    selectedSupplier,
    setSelectedSupplier
  };
};
