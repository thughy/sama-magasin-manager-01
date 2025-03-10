
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Barcode, Plus, Search, Tag } from "lucide-react";
import { Item } from "@/types/product";
import { initialItems } from "@/data/productsData";

interface ItemSearchBoxProps {
  onSelectItem: (item: Item) => void;
}

export function ItemSearchBox({ onSelectItem }: ItemSearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const results = initialItems.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const barcodeMatch = 
          item.type === "product" && 
          item.barcode.includes(searchTerm);
        
        return nameMatch || barcodeMatch;
      });
      
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchTerm]);

  const handleSelectItem = (item: Item) => {
    onSelectItem(item);
    setSearchTerm("");
    setShowResults(false);
  };

  return (
    <div className="relative mb-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Rechercher un article ou service par nom ou code barre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
            <Search className="h-4 w-4 text-gray-400" />
            <Barcode className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        <Button variant="outline" size="icon" title="Ajouter un nouvel article">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {showResults && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {searchResults.length > 0 ? (
            <ul className="py-1">
              {searchResults.map((item) => (
                <li
                  key={item.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectItem(item)}
                >
                  <div className="flex items-center gap-2">
                    {item.type === "product" ? (
                      <Barcode className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Tag className="h-4 w-4 text-gray-400" />
                    )}
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500 flex flex-wrap gap-2">
                        {item.type === "product" ? (
                          <>
                            <span>Code: {item.barcode}</span>
                            <span>Prix: {item.sellPrice.toLocaleString()} XOF</span>
                          </>
                        ) : (
                          <span>Prix: {item.amount.toLocaleString()} XOF</span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Aucun article ou service trouvé
            </div>
          )}
        </div>
      )}
    </div>
  );
}
