
import { useCallback } from "react";
import { Purchase } from "@/types/purchase";
import { Supplier } from "@/data/suppliersData";
import { useToast } from "../use-toast";
import { calculateSupplierBalance, calculateSupplierTotalInvoice } from "@/utils/supplierCalculations";

export const usePurchaseFormOperations = (
  selectedSupplier: Supplier | null,
  suppliers: Supplier[],
  setSuppliers: (suppliers: Supplier[]) => void,
  setSupplierPurchases: (purchases: Purchase[]) => void,
  setIsPurchaseFormOpen: (isOpen: boolean) => void,
  setSelectedPurchase: (purchase: Purchase | null) => void
) => {
  const { toast } = useToast();

  const handleSavePurchase = useCallback((updatedPurchase: Purchase) => {
    const storedPurchases = localStorage.getItem("purchases");
    if (!storedPurchases) return;

    try {
      const allPurchases: Purchase[] = JSON.parse(storedPurchases);
      
      // Update the purchase in the list
      const updatedPurchases = allPurchases.map(purchase => {
        if (purchase.id === updatedPurchase.id) {
          return updatedPurchase;
        }
        return purchase;
      });

      // Save updated purchases
      localStorage.setItem("purchases", JSON.stringify(updatedPurchases));

      // Update supplier data if needed
      if (selectedSupplier) {
        const updatedSuppliers = suppliers.map(supplier => {
          if (supplier.id === selectedSupplier.id) {
            const newBalance = calculateSupplierBalance(supplier.id, updatedPurchases);
            const totalInvoice = calculateSupplierTotalInvoice(supplier.id, updatedPurchases);
            const totalPaid = totalInvoice - newBalance;
            
            return {
              ...supplier,
              balance: newBalance,
              totalInvoice,
              totalPaid,
              status: newBalance <= 0 ? 'payée' as const : 'impayée' as const
            };
          }
          return supplier;
        });

        setSuppliers(updatedSuppliers);
      }

      // Refresh purchases for supplier
      if (selectedSupplier) {
        const updatedSupplierPurchases = updatedPurchases.filter(
          (purchase) => purchase.supplierId === selectedSupplier.id
        );
        setSupplierPurchases(updatedSupplierPurchases);
      }

      // Close form and show success toast
      setIsPurchaseFormOpen(false);
      setSelectedPurchase(null);
      
      toast({
        title: "Facture mise à jour",
        description: `La facture ${updatedPurchase.reference} a été mise à jour avec succès`,
      });
    } catch (error) {
      console.error("Error during purchase update:", error);
      toast({
        title: "Erreur de mise à jour",
        description: "Une erreur s'est produite lors de la mise à jour de la facture",
        variant: "destructive",
      });
    }
  }, [selectedSupplier, suppliers, setSuppliers, setSupplierPurchases, setIsPurchaseFormOpen, setSelectedPurchase, toast]);

  return {
    handleSavePurchase
  };
};
