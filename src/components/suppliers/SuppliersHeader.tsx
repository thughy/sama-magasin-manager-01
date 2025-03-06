
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Supplier } from "@/data/suppliersData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SuppliersHeaderProps {
  onAddSupplier: (supplier: Supplier) => void;
  lastSupplierId: number;
}

export const SuppliersHeader = ({ onAddSupplier, lastSupplierId }: SuppliersHeaderProps) => {
  const [open, setOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
    totalInvoice: 0,
    totalPaid: 0,
    status: "impayée" as 'payée' | 'impayée'
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSupplier((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      totalInvoice: 0,
      totalPaid: 0,
      status: "impayée"
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate balance
    const balance = newSupplier.totalInvoice - newSupplier.totalPaid;
    
    // Create new supplier with a unique ID
    const supplierToAdd: Supplier = {
      id: lastSupplierId + 1,
      ...newSupplier,
      balance: balance
    };
    
    // Add the supplier to the parent component's state
    onAddSupplier(supplierToAdd);
    
    toast({
      title: "Fournisseur ajouté",
      description: `${newSupplier.name} a été ajouté à la liste des fournisseurs.`,
    });
    
    setOpen(false);
    resetForm();
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Gestion des Fournisseurs</h1>
        <p className="text-muted-foreground">
          Gérez vos fournisseurs et suivez leurs situations financières
        </p>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="space-x-2">
            <PlusCircle className="h-4 w-4" />
            <span>Nouveau Fournisseur</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un fournisseur</DialogTitle>
            <DialogDescription>
              Remplissez le formulaire ci-dessous pour ajouter un nouveau fournisseur
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={newSupplier.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">
                  Contact
                </Label>
                <Input
                  id="contact"
                  name="contact"
                  value={newSupplier.contact}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newSupplier.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newSupplier.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
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
                  value={newSupplier.totalInvoice || ""}
                  onChange={(e) => handleNumericInputChange(e, "totalInvoice")}
                  className="col-span-3"
                  required
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
                  value={newSupplier.totalPaid || ""}
                  onChange={(e) => handleNumericInputChange(e, "totalPaid")}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Statut
                </Label>
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
              <Button type="submit">Ajouter le fournisseur</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
