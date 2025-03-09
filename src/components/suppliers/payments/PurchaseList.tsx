
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Clock, Edit, Wallet } from "lucide-react";
import { Purchase } from "@/types/purchase";
import { Badge } from "@/components/ui/badge";
import { PaymentHistoryDialog } from "./PaymentHistoryDialog";

interface PurchaseListProps {
  purchases: Purchase[];
  onPaymentClick: (purchase: Purchase) => void;
  onEditClick?: (purchase: Purchase) => void;
  onViewHistory?: (purchase: Purchase) => void;
}

export function PurchaseList({ purchases = [], onPaymentClick, onEditClick, onViewHistory }: PurchaseListProps) {
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR').format(date);
    } catch (error) {
      return dateString;
    }
  };

  const handleHistoryClick = (purchase: Purchase) => {
    if (onViewHistory) {
      onViewHistory(purchase);
    } else {
      setSelectedPurchase(purchase);
      setIsHistoryDialogOpen(true);
    }
  };

  if (!purchases || purchases.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Factures du fournisseur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            Aucune facture pour ce fournisseur
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Factures du fournisseur</CardTitle>
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
                <TableHead>Statut</TableHead>
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
                  <TableCell className={purchase.status === 'impayée' ? 'font-medium text-red-500' : 'font-medium text-green-500'}>
                    {purchase.balance.toLocaleString()} F CFA
                  </TableCell>
                  <TableCell>
                    <Badge variant={purchase.status === 'payée' ? 'success' : 'destructive'}>
                      {purchase.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleHistoryClick(purchase)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Historique
                      </Button>
                      
                      {onEditClick && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onEditClick(purchase)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onPaymentClick(purchase)}
                        disabled={purchase.status === 'payée'}
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        Payer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedPurchase && !onViewHistory && (
        <PaymentHistoryDialog
          open={isHistoryDialogOpen}
          onOpenChange={setIsHistoryDialogOpen}
          purchase={selectedPurchase}
        />
      )}
    </>
  );
}
