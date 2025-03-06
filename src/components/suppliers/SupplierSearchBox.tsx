
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { suppliersData, Supplier } from "@/data/suppliersData";
import { SupplierSearchResults } from "./SupplierSearchResults";
import { SupplierCreateDialog } from "./SupplierCreateDialog";

interface SupplierSearchBoxProps {
  onSelectSupplier: (supplier: Supplier) => void;
  selectedSupplier: Supplier | null;
}

export const SupplierSearchBox = ({ onSelectSupplier, selectedSupplier }: SupplierSearchBoxProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Supplier[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

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

  const handleCreateSupplier = (createdSupplier: Supplier) => {
    // Add to suppliers data (in a real app, this would be an API call)
    suppliersData.push(createdSupplier);
    
    // Select the new supplier
    onSelectSupplier(createdSupplier);
    
    // Close dialog and reset search
    setShowCreateDialog(false);
    setSearchTerm("");
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

      <SupplierSearchResults
        showResults={showResults}
        searchResults={searchResults}
        onSelectSupplier={handleSelectSupplier}
        onShowCreateDialog={handleShowCreateDialog}
      />

      <SupplierCreateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateSupplier={handleCreateSupplier}
        lastSupplierId={Math.max(...suppliersData.map(s => s.id))}
      />
    </div>
  );
};
