
import { useState, useEffect } from 'react';
import { Purchase, PaymentMethod } from '@/types/purchase';
import { Supplier } from '@/data/suppliersData';
import { useToast } from '@/hooks/use-toast';

interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  sellPrice: number;
  depot: string;
}

interface UsePurchaseFormProps {
  initialPurchase?: Purchase;
  onSave: (purchase: Purchase) => void;
  onClose: () => void;
}

export const usePurchaseForm = ({ initialPurchase, onSave, onClose }: UsePurchaseFormProps) => {
  const { toast } = useToast();
  
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
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // Load initial data if editing
  useEffect(() => {
    if (initialPurchase) {
      setFormData({
        ...initialPurchase
      });
      
      // We'll need to reconstruct purchaseItems from initialPurchase
      // In a real app with a proper data model, this would be different
      setPurchaseItems([{
        productId: '0',
        productName: initialPurchase.productName,
        quantity: initialPurchase.quantity,
        unitPrice: initialPurchase.unitPrice,
        sellPrice: 0,
        depot: 'Principal' // Default depot for existing items
      }]);

      // Set payment methods if they exist
      if (initialPurchase.paymentMethods && initialPurchase.paymentMethods.length > 0) {
        setPaymentMethods(initialPurchase.paymentMethods);
      }
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

  // Calculate totals and validate form
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

  // Purchase items management - improved to handle state updates better
  const addPurchaseItem = () => {
    console.log("Adding new purchase item");
    
    const newItem = {
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      sellPrice: 0,
      depot: 'Principal'
    };
    
    setPurchaseItems(items => [...items, newItem]);
    console.log("New item should be added now");
  };

  const removePurchaseItem = (index: number) => {
    setPurchaseItems(items => items.filter((_, i) => i !== index));
  };

  const updatePurchaseItem = (index: number, field: keyof PurchaseItem, value: any) => {
    console.log(`Updating item ${index}, field: ${field}, value:`, value);
    
    setPurchaseItems(items => {
      // Make sure the index is valid
      if (index >= items.length) {
        console.warn(`Invalid index: ${index}, items length: ${items.length}`);
        return items;
      }
      
      // Create a new array with the updated item
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      console.log(`Item ${index} updated, new value:`, newItems[index]);
      return newItems;
    });
  };

  // Payment methods management
  const addPaymentMethod = () => {
    const newPayment: PaymentMethod = {
      id: Date.now().toString(),
      method: 'cash',
      amount: 0
    };
    
    setPaymentMethods(prev => [...prev, newPayment]);
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const updatePaymentMethod = (id: string, field: keyof PaymentMethod, value: any) => {
    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === id ? { ...method, [field]: value } : method
      )
    );
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      toast({
        title: "Formulaire invalide",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    // For simplicity in this example, we'll just use the first item
    // In a real app, this would create multiple purchase records or have a different data model
    const firstItem = purchaseItems[0];
    
    const newPurchase: Purchase = {
      id: initialPurchase?.id || `ACH${Date.now().toString().substring(8)}`,
      reference: formData.reference,
      purchaseDate: formData.purchaseDate,
      supplierId: formData.supplierId,
      supplierName: formData.supplierName,
      productName: firstItem.productName,
      quantity: firstItem.quantity,
      unitPrice: firstItem.unitPrice,
      totalAmount: formData.totalAmount,
      totalPaid: formData.totalPaid,
      balance: formData.balance,
      status: formData.status,
      paymentMethods: paymentMethods
    };
    
    onSave(newPurchase);
    toast({
      title: initialPurchase ? "Achat mis à jour" : "Nouvel achat créé",
      description: `L'achat a été ${initialPurchase ? 'mis à jour' : 'créé'} avec succès.`
    });
    onClose();
  };

  return {
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
    calculateTotals,
    handleSubmit
  };
};
