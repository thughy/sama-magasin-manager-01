
import { useState, useEffect } from 'react';
import { Purchase, PaymentMethod, PurchaseItem } from '@/types/purchase';
import { Supplier } from '@/data/suppliersData';
import { useToast } from '@/hooks/use-toast';
import { useInventoryUpdater } from './useInventoryUpdater';
import { usePurchaseFormItems } from './usePurchaseFormItems';
import { usePaymentMethods } from './usePaymentMethods';
import { useDepotEntryPrinting } from './useDepotEntryPrinting';
import { usePrintConfirmation } from './usePrintConfirmation';

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
  const [isValid, setIsValid] = useState(false);
  
  // Use custom hooks for different functionality
  const { updateInventory } = useInventoryUpdater();
  const { 
    purchaseItems, 
    setPurchaseItems, 
    addPurchaseItem, 
    removePurchaseItem, 
    updatePurchaseItem 
  } = usePurchaseFormItems();
  const { 
    paymentMethods, 
    setPaymentMethods, 
    addPaymentMethod, 
    removePaymentMethod, 
    updatePaymentMethod 
  } = usePaymentMethods();
  const { printDepotEntry } = useDepotEntryPrinting(formData, purchaseItems);
  const { showPrintConfirmation, PrintConfirmationDialog } = usePrintConfirmation({
    formData,
    purchaseItems
  });

  // Load initial data if editing
  useEffect(() => {
    if (initialPurchase) {
      setFormData({
        ...initialPurchase
      });
      
      // Load purchase items if they exist
      if (initialPurchase.items && initialPurchase.items.length > 0) {
        setPurchaseItems(initialPurchase.items);
      } else {
        // We'll need to reconstruct purchaseItems from initialPurchase
        setPurchaseItems([{
          productId: '0',
          productName: initialPurchase.productName,
          quantity: initialPurchase.quantity,
          unitPrice: initialPurchase.unitPrice,
          sellPrice: 0,
          depot: 'Principal' // Default depot for existing items
        }]);
      }

      // Set payment methods if they exist
      if (initialPurchase.paymentMethods && initialPurchase.paymentMethods.length > 0) {
        setPaymentMethods(initialPurchase.paymentMethods);
      }
    }
  }, [initialPurchase, setPurchaseItems, setPaymentMethods]);

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

  // The actual save operation after confirmation
  const completeSaveOperation = () => {
    // For backward compatibility, use the first item's details
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
      paymentMethods: paymentMethods,
      items: purchaseItems
    };
    
    // Update inventory
    const inventoryUpdated = updateInventory(purchaseItems);
    
    if (!inventoryUpdated) {
      toast({
        title: "Erreur de mise à jour",
        description: "Impossible de mettre à jour l'inventaire. Veuillez réessayer.",
        variant: "destructive",
      });
      return;
    }
    
    // Save purchase
    onSave(newPurchase);
    
    toast({
      title: initialPurchase ? "Achat mis à jour" : "Nouvel achat créé",
      description: `L'achat a été ${initialPurchase ? 'mis à jour' : 'créé'} avec succès et le stock a été mis à jour.`
    });
    
    onClose();
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

    // Check if there are items with depots
    const hasDepotsSelected = purchaseItems.some(item => !!item.depot);
    
    if (hasDepotsSelected) {
      // Show confirmation dialog for printing
      showPrintConfirmation(completeSaveOperation);
    } else {
      // No depots to print, proceed with save
      completeSaveOperation();
    }
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
    handleSubmit,
    printDepotEntry,
    PrintConfirmationDialog
  };
};
