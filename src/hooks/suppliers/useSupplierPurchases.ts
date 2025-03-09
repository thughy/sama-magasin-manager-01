
import { useState, useEffect } from "react";
import { Purchase } from "@/types/purchase";
import { Supplier } from "@/data/suppliersData";

export const useSupplierPurchases = (selectedSupplier: Supplier | null) => {
  const [supplierPurchases, setSupplierPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    console.info("Selected supplier changed:", selectedSupplier);
    
    if (!selectedSupplier) {
      setSupplierPurchases([]);
      return;
    }

    try {
      const storedPurchases = localStorage.getItem("purchases");
      if (!storedPurchases) {
        setSupplierPurchases([]);
        return;
      }

      const allPurchases: Purchase[] = JSON.parse(storedPurchases);
      const filteredPurchases = allPurchases.filter(
        (purchase) => purchase.supplierId === selectedSupplier.id
      );
      
      // Important: Always set the supplier purchases, even if the array is empty
      setSupplierPurchases(filteredPurchases);
      console.info(`Found ${filteredPurchases.length} purchases for supplier ${selectedSupplier.name}`);
    } catch (error) {
      console.error("Error parsing purchases:", error);
      setSupplierPurchases([]);
    }
  }, [selectedSupplier]);

  return {
    supplierPurchases,
    setSupplierPurchases
  };
};
