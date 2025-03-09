
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Purchase } from "@/types/purchase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Edit, Wallet } from "lucide-react";

interface PurchasesTableDisplayProps {
  purchases: Purchase[];
  onPaymentClick: (purchase: Purchase) => void;
  onEditClick?: (purchase: Purchase) => void;
  onHistoryClick: (purchase: Purchase) => void;
  formatDate: (dateString: string) => string;
}

export const PurchasesTableDisplay: React.FC<PurchasesTableDisplayProps> = ({
  purchases,
  onPaymentClick,
  onEditClick,
  onHistoryClick,
  formatDate,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Référence</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Payé</TableHead>
          <TableHead>Solde</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right print:hidden">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {purchases.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              Aucune facture ne correspond aux critères de recherche.
            </TableCell>
          </TableRow>
        ) : (
          purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell className="font-medium">{purchase.reference}</TableCell>
              <TableCell>{formatDate(purchase.purchaseDate)}</TableCell>
              <TableCell>{purchase.totalAmount.toLocaleString()} F CFA</TableCell>
              <TableCell>{purchase.totalPaid.toLocaleString()} F CFA</TableCell>
              <TableCell className={purchase.status === 'impayée' ? 'font-medium text-red-500' : 'font-medium text-green-500'}>
                {purchase.balance.toLocaleString()} F CFA
              </TableCell>
              <TableCell>
                <Badge variant={purchase.status === 'payée' ? 'success' : 'destructive'} className="print:bg-transparent print:border print:border-current">
                  {purchase.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right print:hidden">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onHistoryClick(purchase)}
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
          ))
        )}
      </TableBody>
    </Table>
  );
};
