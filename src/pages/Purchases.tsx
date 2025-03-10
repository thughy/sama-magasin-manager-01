
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchasesHeader } from "@/components/suppliers/purchases/PurchasesHeader";
import { PurchasesFilters } from "@/components/suppliers/purchases/PurchasesFilters";
import { PurchasesTable } from "@/components/suppliers/payments/PurchasesTable";
import { DeletePurchaseDialog } from "@/components/suppliers/purchases/DeletePurchaseDialog";
import { PurchaseForm } from "@/components/suppliers/purchases/PurchaseForm";
import { PurchasesTotals } from "@/components/suppliers/purchases/PurchasesTotals";
import { PaymentHistoryDialog } from "@/components/suppliers/payments/PaymentHistoryDialog";
import { usePurchasesData } from "@/hooks/usePurchasesData";
import { useToast } from "@/hooks/use-toast";
import { Purchase } from "@/types/purchase";

const Purchases = () => {
  const { toast } = useToast();
  const {
    purchases,
    supplierSearchTerm,
    setSupplierSearchTerm,
    productSearchTerm,
    setProductSearchTerm,
    selectedDate,
    setSelectedDate,
    dateRange,
    setDateRange,
    selectedStatus,
    setSelectedStatus,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isPurchaseFormOpen,
    setIsPurchaseFormOpen,
    selectedPurchase,
    setSelectedPurchase,
    handleRefresh,
    handleAddPurchase,
    handleEditPurchase,
    handleDeletePurchase,
    confirmDeletePurchase,
    clearFilters
  } = usePurchasesData();

  // State for payment history dialog
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [historyPurchase, setHistoryPurchase] = useState<Purchase | null>(null);

  useEffect(() => {
    console.log("Purchases page mounted");
    
    return () => {
      console.log("Purchases page unmounting");
    };
  }, []);

  useEffect(() => {
    console.log("Purchase form state changed:", isPurchaseFormOpen);
  }, [isPurchaseFormOpen]);

  const handlePurchaseFormClose = () => {
    console.log("Closing purchase form");
    setIsPurchaseFormOpen(false);
    setSelectedPurchase(undefined);
  };

  const handleSavePurchase = (purchase: Purchase) => {
    console.log("Saving purchase");
    
    const purchasesStr = localStorage.getItem('purchases') || '[]';
    let allPurchases = JSON.parse(purchasesStr);
    
    if (selectedPurchase) {
      allPurchases = allPurchases.map((p: Purchase) => 
        p.id === purchase.id ? purchase : p
      );
      
      toast({
        title: "Achat mis à jour",
        description: `L'achat ${purchase.reference} a été mis à jour avec succès`,
      });
    } else {
      allPurchases = [purchase, ...allPurchases];
      
      toast({
        title: "Achat ajouté",
        description: `L'achat ${purchase.reference} a été ajouté avec succès`,
      });
    }
    
    localStorage.setItem('purchases', JSON.stringify(allPurchases));
    
    handleRefresh();
    
    handlePurchaseFormClose();
  };

  // Handle payment click (dummy function for now)
  const handlePaymentClick = (purchase: Purchase) => {
    console.log("Payment click for purchase:", purchase);
    // Here you would open a payment dialog or navigate to a payment page
    toast({
      title: "Action de paiement",
      description: `Paiement pour la facture ${purchase.reference}`,
    });
  };

  // Handle history click
  const handleHistoryClick = (purchase: Purchase) => {
    console.log("History click for purchase:", purchase);
    setHistoryPurchase(purchase);
    setIsHistoryDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <PurchasesHeader onRefresh={handleRefresh} onAddNew={handleAddPurchase} />

        <PurchasesTotals purchases={purchases} />

        <Card>
          <CardHeader>
            <CardTitle>Achats de marchandises</CardTitle>
            <CardDescription>
              Consultez et gérez tous vos achats de marchandises
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PurchasesFilters 
              supplierSearchTerm={supplierSearchTerm}
              setSupplierSearchTerm={setSupplierSearchTerm}
              productSearchTerm={productSearchTerm}
              setProductSearchTerm={setProductSearchTerm}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              dateRange={dateRange}
              setDateRange={setDateRange}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              onClearFilters={clearFilters}
            />

            <PurchasesTable 
              purchases={purchases} 
              onEditClick={handleEditPurchase}
              onPaymentClick={handlePaymentClick}
              onHistoryClick={handleHistoryClick}
            />
          </CardContent>
        </Card>
      </div>

      <DeletePurchaseDialog 
        purchase={selectedPurchase}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeletePurchase}
      />

      <PurchaseForm
        isOpen={isPurchaseFormOpen}
        onClose={handlePurchaseFormClose}
        initialPurchase={selectedPurchase}
        onSave={handleSavePurchase}
      />

      {historyPurchase && (
        <PaymentHistoryDialog
          open={isHistoryDialogOpen}
          onOpenChange={setIsHistoryDialogOpen}
          purchase={historyPurchase}
        />
      )}
    </MainLayout>
  );
};

export default Purchases;
