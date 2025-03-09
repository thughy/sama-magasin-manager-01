
import { useCallback } from "react";
import { Purchase } from "@/types/purchase";
import { Supplier } from "@/data/suppliersData";
import { useToast } from "../use-toast";
import { format } from "date-fns";
import { calculateSupplierBalance } from "@/utils/supplierCalculations";

export const usePaymentOperations = (
  selectedSupplier: Supplier | null,
  suppliers: Supplier[],
  setSuppliers: (suppliers: Supplier[]) => void,
  selectedPurchase: Purchase | null,
  paymentAmount: number,
  paymentMethod: 'cash' | 'wave' | 'orangeMoney' | 'cheque' | 'bank',
  paymentDate: string,
  setSupplierPurchases: (purchases: Purchase[]) => void,
  setIsPaymentDialogOpen: (isOpen: boolean) => void,
  setSelectedPurchase: (purchase: Purchase | null) => void,
  setPaymentAmount: (amount: number) => void
) => {
  const { toast } = useToast();

  const handlePaymentSubmit = useCallback(() => {
    if (!selectedPurchase || !selectedSupplier) return;

    const storedPurchases = localStorage.getItem("purchases");
    if (!storedPurchases) return;

    try {
      const allPurchases: Purchase[] = JSON.parse(storedPurchases);
      
      // Update the purchase with new payment
      const updatedPurchases = allPurchases.map(purchase => {
        if (purchase.id === selectedPurchase.id) {
          const newTotalPaid = purchase.totalPaid + paymentAmount;
          const newBalance = purchase.totalAmount - newTotalPaid;
          
          // Create a new payment method entry
          const newPaymentMethod = {
            id: `payment-${Date.now()}`,
            method: paymentMethod,
            amount: paymentAmount,
            date: paymentDate
          };
          
          return {
            ...purchase,
            totalPaid: newTotalPaid,
            balance: newBalance,
            status: newBalance <= 0 ? 'payée' as const : 'impayée' as const,
            paymentMethods: [
              ...(purchase.paymentMethods || []),
              newPaymentMethod
            ]
          };
        }
        return purchase;
      });

      // Save updated purchases
      localStorage.setItem("purchases", JSON.stringify(updatedPurchases));

      // Update supplier data
      const updatedSuppliers = suppliers.map(supplier => {
        if (supplier.id === selectedSupplier.id) {
          const newBalance = calculateSupplierBalance(supplier.id, updatedPurchases);
          
          return {
            ...supplier,
            balance: newBalance,
            totalPaid: supplier.totalPaid + paymentAmount,
            status: newBalance <= 0 ? 'payée' as const : 'impayée' as const
          };
        }
        return supplier;
      });

      // Update local state
      setSuppliers(updatedSuppliers);
      
      // Refresh purchases for supplier
      const updatedSupplierPurchases = updatedPurchases.filter(
        (purchase) => purchase.supplierId === selectedSupplier.id
      );
      setSupplierPurchases(updatedSupplierPurchases);

      // Close dialog and show success toast
      setIsPaymentDialogOpen(false);
      setSelectedPurchase(null);
      setPaymentAmount(0);
      
      toast({
        title: "Paiement enregistré",
        description: `Paiement de ${paymentAmount.toLocaleString()} F CFA effectué pour la facture ${selectedPurchase.reference}`,
      });
    } catch (error) {
      console.error("Error during payment processing:", error);
      toast({
        title: "Erreur de paiement",
        description: "Une erreur s'est produite lors du traitement du paiement",
        variant: "destructive",
      });
    }
  }, [paymentAmount, paymentMethod, paymentDate, selectedPurchase, selectedSupplier, suppliers, setSuppliers, setSupplierPurchases, setIsPaymentDialogOpen, setSelectedPurchase, setPaymentAmount, toast]);

  return {
    handlePaymentSubmit
  };
};
