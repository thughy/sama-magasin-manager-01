
import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, AlertCircle } from "lucide-react";
import { Purchase } from "@/types/purchase";
import { PaymentHistoryDialog } from "./PaymentHistoryDialog";
import { useReactToPrint } from "react-to-print";
import { Supplier } from "@/data/suppliersData";
import { PrintableCompanyHeader } from "./PrintableCompanyHeader";
import { PrintableSupplierInfo } from "./PrintableSupplierInfo";
import { InvoiceHistoryTitle } from "./InvoiceHistoryTitle";
import { PurchasesTable } from "./PurchasesTable";
import { FinancialSummary } from "./FinancialSummary";
import { PrintableFooter } from "./PrintableFooter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PurchaseListProps {
  purchases: Purchase[];
  onPaymentClick: (purchase: Purchase) => void;
  onEditClick?: (purchase: Purchase) => void;
  onHistoryClick: (purchase: Purchase) => void;
  supplier?: Supplier;
}

export function PurchaseList({ 
  purchases = [], 
  onPaymentClick, 
  onEditClick, 
  onHistoryClick,
  supplier
}: PurchaseListProps) {
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    documentTitle: `Factures_Fournisseur_${supplier?.name || ''}`,
    bodyClass: "print-supplier-invoices",
    contentRef: printRef,
    onPrintError: (errorLocation, error) => {
      console.error(`Print error at ${errorLocation}:`, error);
    },
  });

  const handleHistoryClick = (purchase: Purchase) => {
    if (onHistoryClick) {
      onHistoryClick(purchase);
    } else {
      setSelectedPurchase(purchase);
      setIsHistoryDialogOpen(true);
    }
  };

  // Fix: Create a separate onClick handler function that calls handlePrint
  const onPrintButtonClick = () => {
    handlePrint();
  };

  // This is the case when a supplier has no purchases
  if (!purchases || purchases.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Factures du fournisseur</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Aucune facture trouvée</AlertTitle>
            <AlertDescription>
              Ce fournisseur n'a pas encore de factures enregistrées dans le système.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Factures du fournisseur</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onPrintButtonClick} 
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimer les factures
          </Button>
        </CardHeader>
        <CardContent>
          <div ref={printRef}>
            <PrintableCompanyHeader />
            
            {supplier && <PrintableSupplierInfo supplier={supplier} />}
            
            <InvoiceHistoryTitle />
            
            <PurchasesTable 
              purchases={purchases}
              onPaymentClick={onPaymentClick}
              onEditClick={onEditClick}
              onHistoryClick={handleHistoryClick}
            />

            <FinancialSummary purchases={purchases} />

            <PrintableFooter />
          </div>
        </CardContent>
      </Card>
      
      {selectedPurchase && !onHistoryClick && (
        <PaymentHistoryDialog
          open={isHistoryDialogOpen}
          onOpenChange={setIsHistoryDialogOpen}
          purchase={selectedPurchase}
        />
      )}
    </>
  );
}
