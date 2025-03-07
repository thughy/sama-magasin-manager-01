
import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Supplier } from "@/data/suppliersData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SupplierEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SupplierEditDialog = ({
  isOpen,
  onOpenChange,
  supplier,
  onInputChange,
  onSubmit,
}: SupplierEditDialogProps) => {
  if (!supplier) return null;

  const handleStatusChange = (value: string) => {
    // Create a synthetic change event that matches the expected structure
    // Properly cast to unknown first to avoid TypeScript error
    const event = {
      target: {
        name: "status",
        value: value
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    onInputChange(event);
  };

  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    
    // Create a synthetic change event that matches the expected structure
    // Properly cast to unknown first to avoid TypeScript error
    const event = {
      target: {
        name: fieldName,
        value: numericValue ? parseInt(numericValue) : 0
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    onInputChange(event);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le fournisseur</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                name="name"
                value={supplier.name}
                onChange={onInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Adresse
              </Label>
              <Input
                id="address"
                name="address"
                value={supplier.address}
                onChange={onInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Téléphone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={supplier.phone}
                onChange={onInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={supplier.email}
                onChange={onInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalInvoice" className="text-right">
                Total Facture
              </Label>
              <Input
                id="totalInvoice"
                name="totalInvoice"
                type="text"
                value={supplier.totalInvoice}
                onChange={(e) => handleNumericInputChange(e, "totalInvoice")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalPaid" className="text-right">
                Total Versé
              </Label>
              <Input
                id="totalPaid"
                name="totalPaid"
                type="text"
                value={supplier.totalPaid}
                onChange={(e) => handleNumericInputChange(e, "totalPaid")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <div className="col-span-3">
                <Select 
                  value={supplier.status} 
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payée">Payée</SelectItem>
                    <SelectItem value="impayée">Impayée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Enregistrer les modifications</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
