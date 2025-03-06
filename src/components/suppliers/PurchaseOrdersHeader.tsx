
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PurchaseOrdersHeaderProps {
  onCreateNewOrder: () => void;
}

export const PurchaseOrdersHeader = ({ onCreateNewOrder }: PurchaseOrdersHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bons de Commande</h1>
        <p className="text-muted-foreground">
          Créez et gérez vos bons de commande pour les fournisseurs
        </p>
      </div>
      <Button onClick={onCreateNewOrder}>
        <Plus className="mr-2 h-4 w-4" /> Nouveau Bon de Commande
      </Button>
    </div>
  );
};
