
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
import { SupplierCreateDialog } from "./SupplierCreateDialog";

interface SuppliersHeaderProps {
  onAddSupplier: (supplier: Supplier) => void;
  lastSupplierId: number;
}

export const SuppliersHeader = ({ onAddSupplier, lastSupplierId }: SuppliersHeaderProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleAddSupplier = (supplier: Supplier) => {
    onAddSupplier(supplier);
    
    toast({
      title: "Fournisseur ajouté",
      description: `${supplier.name} a été ajouté à la liste des fournisseurs.`,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Gestion des Fournisseurs</h1>
        <p className="text-muted-foreground">
          Gérez vos fournisseurs et suivez leurs situations financières
        </p>
      </div>

      <Button className="space-x-2" onClick={() => setOpen(true)}>
        <PlusCircle className="h-4 w-4" />
        <span>Nouveau Fournisseur</span>
      </Button>

      <SupplierCreateDialog
        open={open}
        onOpenChange={handleOpenChange}
        onCreateSupplier={handleAddSupplier}
        lastSupplierId={lastSupplierId}
      />
    </div>
  );
};
