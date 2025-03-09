
import { useState, useEffect } from "react";
import { Purchase } from "@/types/purchase";
import { Supplier } from "@/data/suppliersData";

export const useSupplierPurchases = (selectedSupplier: Supplier | null) => {
  const [supplierPurchases, setSupplierPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.info("Selected supplier changed:", selectedSupplier?.name || 'none');
    
    // Reset state when supplier changes
    setSupplierPurchases([]);
    
    if (!selectedSupplier) {
      return;
    }

    // Set loading state
    setIsLoading(true);
    setError(null);

    // Use setTimeout to prevent state updates in the same render cycle
    setTimeout(() => {
      try {
        const storedPurchases = localStorage.getItem("purchases");
        
        if (!storedPurchases) {
          console.info("No purchases found in localStorage");
          setSupplierPurchases([]);
          setIsLoading(false);
          return;
        }

        const allPurchases: Purchase[] = JSON.parse(storedPurchases);
        
        if (!Array.isArray(allPurchases)) {
          console.error("Stored purchases is not an array:", allPurchases);
          setSupplierPurchases([]);
          setIsLoading(false);
          return;
        }
        
        const filteredPurchases = allPurchases.filter(
          (purchase) => purchase?.supplierId === selectedSupplier.id
        );
        
        // Important: Always set the supplier purchases, even if the array is empty
        setSupplierPurchases(filteredPurchases);
        console.info(`Found ${filteredPurchases.length} purchases for supplier ${selectedSupplier.name}`);
      } catch (error) {
        console.error("Error parsing purchases:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
        setSupplierPurchases([]);
      } finally {
        setIsLoading(false);
      }
    }, 0);
  }, [selectedSupplier]);

  return {
    supplierPurchases,
    setSupplierPurchases,
    isLoading,
    error
  };
};
