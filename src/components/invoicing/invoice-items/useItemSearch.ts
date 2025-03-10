
import { useState, useCallback } from "react";
import { Item } from "@/types/product";
import { initialItems } from "@/data/productsData";

export function useItemSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    
    if (value.length >= 2) {
      const results = initialItems.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(value.toLowerCase());
        const barcodeMatch = 
          item.type === "product" && 
          item.barcode.includes(value);
        
        return nameMatch || barcodeMatch;
      });
      
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, []);
  
  const resetSearch = useCallback(() => {
    setSearchTerm("");
    setShowResults(false);
  }, []);
  
  return {
    searchTerm,
    searchResults,
    showResults,
    handleSearch,
    resetSearch
  };
}
