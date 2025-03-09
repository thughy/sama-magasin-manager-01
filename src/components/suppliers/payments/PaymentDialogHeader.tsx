
import React from "react";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Purchase } from "@/types/purchase";

interface PaymentDialogHeaderProps {
  purchase: Purchase;
  showFilters: boolean;
  toggleFilters: () => void;
}

export const PaymentDialogHeader: React.FC<PaymentDialogHeaderProps> = ({
  purchase,
  showFilters,
  toggleFilters
}) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <DialogTitle>Paiement de facture</DialogTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleFilters}
          className="flex items-center gap-1"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Masquer filtres" : "Afficher filtres"}
        </Button>
      </div>
      <DialogDescription>
        Enregistrer un paiement pour la facture {purchase.reference}
      </DialogDescription>
    </div>
  );
};
