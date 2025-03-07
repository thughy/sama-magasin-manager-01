
import { useToast } from '@/hooks/use-toast';
import { PurchaseItem } from '@/types/purchase';
import { useFormReset } from './useFormReset';

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
    console.log("Form submitted, checking validity...");
    
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
    
    console.log("Form is valid, saving purchase with shouldCloseForm=false");
    // CRITICAL: We must ALWAYS pass false to ensure the form never closes
    const result = completeSaveOperation(false);
    
    if (result.success) {
      console.log("Save successful, resetting form...");
      // Reset the form for a new purchase entry
      if (resetForm) {
        console.log("Using resetForm function");
        resetForm();
      } else {
        console.log("No resetForm function provided, doing manual reset");
        // If resetForm is not provided, manually reset the key parts
        if (setSelectedSupplier) {
          setSelectedSupplier(null);
        }
      }
      
      // Focus on supplier input if provided - ensure this happens with a slight delay
      if (supplierFocusRef?.current) {
        console.log("Setting focus to supplier input with delay");
        setTimeout(() => {
          if (supplierFocusRef.current) {
            supplierFocusRef.current.focus();
            console.log("Focus set on supplier input");
          }
        }, 100);
      }
    }
  };

  return {
    handleSubmit
  };
};
