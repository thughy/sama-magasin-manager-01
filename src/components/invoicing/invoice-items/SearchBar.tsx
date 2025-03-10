
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Barcode, Search } from "lucide-react";
import { Item } from "@/types/product";

interface SearchBarProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  showResults: boolean;
  searchResults: Item[];
  onSelectItem: (item: Item) => void;
}

export function SearchBar({ 
  searchTerm, 
  onSearch, 
  showResults, 
  searchResults, 
  onSelectItem 
}: SearchBarProps) {
  return (
    <div className="relative w-2/3">
      <Input
        placeholder="Rechercher un article ou service par nom ou code barre..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="pr-10 w-full"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
        <Search className="h-4 w-4 text-gray-400" />
        <Barcode className="h-4 w-4 text-gray-400" />
      </div>
      
      {showResults && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {searchResults.length > 0 ? (
            <ul className="py-1">
              {searchResults.map((item) => (
                <li
                  key={item.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => onSelectItem(item)}
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500 flex flex-wrap gap-2">
                    {item.type === "product" ? (
                      <>
                        <span>Code: {item.barcode}</span>
                        <span>Prix: {item.sellPrice.toLocaleString()} FCFA</span>
                        <span>Stock: {item.stock}</span>
                      </>
                    ) : (
                      <span>Prix: {item.amount.toLocaleString()} FCFA</span>
                    )}
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
