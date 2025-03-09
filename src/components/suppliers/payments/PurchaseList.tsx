
import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Building, Clock, Edit, FileText, Printer, User, MapPin, Phone, Mail, Wallet } from "lucide-react";
import { Purchase } from "@/types/purchase";
import { Badge } from "@/components/ui/badge";
import { PaymentHistoryDialog } from "./PaymentHistoryDialog";
import { useReactToPrint } from "react-to-print";
import { Supplier } from "@/data/suppliersData";

interface PurchaseListProps {
  purchases: Purchase[];
  onPaymentClick: (purchase: Purchase) => void;
  onEditClick?: (purchase: Purchase) => void;
  onViewHistory?: (purchase: Purchase) => void;
  supplier?: Supplier; // Add the supplier prop
}

export function PurchaseList({ 
  purchases = [], 
  onPaymentClick, 
  onEditClick, 
  onViewHistory,
  supplier // Get the supplier data
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

  // Fix: Create a separate onClick handler function that calls handlePrint
  const onPrintButtonClick = () => {
    handlePrint();
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
            <div className="print-only mb-8">
              <div className="text-center border-b pb-6">
                <div className="flex items-center justify-center mb-2">
                  <Building className="h-8 w-8 mr-2" />
                  <h1 className="text-3xl font-bold">ENTREPRISE XYZ</h1>
                </div>
                <p className="text-sm">123 Rue du Commerce, Dakar, Sénégal</p>
                <p className="text-sm">Tel: +221 33 123 45 67 | Email: contact@entreprise-xyz.sn</p>
                <p className="text-sm">NINEA: 123456789 | RC: SN-DKR-2020-B-12345</p>
              </div>
              
              {/* Add supplier information in the printed version */}
              {supplier && (
                <div className="my-6 border p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 mr-2" />
                    <h2 className="text-xl font-semibold">Informations du fournisseur</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="flex items-start">
                      <Building className="h-4 w-4 mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Nom:</p>
                        <p className="font-semibold">{supplier.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <User className="h-4 w-4 mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Contact:</p>
                        <p className="font-semibold">{supplier.contact}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Adresse:</p>
                        <p className="font-semibold">{supplier.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-4 w-4 mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Téléphone:</p>
                        <p className="font-semibold">{supplier.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="h-4 w-4 mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Email:</p>
                        <p className="font-semibold">{supplier.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Wallet className="h-4 w-4 mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Solde:</p>
                        <p className={`font-semibold ${supplier.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {supplier.balance.toLocaleString()} F CFA
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-4 mb-4">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  <h2 className="text-xl font-semibold">Historique des factures fournisseur</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Liste complète des factures et de leurs statuts
                </p>
              </div>
            </div>
            
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
                      <Badge variant={purchase.status === 'payée' ? 'success' : 'destructive'} className="print:bg-transparent print:border print:border-current">
                        {purchase.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right print:hidden">
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

            {/* Payment methods summary for print only */}
            <div className="mt-8 print-only">
              <h3 className="text-lg font-semibold mb-2">Récapitulatif financier</h3>
              <div className="border p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Total des factures:</p>
                    <p className="text-lg font-bold">
                      {purchases.reduce((sum, p) => sum + p.totalAmount, 0).toLocaleString()} F CFA
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Montant payé:</p>
                    <p className="text-lg font-bold">
                      {purchases.reduce((sum, p) => sum + p.totalPaid, 0).toLocaleString()} F CFA
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Solde restant:</p>
                    <p className="text-lg font-bold">
                      {purchases.reduce((sum, p) => sum + p.balance, 0).toLocaleString()} F CFA
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Nombre de factures:</p>
                    <p className="text-lg font-bold">{purchases.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 print-only">
              <div className="border-t pt-4">
                <p className="text-sm text-center text-muted-foreground">
                  Document imprimé le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
                </p>
                <p className="text-sm text-center text-muted-foreground">
                  Ce document est un historique des factures et ne constitue pas une facture en soi.
                </p>
              </div>
            </div>
          </div>
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
