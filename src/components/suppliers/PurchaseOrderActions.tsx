
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Printer, Save } from "lucide-react";
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
      <Button onClick={onPrint}>
        {isSaveMode ? (
          <>
            <Save className="h-4 w-4 mr-2" /> Enregistrer
          </>
        ) : (
          <>
            <Printer className="h-4 w-4 mr-2" /> Imprimer
          </>
        )}
      </Button>
    </DialogFooter>
  );
};
