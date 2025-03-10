
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Save, X } from "lucide-react";
import { PurchaseOrder } from "@/types/purchaseOrder";

interface PurchaseOrderActionsProps {
  onPrint: () => void;
  onClose: () => void;
  isSaveMode: boolean;
}

export const PurchaseOrderActions = ({ 
  onPrint, 
  onClose, 
  isSaveMode 
}: PurchaseOrderActionsProps) => {
  return (
    <DialogFooter>
      <Button variant="outline" onClick={onClose}>
        Annuler
      </Button>
      <Button onClick={isSaveMode ? onPrint : onClose}>
        {isSaveMode ? (
          <>
            <Save className="h-4 w-4 mr-2" /> Enregistrer
          </>
        ) : (
          <>
            <X className="h-4 w-4 mr-2" /> Fermer
          </>
        )}
      </Button>
    </DialogFooter>
  );
};
