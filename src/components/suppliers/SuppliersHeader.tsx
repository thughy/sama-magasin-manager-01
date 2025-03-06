
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Supplier } from "@/data/suppliersData";

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
  });
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Focus sur le champ nom quand le modal s'ouvre
  useEffect(() => {
    if (open && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setNewSupplier({
      name: "",
      contact: "",
      phone: "",
      email: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new supplier with a unique ID and default balance of 0
    const supplierToAdd: Supplier = {
      id: lastSupplierId + 1,
      ...newSupplier,
      balance: 0
    };
    
    // Add the supplier to the parent component's state
    onAddSupplier(supplierToAdd);
    
    toast({
      title: "Fournisseur ajouté",
      description: `${newSupplier.name} a été ajouté avec succès.`,
    });
    
    // Réinitialiser le formulaire mais garder le modal ouvert pour permettre d'ajouter plusieurs fournisseurs
    resetForm();
    
    // Focus sur le champ nom après réinitialisation
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fournisseurs</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos fournisseurs et suivez leurs comptes
          </p>
        </div>
        <Button 
          className="bg-sama-500 hover:bg-sama-600"
          onClick={() => setOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Nouveau fournisseur
        </Button>
      </div>

      <Dialog open={open} onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau fournisseur</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom du fournisseur</Label>
                <Input
                  id="name"
                  name="name"
                  value={newSupplier.name}
                  onChange={handleInputChange}
                  placeholder="Électronique Express"
                  required
                  ref={nameInputRef}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact">Personne de contact</Label>
                <Input
                  id="contact"
                  name="contact"
                  value={newSupplier.contact}
                  onChange={handleInputChange}
                  placeholder="Amadou Diop"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newSupplier.phone}
                  onChange={handleInputChange}
                  placeholder="+221 77 123 45 67"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newSupplier.email}
                  onChange={handleInputChange}
                  placeholder="contact@electronique-express.sn"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
