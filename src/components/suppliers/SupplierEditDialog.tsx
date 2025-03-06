
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Supplier } from "@/data/suppliersData";

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
  onSubmit
}: SupplierEditDialogProps) => {
  if (!supplier) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier les informations du fournisseur</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nom du fournisseur</Label>
              <Input
                id="edit-name"
                name="name"
                value={supplier.name}
                onChange={onInputChange}
                placeholder="Électronique Express"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-contact">Personne de contact</Label>
              <Input
                id="edit-contact"
                name="contact"
                value={supplier.contact}
                onChange={onInputChange}
                placeholder="Amadou Diop"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Téléphone</Label>
              <Input
                id="edit-phone"
                name="phone"
                value={supplier.phone}
                onChange={onInputChange}
                placeholder="+221 77 123 45 67"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={supplier.email}
                onChange={onInputChange}
                placeholder="contact@electronique-express.sn"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
