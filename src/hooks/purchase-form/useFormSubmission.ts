
import { useToast } from '@/hooks/use-toast';
import { PurchaseItem } from '@/types/purchase';

interface UseFormSubmissionProps {
  isValid: boolean;
  purchaseItems: PurchaseItem[];
  showPrintConfirmation: (callback: () => any) => void;
  completeSaveOperation: (shouldCloseForm?: boolean) => { success: boolean; shouldReset?: boolean };
  shouldKeepFormOpen?: boolean;
  resetForm?: () => void;
  supplierFocusRef?: React.RefObject<HTMLInputElement>;
  setSelectedSupplier?: (supplier: null) => void;
}

export const useFormSubmission = ({
  isValid,
  purchaseItems,
  showPrintConfirmation,
  completeSaveOperation,
  shouldKeepFormOpen = true,
  resetForm,
  supplierFocusRef,
  setSelectedSupplier
}: UseFormSubmissionProps) => {
  const { toast } = useToast();

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
    const allItemsHaveDepots = purchaseItems.every(item => !!item.depot);
    
    if (!allItemsHaveDepots) {
      toast({
        title: "Dépôts manquants",
        description: "Tous les articles doivent avoir un dépôt sélectionné.",
        variant: "destructive",
      });
      return;
    }
    
    // Always pass false to ensure the form never closes
    const result = completeSaveOperation(false);
    
    if (result.success) {
      // Reset the supplier if save was successful
      if (setSelectedSupplier) {
        setSelectedSupplier(null);
      }
      
      // Focus on supplier input if provided
      if (supplierFocusRef?.current) {
        setTimeout(() => {
          if (supplierFocusRef.current) {
            supplierFocusRef.current.focus();
          }
        }, 100);
      }
    }
  };

  return {
    handleSubmit
  };
};
