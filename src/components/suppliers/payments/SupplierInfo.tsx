
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Supplier } from "@/data/suppliersData";

interface SupplierInfoProps {
  supplier: Supplier;
}

export function SupplierInfo({ supplier }: SupplierInfoProps) {
  if (!supplier) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Information du fournisseur</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
