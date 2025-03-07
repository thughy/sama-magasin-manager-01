
import { useState } from 'react';
import { PurchaseItem } from '@/types/purchase';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UsePrintConfirmationProps {
  formData: any;
  purchaseItems: PurchaseItem[];
}

export const usePrintConfirmation = ({ formData, purchaseItems }: UsePrintConfirmationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => boolean | void) | null>(null);

  // Function to show the confirmation dialog
  const showPrintConfirmation = (callback: () => boolean | void) => {
    setOnConfirmCallback(() => callback);
    setIsOpen(true);
  };

  // Function to handle confirmation
  const handleConfirm = () => {
    if (onConfirmCallback) {
      onConfirmCallback();
    }
    setIsOpen(false);
  };

  // Print Confirmation Dialog component
  const PrintConfirmationDialog = () => {
    // Get all unique depots that have items
    const depots = [...new Set(purchaseItems.filter(item => !!item.depot).map(item => item.depot))];
    
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Imprimer les bons d'entrée en dépôt</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p>Voulez-vous imprimer les bons d'entrée pour les dépôts suivants ?</p>
            <ul className="list-disc pl-6 mt-2">
              {depots.map((depot, index) => (
                <li key={index}>{depot}</li>
              ))}
            </ul>
            <p className="mt-4">
              L'achat sera enregistré et les stocks mis à jour dans les dépôts respectifs.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleConfirm}>
              Imprimer et enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return {
    showPrintConfirmation,
    PrintConfirmationDialog
  };
};
