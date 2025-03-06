
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Product } from "@/types/purchaseOrder";
import { ProductSearchResults } from "./ProductSearchResults";
import { ProductCreateDialog } from "./ProductCreateDialog";

// Sample product data (in a real app, this would come from an API)
const sampleProducts: Product[] = [
  { id: 1, barcode: "123456789", name: "Clavier sans fil", purchasePrice: 15000, sellPrice: 25000 },
  { id: 2, barcode: "234567890", name: "Souris optique", purchasePrice: 5000, sellPrice: 8500 },
  { id: 3, barcode: "345678901", name: "Écouteurs Bluetooth", purchasePrice: 12000, sellPrice: 19500 },
  { id: 4, barcode: "456789012", name: "Chargeur USB-C", purchasePrice: 4500, sellPrice: 7500 },
  { id: 5, barcode: "567890123", name: "Câble HDMI 2m", purchasePrice: 3000, sellPrice: 5500 },
];

interface ProductSearchBoxProps {
  onSelectProduct: (product: Product) => void;
  currentItems: number[];
}

export const ProductSearchBox = ({ onSelectProduct, currentItems }: ProductSearchBoxProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const results = sampleProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm)
      );
      
      // Filter out products that are already in the list
      const filteredResults = results.filter(product => !currentItems.includes(product.id));
      
      setSearchResults(filteredResults);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchTerm, currentItems]);

  const handleSelectProduct = (product: Product) => {
    onSelectProduct(product);
    setSearchTerm("");
    setShowResults(false);
  };

  const handleCreateProduct = (newProduct: Product) => {
    // Add to products data (in a real app, this would be an API call)
    sampleProducts.push(newProduct);
    
    // Select the new product
    onSelectProduct(newProduct);
    
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
          <Label htmlFor="productSearch">Article</Label>
          <div className="relative">
            <Input
              id="productSearch"
              placeholder="Rechercher un article par nom ou code barre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="pt-7">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleShowCreateDialog}
            title="Ajouter un nouvel article"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ProductSearchResults
        showResults={showResults}
        searchResults={searchResults}
        onSelectProduct={handleSelectProduct}
        onShowCreateDialog={handleShowCreateDialog}
      />

      <ProductCreateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateProduct={handleCreateProduct}
      />
    </div>
  );
};
