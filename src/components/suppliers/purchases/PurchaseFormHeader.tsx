
import React from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { SupplierSearchBox } from "../SupplierSearchBox";
import { Supplier } from "@/data/suppliersData";

interface PurchaseFormHeaderProps {
  reference: string;
  purchaseDate: string;
  selectedSupplier: Supplier | null;
  onReferenceChange: (value: string) => void;
  onPurchaseDateChange: (value: string) => void;
  onSupplierChange: (supplier: Supplier) => void;
  supplierFocusRef?: React.RefObject<HTMLInputElement>;
}

export const PurchaseFormHeader = ({
  reference,
  purchaseDate,
  selectedSupplier,
  onReferenceChange,
  onPurchaseDateChange,
  onSupplierChange,
  supplierFocusRef
}: PurchaseFormHeaderProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Nouvel achat</DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="reference">Référence</Label>
          <Input
            id="reference"
            value={reference}
            onChange={(e) => onReferenceChange(e.target.value)}
            placeholder="F-2024-001"
            autoComplete="off"
          />
        </div>
        
        <div>
          <Label htmlFor="purchaseDate">Date de la facture</Label>
          <div className="relative">
            <Input
              id="purchaseDate"
              type="date"
              value={purchaseDate}
              onChange={(e) => onPurchaseDateChange(e.target.value)}
              autoComplete="off"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <SupplierSearchBox 
          selectedSupplier={selectedSupplier} 
          onSelectSupplier={onSupplierChange}
          inputRef={supplierFocusRef}
        />
      </div>
    </>
  );
};
