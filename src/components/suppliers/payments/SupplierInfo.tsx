
import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Supplier } from "@/data/suppliersData";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";

interface SupplierInfoProps {
  supplier: Supplier;
}

export function SupplierInfo({ supplier }: SupplierInfoProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Compte Fournisseur - ${supplier?.name || "Fournisseur"}`,
  });

  if (!supplier) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Information du fournisseur</CardTitle>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimer
        </Button>
      </CardHeader>
      <CardContent>
        <div ref={printRef} className="p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nom</p>
              <p className="text-lg font-medium">{supplier.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contact</p>
              <p className="text-lg font-medium">{supplier.contact}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Adresse</p>
              <p className="text-lg font-medium">{supplier.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
              <p className="text-lg font-medium">{supplier.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg font-medium">{supplier.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Solde</p>
              <p className={`text-lg font-medium ${supplier.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {supplier.balance.toLocaleString()} F CFA
              </p>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Récapitulatif du compte</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Total Factures</p>
                <p className="text-lg font-medium">{supplier.totalInvoice.toLocaleString()} F CFA</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Total Versé</p>
                <p className="text-lg font-medium">{supplier.totalPaid.toLocaleString()} F CFA</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Solde Restant</p>
                <p className={`text-lg font-medium ${supplier.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {supplier.balance.toLocaleString()} F CFA
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
