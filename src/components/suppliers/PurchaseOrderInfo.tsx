
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Supplier } from "@/data/suppliersData";

interface PurchaseOrderInfoProps {
  reference: string;
  orderDate: string;
  deliveryDate: string;
  supplier: Supplier;
  onReferenceChange: (value: string) => void;
  onOrderDateChange: (value: string) => void;
  onDeliveryDateChange: (value: string) => void;
}

export const PurchaseOrderInfo = ({
  reference,
  orderDate,
  deliveryDate,
  supplier,
  onReferenceChange,
  onOrderDateChange,
  onDeliveryDateChange
}: PurchaseOrderInfoProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="reference">Référence</Label>
          <Input 
            id="reference" 
            value={reference} 
            onChange={(e) => onReferenceChange(e.target.value)} 
            placeholder="BC-2023-0001" 
          />
        </div>
        <div>
          <Label htmlFor="orderDate">Date de commande</Label>
          <Input 
            id="orderDate" 
            type="date" 
            value={orderDate} 
            onChange={(e) => onOrderDateChange(e.target.value)} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="supplierName">Fournisseur</Label>
          <Input id="supplierName" value={supplier.name} readOnly />
        </div>
        <div>
          <Label htmlFor="deliveryDate">Date de livraison souhaitée</Label>
          <Input 
            id="deliveryDate" 
            type="date" 
            value={deliveryDate} 
            onChange={(e) => onDeliveryDateChange(e.target.value)} 
          />
        </div>
      </div>
    </div>
  );
};
