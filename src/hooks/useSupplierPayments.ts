
import { useState, useEffect, useCallback } from "react";
import { Purchase } from "@/types/purchase";
import { Supplier } from "@/data/suppliersData";
import { suppliersData } from "@/data/suppliersData";
import { purchasesData } from "@/data/purchasesData";
import { useToast } from "./use-toast";

export const useSupplierPayments = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierPurchases, setSupplierPurchases] = useState<Purchase[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'wave' | 'orangeMoney' | 'cheque' | 'bank'>('cash');
  const [isPurchaseFormOpen, setIsPurchaseFormOpen] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Load suppliers on mount
  useEffect(() => {
    console.info("SupplierPayments component mounted");
    
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

  // Load purchases for selected supplier
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
      // Modified to show all purchases for the supplier, not just unpaid ones
      const filteredPurchases = allPurchases.filter(
        (purchase) => purchase.supplierId === selectedSupplier.id
      );
      
      setSupplierPurchases(filteredPurchases);
    } catch (error) {
      console.error("Error parsing purchases:", error);
      setSupplierPurchases([]);
    }
  }, [selectedSupplier]);

  const handleSupplierSelect = useCallback((supplier: Supplier) => {
    setSelectedSupplier(supplier);
  }, []);

  const handlePaymentClick = useCallback((purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setPaymentAmount(purchase.balance);
    setIsPaymentDialogOpen(true);
  }, []);

  const handleEditPurchase = useCallback((purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsPurchaseFormOpen(true);
  }, []);

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
        
        // Update selected supplier
        const updatedSelectedSupplier = updatedSuppliers.find(s => s.id === selectedSupplier.id) || null;
        setSelectedSupplier(updatedSelectedSupplier);
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
  }, [selectedSupplier, suppliers, toast]);

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
            date: new Date().toISOString() // Add the date for payment history
          };
          
          return {
            ...purchase,
            totalPaid: newTotalPaid,
            balance: newBalance,
            status: newBalance <= 0 ? 'payée' as const : 'impayée' as const,
            // Add or update payment methods array
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
  }, [paymentAmount, paymentMethod, selectedPurchase, selectedSupplier, suppliers, toast]);

  const calculateSupplierBalance = (supplierId: number, purchases: Purchase[]): number => {
    const supplierPurchases = purchases.filter(p => p.supplierId === supplierId);
    return supplierPurchases.reduce((sum, purchase) => sum + purchase.balance, 0);
  };

  const calculateSupplierTotalInvoice = (supplierId: number, purchases: Purchase[]): number => {
    const supplierPurchases = purchases.filter(p => p.supplierId === supplierId);
    return supplierPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
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
    isPurchaseFormOpen,
    setIsPurchaseFormOpen,
    handleSupplierSelect,
    handlePaymentClick,
    handlePaymentSubmit,
    handleEditPurchase,
    handleSavePurchase,
    isLoading
  };
};
