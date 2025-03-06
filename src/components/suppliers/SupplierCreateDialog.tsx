
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    contact: "",
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

  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    
    setNewSupplier((prev) => ({
      ...prev,
      [fieldName]: numericValue ? parseInt(numericValue) : 0,
    }));
  };

  const handleStatusChange = (value: 'payée' | 'impayée') => {
    setNewSupplier((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const resetForm = () => {
    setNewSupplier({
      name: "",
      contact: "",
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
    
    // Calculate balance
    const balance = (newSupplier.totalInvoice || 0) - (newSupplier.totalPaid || 0);
    
    // Create a new supplier
    const createdSupplier: Supplier = {
      id: lastSupplierId + 1,
      name: newSupplier.name || "",
      contact: newSupplier.contact || "",
      phone: newSupplier.phone || "",
      email: newSupplier.email || "",
      balance: balance,
      totalInvoice: newSupplier.totalInvoice || 0,
      totalPaid: newSupplier.totalPaid || 0,
      status: newSupplier.status || "impayée"
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
            <Label htmlFor="contact" className="text-right">Contact</Label>
            <Input
              id="contact"
              name="contact"
              value={newSupplier.contact}
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="totalInvoice" className="text-right">Total Facture</Label>
            <Input
              id="totalInvoice"
              name="totalInvoice"
              type="text"
              value={newSupplier.totalInvoice || ""}
              onChange={(e) => handleNumericInputChange(e, "totalInvoice")}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="totalPaid" className="text-right">Total Versé</Label>
            <Input
              id="totalPaid"
              name="totalPaid"
              type="text"
              value={newSupplier.totalPaid || ""}
              onChange={(e) => handleNumericInputChange(e, "totalPaid")}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Statut</Label>
            <div className="col-span-3">
              <Select 
                value={newSupplier.status} 
                onValueChange={(value) => handleStatusChange(value as 'payée' | 'impayée')}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>Ajouter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
