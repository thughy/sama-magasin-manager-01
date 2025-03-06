
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Printer } from "lucide-react";
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
        <Printer className="h-4 w-4 mr-2" /> {isSaveMode ? "Enregistrer" : "Imprimer"}
      </Button>
    </DialogFooter>
  );
};
