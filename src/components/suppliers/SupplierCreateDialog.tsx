
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Supplier } from "@/data/suppliersData";

interface SupplierCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSupplier: (supplier: Supplier) => void;
  lastSupplierId?: number;
}

export const SupplierCreateDialog = ({ 
  open, 
  onOpenChange, 
  onCreateSupplier,
  lastSupplierId = 0
}: SupplierCreateDialogProps) => {
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: "",
    address: "",
    phone: "",
    email: "",
    balance: 0,
    totalInvoice: 0,
    totalPaid: 0,
    status: "impayée" as const
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSupplier(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setNewSupplier({
      name: "",
      address: "",
      phone: "",
      email: "",
      balance: 0,
      totalInvoice: 0,
      totalPaid: 0,
      status: "impayée"
    });
  };

  const handleSubmit = () => {
    if (!newSupplier.name) return;
    
    // Create a new supplier with minimal fields and default values for the rest
    const createdSupplier: Supplier = {
      id: lastSupplierId + 1,
      name: newSupplier.name || "",
      contact: "", // We'll set this to empty since it's not needed
      address: newSupplier.address || "",
      phone: newSupplier.phone || "",
      email: newSupplier.email || "",
      balance: 0,
      totalInvoice: 0,
      totalPaid: 0,
      status: "impayée"
    };
    
    // Call the onCreateSupplier callback
    onCreateSupplier(createdSupplier);
    
    // Reset form and close dialog
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        resetForm();
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau fournisseur</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nom</Label>
            <Input
              id="name"
              name="name"
              value={newSupplier.name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">Adresse</Label>
            <Input
              id="address"
              name="address"
              value={newSupplier.address}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Téléphone</Label>
            <Input
              id="phone"
              name="phone"
              value={newSupplier.phone}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input
              id="email"
              name="email"
              value={newSupplier.email}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>Ajouter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
