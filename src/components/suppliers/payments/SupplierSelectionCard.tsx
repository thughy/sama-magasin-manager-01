
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SupplierSelector } from "./SupplierSelector";
import { Supplier } from "@/data/suppliersData";
import { Skeleton } from "@/components/ui/skeleton";

interface SupplierSelectionCardProps {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  onSupplierSelect: (supplier: Supplier) => void;
  isLoading: boolean;
}

export const SupplierSelectionCard: React.FC<SupplierSelectionCardProps> = ({
  suppliers,
  selectedSupplier,
  onSupplierSelect,
  isLoading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sélection du fournisseur</CardTitle>
        <CardDescription>
          Sélectionnez un fournisseur pour voir ses factures impayées
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <SupplierSelector 
            suppliers={suppliers}
            selectedSupplier={selectedSupplier}
            onSupplierSelect={onSupplierSelect}
            isLoading={isLoading}
          />
        )}
      </CardContent>
    </Card>
  );
};
