
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { Purchase } from "@/types/purchase";

interface PurchaseListProps {
  purchases: Purchase[];
  onPaymentClick: (purchase: Purchase) => void;
}

export function PurchaseList({ purchases = [], onPaymentClick }: PurchaseListProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR').format(date);
    } catch (error) {
      return dateString;
    }
  };

  if (!purchases || purchases.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Factures impayées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            Aucune facture impayée pour ce fournisseur
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Factures impayées</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payé</TableHead>
              <TableHead>Solde</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell className="font-medium">{purchase.reference}</TableCell>
                <TableCell>{formatDate(purchase.purchaseDate)}</TableCell>
                <TableCell>{purchase.totalAmount.toLocaleString()} F CFA</TableCell>
                <TableCell>{purchase.totalPaid.toLocaleString()} F CFA</TableCell>
                <TableCell className="font-medium text-red-500">
                  {purchase.balance.toLocaleString()} F CFA
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-auto"
                    onClick={() => onPaymentClick(purchase)}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Payer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
