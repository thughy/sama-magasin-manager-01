
import { useState } from 'react';
import { PurchaseItem } from '@/types/purchase';
import { useDepotEntryPrinting } from './useDepotEntryPrinting';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface UsePrintConfirmationProps {
  formData: {
    reference: string;
    purchaseDate: string;
    supplierName: string;
  };
  purchaseItems: PurchaseItem[];
}

export const usePrintConfirmation = ({ formData, purchaseItems }: UsePrintConfirmationProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [onSaveCallback, setOnSaveCallback] = useState<(() => void) | null>(null);
  const { printDepotEntry } = useDepotEntryPrinting(formData, purchaseItems);

  // Get unique depots from purchase items
  const uniqueDepots = [...new Set(purchaseItems.map(item => item.depot))].filter(Boolean);

  const showPrintConfirmation = (callback: () => void) => {
    setOnSaveCallback(() => callback);
    setIsConfirmOpen(true);
  };

  const handleConfirmYes = () => {
    // Print all depot entries
    uniqueDepots.forEach(depot => {
      if (depot) printDepotEntry(depot);
    });
    
    // Close dialog
    setIsConfirmOpen(false);
    
    // Call the callback to continue with save operation
    if (onSaveCallback) onSaveCallback();
  };

  const handleConfirmNo = () => {
    setIsConfirmOpen(false);
    
    // Call the callback without printing
    if (onSaveCallback) onSaveCallback();
  };

  const PrintConfirmationDialog = () => {
    if (uniqueDepots.length === 0) return null;
    
    return (
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Imprimer les bons d'entrée</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous imprimer les bons d'entrée pour les dépôts suivants :
              <ul className="mt-2 list-disc pl-5">
                {uniqueDepots.map(depot => (
                  <li key={depot}>{depot}</li>
                ))}
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleConfirmNo}>Non</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmYes}>Oui, imprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return {
    showPrintConfirmation,
    PrintConfirmationDialog
  };
};
