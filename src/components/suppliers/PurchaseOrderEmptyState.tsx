
import React from "react";
import { FileText } from "lucide-react";

interface PurchaseOrderEmptyStateProps {
  hasFilters: boolean;
}

export const PurchaseOrderEmptyState = ({ hasFilters }: PurchaseOrderEmptyStateProps) => {
  return (
    <div className="text-center py-8">
      <FileText className="mx-auto h-12 w-12 text-gray-300" />
      <h3 className="mt-4 text-lg font-medium">Aucun bon de commande</h3>
      <p className="mt-1 text-gray-500">
        {hasFilters
          ? "Aucun résultat ne correspond à votre recherche"
          : "Commencez par créer un nouveau bon de commande pour un fournisseur"}
      </p>
    </div>
  );
};
