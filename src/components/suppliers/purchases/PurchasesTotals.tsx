
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Purchase } from "@/types/purchase";

interface PurchasesTotalsProps {
  purchases: Purchase[];
}

export const PurchasesTotals = ({ purchases }: PurchasesTotalsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
  };

  // Calculate general totals
  const generalTotals = purchases.reduce(
    (acc, purchase) => {
      return {
        totalAmount: acc.totalAmount + purchase.totalAmount,
        totalPaid: acc.totalPaid + (purchase.totalPaid || 0),
        balance: acc.balance + (purchase.balance || (purchase.totalAmount - (purchase.totalPaid || 0)))
      };
    },
    { totalAmount: 0, totalPaid: 0, balance: 0 }
  );

  return (
    <Card className="bg-muted/30 mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Récapitulatif général des achats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total factures</p>
            <p className="text-xl font-bold">{formatCurrency(generalTotals.totalAmount)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total versé</p>
            <p className="text-xl font-bold">{formatCurrency(generalTotals.totalPaid)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Solde restant</p>
            <p className="text-xl font-bold">{formatCurrency(generalTotals.balance)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
