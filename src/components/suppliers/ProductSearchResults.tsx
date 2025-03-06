
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Product } from "@/types/purchaseOrder";

interface ProductSearchResultsProps {
  showResults: boolean;
  searchResults: Product[];
  onSelectProduct: (product: Product) => void;
  onShowCreateDialog: () => void;
}

export const ProductSearchResults = ({ 
  showResults, 
  searchResults, 
  onSelectProduct, 
  onShowCreateDialog 
}: ProductSearchResultsProps) => {
  if (!showResults) return null;

  return (
    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
      {searchResults.length > 0 ? (
        <ul className="py-1">
          {searchResults.map((product) => (
            <li 
              key={product.id} 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelectProduct(product)}
            >
              <div className="font-medium">{product.name}</div>
              <div className="text-sm text-gray-500">
                <span className="mr-2">Code: {product.barcode}</span>
                <span>Prix: {product.purchasePrice.toLocaleString()} F CFA</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 text-center">
          <p className="mb-2 text-gray-500">Aucun article trouvé</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onShowCreateDialog}
            className="flex items-center gap-1"
          >
            <Plus className="h-3 w-3" /> Créer un nouvel article
          </Button>
        </div>
      )}
    </div>
  );
};
