
import { Purchase, PurchaseItem, PaymentMethod } from '@/types/purchase';
import { useToast } from '@/hooks/use-toast';
import { useInventoryUpdater } from './useInventoryUpdater';

interface SaveOperationResult {
  success: boolean;
  shouldReset?: boolean;
}

interface UseSavePurchaseProps {
  initialPurchase?: Purchase;
  onSave: (purchase: Purchase) => void;
  onClose: () => void;
  formData: Omit<Purchase, 'id'> & { id?: string };
  purchaseItems: PurchaseItem[];
  paymentMethods: PaymentMethod[];
  shouldResetForm?: boolean;
}

export const useSavePurchase = ({
  initialPurchase,
  onSave,
  onClose,
  formData,
  purchaseItems,
  paymentMethods,
  shouldResetForm = false
}: UseSavePurchaseProps) => {
  const { toast } = useToast();
  const { updateInventory } = useInventoryUpdater();
  
  // The actual save operation
  const completeSaveOperation = (shouldCloseForm = false): SaveOperationResult => {
    // For backward compatibility, use the first item's details
    const firstItem = purchaseItems[0];
    
    if (!firstItem) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Aucun article n'a été ajouté à l'achat.",
        variant: "destructive",
      });
      return { success: false };
    }
    
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
      return { success: false };
    }
    
    // Save purchase
    onSave(newPurchase);
    
    toast({
      title: initialPurchase ? "Achat mis à jour" : "Nouvel achat créé",
      description: `L'achat a été ${initialPurchase ? 'mis à jour' : 'créé'} avec succès et le stock a été mis à jour.`
    });
    
    // CRITICAL FIX: NEVER close the form regardless of what is passed in
    // This prevents any accidental closing
    
    // Return success result with reset flag
    return {
      success: true,
      shouldReset: shouldResetForm
    };
  };

  return {
    completeSaveOperation
  };
};
