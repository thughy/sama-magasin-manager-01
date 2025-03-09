
import { useState, useEffect } from "react";
import { Supplier } from "@/data/suppliersData";
import { suppliersData } from "@/data/suppliersData";
import { purchasesData } from "@/data/purchasesData";

export const useSupplierData = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.info("Loading suppliers data");
    
    try {
      // Set loading state
      setIsLoading(true);
      
      // Initialize suppliers
      const allSuppliers = suppliersData || [];
      setSuppliers(allSuppliers);
      console.info("Suppliers loaded:", allSuppliers);

      // Initialize localStorage with sample purchase data if needed
      if (!localStorage.getItem("purchases")) {
        localStorage.setItem("purchases", JSON.stringify(purchasesData));
      }
      
      // Check if there's a pre-selected supplier ID from the suppliers page
      const preSelectedSupplierId = localStorage.getItem("selectedSupplierId");
      if (preSelectedSupplierId) {
        const supplierId = parseInt(preSelectedSupplierId);
        const supplier = allSuppliers.find(s => s.id === supplierId);
        if (supplier) {
          setSelectedSupplier(supplier);
          console.info("Pre-selected supplier loaded:", supplier);
        }
        // Clear the stored ID after loading
        localStorage.removeItem("selectedSupplierId");
      }
    } catch (error) {
      console.error("Error loading suppliers data:", error);
      setSuppliers([]);
    } finally {
      // End loading state after a short delay to avoid UI flashing
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, []);

  return {
    suppliers,
    setSuppliers,
    selectedSupplier,
    setSelectedSupplier,
    isLoading
  };
};
