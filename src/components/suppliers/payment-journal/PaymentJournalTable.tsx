
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PaymentItem {
  id: string;
  date: string;
  amount: number;
  method: string;
  supplierName: string;
  invoiceReference: string;
  purchaseId: string;
}

interface PaymentJournalTableProps {
  payments: PaymentItem[];
  isLoading: boolean;
}

export const PaymentJournalTable: React.FC<PaymentJournalTableProps> = ({ payments, isLoading }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Espèces';
      case 'wave':
        return 'Wave';
      case 'orangeMoney':
        return 'Orange Money';
      case 'cheque':
        return 'Chèque';
      case 'bank':
        return 'Banque';
      default:
        return method;
    }
  };

  if (isLoading) {
    return (
      <div className="mt-6 space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center py-10 text-center border rounded-lg">
        <h3 className="text-lg font-medium">Aucun paiement trouvé</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Veuillez sélectionner une plage de dates et cliquer sur Rechercher
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Fournisseur</TableHead>
            <TableHead>N° Facture</TableHead>
            <TableHead>Méthode</TableHead>
            <TableHead className="text-right">Montant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{formatDate(payment.date)}</TableCell>
              <TableCell>{payment.supplierName}</TableCell>
              <TableCell>{payment.invoiceReference}</TableCell>
              <TableCell>{getPaymentMethodName(payment.method)}</TableCell>
              <TableCell className="text-right font-medium">
                {payment.amount.toLocaleString()} F CFA
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
