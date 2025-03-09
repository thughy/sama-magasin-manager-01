
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Purchase } from "@/types/purchase";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface PaymentHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchase: Purchase;
}

export function PaymentHistoryDialog({ open, onOpenChange, purchase }: PaymentHistoryDialogProps) {
  const formatDate = (date: string | Date) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj);
    } catch (error) {
      return String(date);
    }
  };

  const formatRelativeDate = (date: string | Date) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return formatDistanceToNow(dateObj, { addSuffix: true, locale: fr });
    } catch (error) {
      return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Historique des paiements - Facture {purchase.reference}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fournisseur</p>
              <p className="font-medium">{purchase.supplierName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date de facturation</p>
              <p className="font-medium">{formatDate(purchase.purchaseDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Montant total</p>
              <p className="font-medium">{purchase.totalAmount.toLocaleString()} F CFA</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Solde restant</p>
              <p className={`font-medium ${purchase.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {purchase.balance.toLocaleString()} F CFA
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Détails des paiements</h3>
            {purchase.paymentMethods && purchase.paymentMethods.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead className="text-right">Quand</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchase.paymentMethods.map((payment, index) => (
                    <TableRow key={payment.id || index}>
                      <TableCell>{payment.date ? formatDate(payment.date) : 'N/A'}</TableCell>
                      <TableCell>
                        {payment.method === 'cash' && 'Espèces'}
                        {payment.method === 'wave' && 'Wave'}
                        {payment.method === 'orangeMoney' && 'Orange Money'}
                        {payment.method === 'cheque' && 'Chèque'}
                        {payment.method === 'bank' && 'Banque'}
                      </TableCell>
                      <TableCell>{payment.amount.toLocaleString()} F CFA</TableCell>
                      <TableCell className="text-right">
                        {payment.date ? formatRelativeDate(payment.date) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                Aucun historique de paiement pour cette facture
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
