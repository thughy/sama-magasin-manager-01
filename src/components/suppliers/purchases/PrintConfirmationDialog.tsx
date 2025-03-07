
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PrintConfirmationDialogProps {
  isOpen: boolean;
  depots: string[];
  handleConfirm: () => void;
  onClose: () => void;
}

export const PrintConfirmationDialog = ({ 
  isOpen, 
  depots, 
  handleConfirm, 
  onClose 
}: PrintConfirmationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Imprimer les bons d'entrée</DialogTitle>
          <DialogDescription>
            L'achat a été enregistré avec succès. Souhaitez-vous imprimer les bons d'entrée en stock pour les dépôts suivants?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <ul className="list-disc pl-6 space-y-1">
            {depots.map((depot, index) => (
              <li key={index}>{depot}</li>
            ))}
          </ul>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Non, fermer
          </Button>
          <Button onClick={handleConfirm}>
            Oui, imprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
