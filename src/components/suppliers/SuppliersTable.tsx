
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileEdit, Trash2, Eye, RefreshCw, Search } from "lucide-react";
import { Supplier } from "@/data/suppliersData";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface SuppliersTableProps {
  suppliers: Supplier[];
}

export const SuppliersTable = ({ suppliers: initialSuppliers }: SuppliersTableProps) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    setSuppliers(initialSuppliers);
    setSearchTerm("");
    toast({
      title: "Liste actualisée",
      description: "La liste des fournisseurs a été actualisée.",
    });
  };

  const openEditDialog = (supplier: Supplier) => {
    setCurrentSupplier({...supplier});
    setEditDialogOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (currentSupplier) {
      setCurrentSupplier({
        ...currentSupplier,
        [name]: value,
      });
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSupplier) {
      setSuppliers(suppliers.map(supplier => 
        supplier.id === currentSupplier.id ? currentSupplier : supplier
      ));
      
      toast({
        title: "Fournisseur modifié",
        description: `Les informations de ${currentSupplier.name} ont été mises à jour.`,
      });
      
      setEditDialogOpen(false);
    }
  };

  // Filtrer les fournisseurs en fonction du terme de recherche
  const filteredSuppliers = suppliers.filter(supplier => {
    const term = searchTerm.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(term) ||
      supplier.contact.toLowerCase().includes(term) ||
      supplier.phone.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Rechercher par nom, contact ou téléphone..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          className="md:w-auto w-full"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Actualiser
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Solde (FCFA)</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSuppliers.length > 0 ? (
            filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.name}</TableCell>
                <TableCell>{supplier.contact}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell className={`text-right font-medium ${supplier.balance < 0 ? 'text-red-500' : supplier.balance > 0 ? 'text-amber-600' : 'text-green-500'}`}>
                  {supplier.balance.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4 text-sama-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => openEditDialog(supplier)}
                    >
                      <FileEdit className="h-4 w-4 text-amber-500" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                Aucun fournisseur trouvé pour cette recherche
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Dialog pour modifier les informations du fournisseur */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier les informations du fournisseur</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nom du fournisseur</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={currentSupplier?.name}
                  onChange={handleEditInputChange}
                  placeholder="Électronique Express"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-contact">Personne de contact</Label>
                <Input
                  id="edit-contact"
                  name="contact"
                  value={currentSupplier?.contact}
                  onChange={handleEditInputChange}
                  placeholder="Amadou Diop"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Téléphone</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={currentSupplier?.phone}
                  onChange={handleEditInputChange}
                  placeholder="+221 77 123 45 67"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={currentSupplier?.email}
                  onChange={handleEditInputChange}
                  placeholder="contact@electronique-express.sn"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
