
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Supplier } from "@/data/suppliersData";

interface SupplierSearchResultsProps {
  showResults: boolean;
  searchResults: Supplier[];
  onSelectSupplier: (supplier: Supplier) => void;
  onShowCreateDialog: () => void;
}

export const SupplierSearchResults = ({ 
  showResults, 
  searchResults, 
  onSelectSupplier, 
  onShowCreateDialog 
}: SupplierSearchResultsProps) => {
  if (!showResults) return null;

  return (
    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
      {searchResults.length > 0 ? (
        <ul className="py-1">
          {searchResults.map((supplier) => (
            <li 
              key={supplier.id} 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelectSupplier(supplier)}
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
            onClick={onShowCreateDialog}
            className="flex items-center gap-1"
          >
            <Plus className="h-3 w-3" /> Créer un nouveau fournisseur
          </Button>
        </div>
      )}
    </div>
  );
};
