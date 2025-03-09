
import { useSupplierData } from "./suppliers/useSupplierData";
import { useSupplierPurchases } from "./suppliers/useSupplierPurchases";
import { usePaymentState } from "./suppliers/usePaymentState";
import { usePaymentOperations } from "./suppliers/usePaymentOperations";
import { usePurchaseFormOperations } from "./suppliers/usePurchaseFormOperations";
import { useSupplierHandlers } from "./suppliers/useSupplierHandlers";

export const useSupplierPayments = () => {
  // Supplier data and state
  const {
    suppliers,
    setSuppliers,
    selectedSupplier,
    setSelectedSupplier,
    isLoading
  } = useSupplierData();

  // Supplier purchases
  const {
    supplierPurchases,
    setSupplierPurchases
  } = useSupplierPurchases(selectedSupplier);

  // Payment state
  const {
    isPaymentDialogOpen,
    setIsPaymentDialogOpen,
    isPaymentHistoryOpen,
    setIsPaymentHistoryOpen,
    selectedPurchase,
    setSelectedPurchase,
    paymentAmount,
    setPaymentAmount,
    paymentMethod,
    setPaymentMethod,
    paymentDate,
    setPaymentDate,
    isPurchaseFormOpen,
    setIsPurchaseFormOpen
  } = usePaymentState();

  // Supplier interaction handlers
  const {
    handleSupplierSelect,
    handlePaymentClick,
    handleViewPaymentHistory,
    handleEditPurchase
  } = useSupplierHandlers(
    setSelectedSupplier,
    setSelectedPurchase,
    setIsPaymentDialogOpen,
    setIsPaymentHistoryOpen,
    setIsPurchaseFormOpen,
    setPaymentAmount,
    setPaymentDate
  );

  // Payment operations
  const {
    handlePaymentSubmit
  } = usePaymentOperations(
    selectedSupplier,
    suppliers,
    setSuppliers,
    selectedPurchase,
    paymentAmount,
    paymentMethod,
    paymentDate,
    setSupplierPurchases,
    setIsPaymentDialogOpen,
    setSelectedPurchase,
    setPaymentAmount
  );

  // Purchase form operations
  const {
    handleSavePurchase
  } = usePurchaseFormOperations(
    selectedSupplier,
    suppliers,
    setSuppliers,
    setSupplierPurchases,
    setIsPurchaseFormOpen,
    setSelectedPurchase
  );

  return {
    suppliers,
    selectedSupplier,
    setSelectedSupplier,
    supplierPurchases,
    isPaymentDialogOpen,
    setIsPaymentDialogOpen,
    isPaymentHistoryOpen,
    setIsPaymentHistoryOpen,
    selectedPurchase,
    setSelectedPurchase,
    paymentAmount,
    setPaymentAmount,
    paymentMethod,
    setPaymentMethod,
    paymentDate,
    setPaymentDate,
    isPurchaseFormOpen,
    setIsPurchaseFormOpen,
    handleSupplierSelect,
    handlePaymentClick,
    handlePaymentSubmit,
    handleEditPurchase,
    handleSavePurchase,
    handleViewPaymentHistory,
    isLoading
  };
};
