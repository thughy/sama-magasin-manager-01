
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { suppliersData, Supplier } from "@/data/suppliersData";

interface SupplierSearchBoxProps {
  onSelectSupplier: (supplier: Supplier) => void;
  selectedSupplier: Supplier | null;
}

export const SupplierSearchBox = ({ onSelectSupplier, selectedSupplier }: SupplierSearchBoxProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Supplier[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
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

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const results = suppliersData.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchTerm]);

  const handleSelectSupplier = (supplier: Supplier) => {
    onSelectSupplier(supplier);
    setSearchTerm("");
    setShowResults(false);
  };

  const handleCreateSupplier = () => {
    if (!newSupplier.name) return;
    
    // Create a new supplier
    const newId = Math.max(...suppliersData.map(s => s.id)) + 1;
    const createdSupplier: Supplier = {
      id: newId,
      name: newSupplier.name || "",
      contact: newSupplier.contact || "",
      phone: newSupplier.phone || "",
      email: newSupplier.email || "",
      balance: 0,
      totalInvoice: 0,
      totalPaid: 0,
      status: "impayée"
    };
    
    // Add to suppliers data (in a real app, this would be an API call)
    suppliersData.push(createdSupplier);
    
    // Select the new supplier
    onSelectSupplier(createdSupplier);
    
    // Reset form and close dialog
    setNewSupplier({
      name: "",
      contact: "",
      phone: "",
      email: "",
      balance: 0,
      totalInvoice: 0,
      totalPaid: 0,
      status: "impayée" as const
    });
    setShowCreateDialog(false);
    setSearchTerm("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSupplier(prev => ({ ...prev, [name]: value }));
  };

  const handleShowCreateDialog = () => {
    setShowCreateDialog(true);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Label htmlFor="supplierSearch">Fournisseur</Label>
          <div className="relative">
            <Input
              id="supplierSearch"
              placeholder="Rechercher un fournisseur..."
              value={selectedSupplier ? selectedSupplier.name : searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={() => {
                if (selectedSupplier) {
                  setSearchTerm("");
                  onSelectSupplier(null as unknown as Supplier);
                }
              }}
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {showResults && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {searchResults.length > 0 ? (
            <ul className="py-1">
              {searchResults.map((supplier) => (
                <li 
                  key={supplier.id} 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectSupplier(supplier)}
                >
                  <div className="font-medium">{supplier.name}</div>
                  <div className="text-sm text-gray-500">{supplier.contact} • {supplier.phone}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center">
              <p className="mb-2 text-gray-500">Aucun fournisseur trouvé</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShowCreateDialog}
                className="flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Créer un nouveau fournisseur
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateSupplier}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
