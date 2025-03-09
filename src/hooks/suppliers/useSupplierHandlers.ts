
import { useCallback } from "react";
import { Purchase } from "@/types/purchase";
import { Supplier } from "@/data/suppliersData";
import { format } from "date-fns";

export const useSupplierHandlers = (
  setSelectedSupplier: (supplier: Supplier) => void,
  setSelectedPurchase: (purchase: Purchase | null) => void,
  setIsPaymentDialogOpen: (isOpen: boolean) => void,
  setIsPaymentHistoryOpen: (isOpen: boolean) => void,
  setIsPurchaseFormOpen: (isOpen: boolean) => void,
  setPaymentAmount: (amount: number) => void,
  setPaymentDate: (date: string) => void
) => {
  const handleSupplierSelect = useCallback((supplier: Supplier) => {
    // First, reset all state related to the previous supplier
    setSelectedPurchase(null);
    setIsPaymentDialogOpen(false);
    setIsPaymentHistoryOpen(false);
    setIsPurchaseFormOpen(false);
    
    // Then set the new supplier
    setTimeout(() => {
      setSelectedSupplier(supplier);
    }, 0);
  }, [setSelectedSupplier, setSelectedPurchase, setIsPaymentDialogOpen, setIsPaymentHistoryOpen, setIsPurchaseFormOpen]);

  const handlePaymentClick = useCallback((purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setPaymentAmount(purchase.balance);
    setPaymentDate(format(new Date(), 'yyyy-MM-dd'));
    setIsPaymentDialogOpen(true);
  }, [setSelectedPurchase, setPaymentAmount, setPaymentDate, setIsPaymentDialogOpen]);

  const handleViewPaymentHistory = useCallback((purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsPaymentHistoryOpen(true);
  }, [setSelectedPurchase, setIsPaymentHistoryOpen]);

  const handleEditPurchase = useCallback((purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsPurchaseFormOpen(true);
  }, [setSelectedPurchase, setIsPurchaseFormOpen]);

  return {
    handleSupplierSelect,
    handlePaymentClick,
    handleViewPaymentHistory,
    handleEditPurchase
  };
};
