
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Supplier } from "@/data/suppliersData";

interface SupplierSelectorProps {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  onSupplierSelect: (supplier: Supplier) => void;
  isLoading?: boolean;
}

export function SupplierSelector({ 
  suppliers, 
  selectedSupplier, 
  onSupplierSelect,
  isLoading = false
}: SupplierSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  
  // Ensure suppliers is always an array
  const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];
  
  useEffect(() => {
    if (searchTerm.length >= 1) {
      const filtered = safeSuppliers.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSuppliers(filtered);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchTerm, safeSuppliers]);

  return (
    <div className="relative w-full">
      <Label htmlFor="supplierSearch">Fournisseur</Label>
      <Input
        id="supplierSearch"
        placeholder="Rechercher un fournisseur..."
        value={selectedSupplier ? selectedSupplier.name : searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClick={() => {
          if (selectedSupplier) {
            setSearchTerm("");
            onSupplierSelect(null as unknown as Supplier);
          }
        }}
        disabled={isLoading}
        className="w-full"
        autoComplete="off"
      />
      
      {showResults && !selectedSupplier && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredSuppliers.length > 0 ? (
            <ul className="py-1">
              {filteredSuppliers.map((supplier) => (
                <li 
                  key={supplier.id} 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onSupplierSelect(supplier);
                    setShowResults(false);
                  }}
                >
                  <div className="font-medium">{supplier.name}</div>
                  <div className="text-sm text-gray-500">{supplier.contact} • {supplier.phone}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Aucun fournisseur trouvé
            </div>
          )}
        </div>
      )}
    </div>
  );
}
