
import { useState, useEffect } from "react";
import { Purchase } from "@/types/purchase";
import { Supplier } from "@/data/suppliersData";
import { suppliersData } from "@/data/suppliersData";
import { useToast } from "./use-toast";

export const useSupplierPayments = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierPurchases, setSupplierPurchases] = useState<Purchase[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'wave' | 'orangeMoney' | 'cheque' | 'bank'>('cash');
  const { toast } = useToast();

  // Load suppliers on mount
  useEffect(() => {
    console.log("Loading suppliers data:", suppliersData);
    setSuppliers(suppliersData || []);
  }, []);

  // Load purchases for selected supplier
  useEffect(() => {
    if (selectedSupplier) {
      const storedPurchases = localStorage.getItem("purchases");
      if (storedPurchases) {
        try {
          const allPurchases: Purchase[] = JSON.parse(storedPurchases);
          const filteredPurchases = allPurchases.filter(
            (purchase) => purchase.supplierId === selectedSupplier.id && purchase.status === 'impayée'
          );
          console.log("Filtered purchases for supplier:", filteredPurchases);
          setSupplierPurchases(filteredPurchases);
        } catch (error) {
          console.error("Error parsing purchases:", error);
          setSupplierPurchases([]);
        }
      } else {
        setSupplierPurchases([]);
      }
    } else {
      setSupplierPurchases([]);
    }
  }, [selectedSupplier]);

  const handleSupplierSelect = (supplier: Supplier) => {
    console.log("Selected supplier:", supplier);
    setSelectedSupplier(supplier);
  };

  const handlePaymentClick = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setPaymentAmount(purchase.balance);
    setIsPaymentDialogOpen(true);
  };

  const handlePaymentSubmit = () => {
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
          const newStatus = newBalance <= 0 ? 'payée' as const : 'impayée' as const;
          
          return {
            ...purchase,
            totalPaid: newTotalPaid,
            balance: newBalance,
            status: newStatus
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
          const newStatus = newBalance <= 0 ? 'payée' as const : 'impayée' as const;
          
          return {
            ...supplier,
            balance: newBalance,
            totalPaid: supplier.totalPaid + paymentAmount,
            status: newStatus
          };
        }
        return supplier;
      });

      // Update local state
      setSuppliers(updatedSuppliers);
      
      // Refresh purchases for supplier
      const updatedSupplierPurchases = updatedPurchases.filter(
        (purchase) => purchase.supplierId === selectedSupplier.id && purchase.status === 'impayée'
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
  };

  const calculateSupplierBalance = (supplierId: number, purchases: Purchase[]): number => {
    const supplierPurchases = purchases.filter(p => p.supplierId === supplierId);
    return supplierPurchases.reduce((sum, purchase) => sum + purchase.balance, 0);
  };

  return {
    suppliers,
    selectedSupplier,
    setSelectedSupplier,
    supplierPurchases,
    isPaymentDialogOpen,
    setIsPaymentDialogOpen,
    selectedPurchase,
    setSelectedPurchase,
    paymentAmount,
    setPaymentAmount,
    paymentMethod,
    setPaymentMethod,
    handleSupplierSelect,
    handlePaymentClick,
    handlePaymentSubmit
  };
};
