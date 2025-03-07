
import { useToast } from '@/hooks/use-toast';
import { PurchaseItem } from '@/types/purchase';

interface UseFormSubmissionProps {
  isValid: boolean;
  purchaseItems: PurchaseItem[];
  showPrintConfirmation: (callback: () => void) => void;
  completeSaveOperation: (shouldCloseForm?: boolean) => boolean | void;
  shouldKeepFormOpen?: boolean;
}

export const useFormSubmission = ({
  isValid,
  purchaseItems,
  showPrintConfirmation,
  completeSaveOperation,
  shouldKeepFormOpen = false
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
    
    if (hasDepotsSelected) {
      // Show confirmation dialog for printing
      showPrintConfirmation(() => {
        const success = completeSaveOperation(!shouldKeepFormOpen);
        return success;
      });
    } else {
      // No depots to print, proceed with save
      completeSaveOperation(!shouldKeepFormOpen);
    }
  };

  return {
    handleSubmit
  };
};
