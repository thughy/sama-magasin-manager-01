
import { useState, useCallback } from "react";
import { Purchase } from "@/types/purchase";
import { purchasesData } from "@/data/purchasesData";
import { useToast } from "./use-toast";

export const usePurchasesData = () => {
  const [allPurchases, setAllPurchases] = useState<Purchase[]>([...purchasesData]);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<"all" | "payée" | "impayée">("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPurchaseFormOpen, setIsPurchaseFormOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | undefined>(undefined);
  const { toast } = useToast();

  // Filter purchases based on search terms and filters
  const purchases = allPurchases.filter((purchase) => {
    // Filter by supplier name
    if (supplierSearchTerm && !purchase.supplierName.toLowerCase().includes(supplierSearchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by product name (check in items array if it exists)
    if (productSearchTerm) {
      if (purchase.items && purchase.items.length > 0) {
        // Check if any item matches the product search term
        const hasMatchingProduct = purchase.items.some(item => 
          item.productName.toLowerCase().includes(productSearchTerm.toLowerCase())
        );
        if (!hasMatchingProduct) return false;
      } else if (!purchase.productName.toLowerCase().includes(productSearchTerm.toLowerCase())) {
        // Fallback to main product name for backward compatibility
        return false;
      }
    }
    
    // Filter by date
    if (selectedDate && purchase.purchaseDate !== selectedDate) {
      return false;
    }
    
    // Filter by status
    if (selectedStatus !== "all" && purchase.status !== selectedStatus) {
      return false;
    }
    
    return true;
  });

  const handleRefresh = useCallback(() => {
    setAllPurchases([...purchasesData]);
    toast({
      title: "Données actualisées",
      description: "La liste des achats a été actualisée",
    });
  }, [toast]);

  const handleAddPurchase = useCallback(() => {
    setSelectedPurchase(undefined);
    setIsPurchaseFormOpen(true);
  }, []);

  const handleEditPurchase = useCallback((purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsPurchaseFormOpen(true);
  }, []);

  const handleDeletePurchase = useCallback((purchaseId: string) => {
    const purchase = allPurchases.find(p => p.id === purchaseId);
    setSelectedPurchase(purchase);
    setIsDeleteDialogOpen(true);
  }, [allPurchases]);

  const handleSavePurchase = useCallback((purchase: Purchase) => {
    if (selectedPurchase) {
      // Update existing purchase
      setAllPurchases(allPurchases.map(p => p.id === purchase.id ? purchase : p));
      toast({
        title: "Achat mis à jour",
        description: `L'achat ${purchase.reference} a été mis à jour avec succès`,
      });
    } else {
      // Add new purchase
      setAllPurchases([purchase, ...allPurchases]);
      toast({
        title: "Achat ajouté",
        description: `L'achat ${purchase.reference} a été ajouté avec succès`,
      });
    }
    setIsPurchaseFormOpen(false);
    setSelectedPurchase(undefined);
  }, [allPurchases, selectedPurchase, toast]);

  const confirmDeletePurchase = useCallback(() => {
    if (selectedPurchase) {
      setAllPurchases(allPurchases.filter(p => p.id !== selectedPurchase.id));
      toast({
        title: "Achat supprimé",
        description: `L'achat ${selectedPurchase.reference} a été supprimé`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedPurchase(undefined);
    }
  }, [allPurchases, selectedPurchase, toast]);

  const clearFilters = useCallback(() => {
    setSupplierSearchTerm("");
    setProductSearchTerm("");
    setSelectedDate(undefined);
    setSelectedStatus("all");
  }, []);

  return {
    purchases,
    supplierSearchTerm,
    setSupplierSearchTerm,
    productSearchTerm,
    setProductSearchTerm,
    selectedDate,
    setSelectedDate,
    selectedStatus,
    setSelectedStatus,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isPurchaseFormOpen,
    setIsPurchaseFormOpen,
    selectedPurchase,
    setSelectedPurchase, // <- Adding this to the returned object
    handleRefresh,
    handleAddPurchase,
    handleEditPurchase,
    handleDeletePurchase,
    handleSavePurchase,
    confirmDeletePurchase,
    clearFilters
  };
};
