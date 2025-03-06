
import { useState, useMemo } from "react";
import { Purchase } from "@/types/purchase";
import { purchasesData as initialPurchasesData } from "@/data/purchasesData";
import { useToast } from "@/hooks/use-toast";
import { isSameDay } from "date-fns";

export const usePurchasesData = () => {
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchasesData);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const { toast } = useToast();

  const filteredPurchases = useMemo(() => {
    return purchases.filter((purchase) => {
      // Filter by supplier name
      const matchesSupplier = supplierSearchTerm === "" ||
        purchase.supplierName.toLowerCase().includes(supplierSearchTerm.toLowerCase());
      
      // Filter by product name
      const matchesProduct = productSearchTerm === "" ||
        purchase.productName.toLowerCase().includes(productSearchTerm.toLowerCase());
      
      // Filter by date
      const matchesDate = !selectedDate ||
        (purchase.purchaseDate && isSameDay(new Date(purchase.purchaseDate), selectedDate));
      
      // Filter by status
      const matchesStatus = selectedStatus === "" || selectedStatus === "all" ||
        purchase.status === selectedStatus;
      
      return matchesSupplier && matchesProduct && matchesDate && matchesStatus;
    });
  }, [purchases, supplierSearchTerm, productSearchTerm, selectedDate, selectedStatus]);

  const handleRefresh = () => {
    setPurchases(initialPurchasesData);
    toast({
      title: "Actualisé",
      description: "La liste des achats a été actualisée.",
    });
  };

  const handleAddPurchase = () => {
    // To be implemented
    toast({
      title: "Pas encore implémenté",
      description: "La fonctionnalité d'ajout d'achat n'est pas encore disponible.",
    });
  };

  const handleEditPurchase = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsEditModalOpen(true);
  };

  const handleDeletePurchase = (purchaseId: string) => {
    const purchaseToDelete = purchases.find(p => p.id === purchaseId);
    if (purchaseToDelete) {
      setSelectedPurchase(purchaseToDelete);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDeletePurchase = () => {
    if (selectedPurchase) {
      setPurchases(purchases.filter(p => p.id !== selectedPurchase.id));
      toast({
        title: "Achat supprimé",
        description: `L'achat ${selectedPurchase.reference} a été supprimé.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedPurchase(null);
    }
  };

  const clearFilters = () => {
    setSupplierSearchTerm("");
    setProductSearchTerm("");
    setSelectedDate(undefined);
    setSelectedStatus("");
  };

  return {
    purchases: filteredPurchases,
    supplierSearchTerm,
    setSupplierSearchTerm,
    productSearchTerm,
    setProductSearchTerm,
    selectedDate,
    setSelectedDate,
    selectedStatus,
    setSelectedStatus,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedPurchase,
    setSelectedPurchase,
    handleRefresh,
    handleAddPurchase,
    handleEditPurchase,
    handleDeletePurchase,
    confirmDeletePurchase,
    clearFilters
  };
};
