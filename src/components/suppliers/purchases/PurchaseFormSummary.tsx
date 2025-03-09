
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Purchase } from "@/types/purchase";

interface PurchaseFormSummaryProps {
  formData: Pick<Purchase, 'totalAmount' | 'totalPaid' | 'balance'>;
}

export const PurchaseFormSummary = ({ formData }: PurchaseFormSummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
  };

  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total facture</p>
            <p className="text-lg font-bold">{formatCurrency(formData.totalAmount)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total versé</p>
            <p className="text-lg font-bold">{formatCurrency(formData.totalPaid)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Solde restant</p>
            <p className="text-lg font-bold">{formatCurrency(formData.balance)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
