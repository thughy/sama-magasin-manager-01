import { useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchasesHeader } from "@/components/suppliers/purchases/PurchasesHeader";
import { PurchasesFilters } from "@/components/suppliers/purchases/PurchasesFilters";
import { PurchasesTable } from "@/components/suppliers/purchases/PurchasesTable";
import { DeletePurchaseDialog } from "@/components/suppliers/purchases/DeletePurchaseDialog";
import { PurchaseForm } from "@/components/suppliers/purchases/PurchaseForm";
import { PurchasesTotals } from "@/components/suppliers/purchases/PurchasesTotals";
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
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              onClearFilters={clearFilters}
            />

            <PurchasesTable 
              purchases={purchases} 
              onEdit={handleEditPurchase}
              onDelete={handleDeletePurchase}
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
    </MainLayout>
  );
};

export default Purchases;
