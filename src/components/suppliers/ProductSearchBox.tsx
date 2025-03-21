import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Product } from "@/types/purchaseOrder";
import { ProductSearchResults } from "./ProductSearchResults";
import { ProductCreateDialog } from "./ProductCreateDialog";
import { initialItems } from "@/data/productsData";

const getProductsFromItems = () => {
  return initialItems
    .filter(item => item.type === "product")
    .map(item => ({
      id: parseInt(item.id.replace('PRD', '')) || 0,
      barcode: (item.type === "product") ? item.barcode : "",
      name: item.name,
      purchasePrice: (item.type === "product") ? item.buyPrice : 0,
      sellPrice: (item.type === "product") ? item.sellPrice : 0
    }));
};

interface ProductSearchBoxProps {
  onSelectProduct: (product: Product) => void;
  currentItems: number[];
}

export const ProductSearchBox = ({ onSelectProduct, currentItems }: ProductSearchBoxProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const formattedProducts = getProductsFromItems();
    console.log("Initialized products:", formattedProducts);
    setProducts(formattedProducts);
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const results = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm)
      );
      
      const filteredResults = results.filter(product => !currentItems.includes(Number(product.id)));
      
      setSearchResults(filteredResults);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchTerm, currentItems, products]);

  const handleSelectProduct = (product: Product) => {
    const selectedProduct: Product = {
      id: Number(product.id),
      barcode: String(product.barcode || ""),
      name: String(product.name || ""),
      purchasePrice: Number(product.purchasePrice || 0),
      sellPrice: Number(product.sellPrice || 0)
    };
    
    console.log("Sending selected product from SearchBox:", selectedProduct);
    
    if (!selectedProduct.name) {
      console.error("Product name is empty or undefined!");
      return;
    }
    
    onSelectProduct(selectedProduct);
    
    setSearchTerm("");
    setShowResults(false);
  };

  const handleCreateProduct = (newProduct: Product) => {
    setProducts([...products, newProduct]);
    
    onSelectProduct(newProduct);
    
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
              autoComplete="off"
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
