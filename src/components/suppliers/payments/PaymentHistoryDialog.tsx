
import React, { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Purchase } from "@/types/purchase";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";

interface PaymentHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchase: Purchase;
}

export function PaymentHistoryDialog({ open, onOpenChange, purchase }: PaymentHistoryDialogProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    documentTitle: `Historique_Paiements_${purchase.reference}`,
    bodyClass: "print-payment-history",
    contentRef: printRef,
    onPrintError: (errorLocation, error) => {
      console.error(`Print error at ${errorLocation}:`, error);
    },
  });

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
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Historique des paiements - Facture {purchase.reference}</DialogTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handlePrint()}
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div ref={printRef} className="p-4">
            <div className="print-only mb-6 border-b pb-4">
              <h1 className="text-2xl font-bold mb-2">ENTREPRISE XYZ</h1>
              <p className="text-sm">123 Rue du Commerce, Dakar, Sénégal</p>
              <p className="text-sm">Tel: +221 33 123 45 67 | Email: contact@entreprise-xyz.sn</p>
            </div>
            
            <h2 className="text-xl font-bold mb-4">Historique des Paiements</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
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
                      <TableHead className="text-right print:hidden">Quand</TableHead>
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
                        <TableCell className="text-right print:hidden">
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
            
            <div className="mt-10 print-only">
              <div className="border-t pt-4">
                <p className="text-sm text-center text-muted-foreground">
                  Document imprimé le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
