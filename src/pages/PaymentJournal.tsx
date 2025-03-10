
import React, { useState, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentJournalHeader } from "@/components/suppliers/payment-journal/PaymentJournalHeader";
import { PaymentJournalFilters } from "@/components/suppliers/payment-journal/PaymentJournalFilters";
import { PaymentJournalTable } from "@/components/suppliers/payment-journal/PaymentJournalTable";
import { PrintablePaymentJournal } from "@/components/suppliers/payment-journal/PrintablePaymentJournal";
import { usePaymentJournal } from "@/hooks/usePaymentJournal";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";

const PaymentJournal = () => {
  const {
    payments,
    dateRange,
    setDateRange,
    isLoading,
    fetchPayments,
    totalAmount
  } = usePaymentJournal();
  
  const printRef = useRef<HTMLDivElement>(null);
  
  // Fixed the useReactToPrint hook syntax by using the correct property names
  const handlePrint = useReactToPrint({
    documentTitle: "Journal_des_paiements",
    onBeforeGetContent: () => {
      return new Promise<void>((resolve) => {
        resolve();
      });
    },
    // Using contentRef instead of content function
    contentRef: printRef,
    pageStyle: `
      @page {
        size: A4;
        margin: 1.5cm;
      }
    `
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <PaymentJournalHeader 
          onPrint={handlePrint} 
          canPrint={payments.length > 0} 
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Journal des paiements</CardTitle>
            <CardDescription>
              Consultez l'historique de tous les paiements effectués aux fournisseurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentJournalFilters 
              dateRange={dateRange}
              setDateRange={setDateRange}
              onSearch={fetchPayments}
              isLoading={isLoading}
            />

            {payments.length > 0 && (
              <div className="mb-4 mt-6">
                <p className="text-sm text-muted-foreground">
                  {payments.length} paiement(s) trouvé(s) 
                  {dateRange.from && dateRange.to && (
                    <> entre le {format(dateRange.from, 'dd/MM/yyyy')} et le {format(dateRange.to, 'dd/MM/yyyy')}</>
                  )}
                </p>
                <p className="text-sm font-medium mt-1">
                  Montant total: {totalAmount.toLocaleString()} F CFA
                </p>
              </div>
            )}

            <PaymentJournalTable payments={payments} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
      
      {/* Section imprimable (cachée à l'écran) */}
      <div className="hidden">
        <div ref={printRef}>
          <PrintablePaymentJournal 
            payments={payments} 
            totalAmount={totalAmount} 
            dateRange={dateRange}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentJournal;
