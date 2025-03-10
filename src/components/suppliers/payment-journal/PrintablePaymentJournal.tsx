
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PrintableCompanyHeader } from "../payments/PrintableCompanyHeader";
import { PrintableFooter } from "../payments/PrintableFooter";

interface PaymentItem {
  id: string;
  date: string;
  amount: number;
  method: string;
  supplierName: string;
  invoiceReference: string;
  purchaseId: string;
}

interface PrintablePaymentJournalProps {
  payments: PaymentItem[];
  totalAmount: number;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export const PrintablePaymentJournal: React.FC<PrintablePaymentJournalProps> = ({ 
  payments, 
  totalAmount,
  dateRange
}) => {
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

  return (
    <div className="p-8 max-w-[210mm] mx-auto bg-white">
      <PrintableCompanyHeader />
      
      <h1 className="text-2xl font-bold text-center mb-6">JOURNAL DES PAIEMENTS</h1>
      
      {dateRange.from && dateRange.to && (
        <div className="mb-4 text-center">
          <p className="font-medium">
            Période: du {format(dateRange.from, 'dd/MM/yyyy')} au {format(dateRange.to, 'dd/MM/yyyy')}
          </p>
        </div>
      )}

      <div className="mt-6 border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Fournisseur</TableHead>
              <TableHead>N° Facture</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead className="text-right">Montant (FCFA)</TableHead>
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
                  {payment.amount.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50">
              <TableCell colSpan={4} className="font-bold text-right">TOTAL</TableCell>
              <TableCell className="text-right font-bold">{totalAmount.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <PrintableFooter />
    </div>
  );
};
