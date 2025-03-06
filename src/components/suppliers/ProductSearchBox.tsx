
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Barcode, Search } from "lucide-react";
import { Product } from "@/types/purchaseOrder";

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
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    barcode: "",
    name: "",
    purchasePrice: 0,
    sellPrice: 0
  });

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

  const handleCreateProduct = () => {
    if (!newProduct.name || !newProduct.barcode) return;
    
    // Create a new product
    const newId = Math.max(...sampleProducts.map(p => p.id)) + 1;
    const createdProduct: Product = {
      id: newId,
      barcode: newProduct.barcode || "",
      name: newProduct.name || "",
      purchasePrice: Number(newProduct.purchasePrice) || 0,
      sellPrice: Number(newProduct.sellPrice) || 0
    };
    
    // Add to products data (in a real app, this would be an API call)
    sampleProducts.push(createdProduct);
    
    // Select the new product
    onSelectProduct(createdProduct);
    
    // Reset form and close dialog
    setNewProduct({
      barcode: "",
      name: "",
      purchasePrice: 0,
      sellPrice: 0
    });
    setShowCreateDialog(false);
    setSearchTerm("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Parse numeric values
    if (name === "purchasePrice" || name === "sellPrice") {
      parsedValue = value === "" ? 0 : Number(value);
    }
    
    setNewProduct(prev => ({ ...prev, [name]: parsedValue }));
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

      {showResults && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {searchResults.length > 0 ? (
            <ul className="py-1">
              {searchResults.map((product) => (
                <li 
                  key={product.id} 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectProduct(product)}
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
                onClick={handleShowCreateDialog}
                className="flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Créer un nouvel article
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel article</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="barcode" className="text-right">Code barre</Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="barcode"
                  name="barcode"
                  value={newProduct.barcode}
                  onChange={handleInputChange}
                  className="flex-1"
                />
                <Button variant="outline" size="icon" title="Scanner">
                  <Barcode className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nom</Label>
              <Input
                id="name"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="purchasePrice" className="text-right">Prix d'achat</Label>
              <Input
                id="purchasePrice"
                name="purchasePrice"
                type="number"
                value={newProduct.purchasePrice}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sellPrice" className="text-right">Prix de vente</Label>
              <Input
                id="sellPrice"
                name="sellPrice"
                type="number"
                value={newProduct.sellPrice}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateProduct}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
