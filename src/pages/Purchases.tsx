import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchasesHeader } from "@/components/suppliers/purchases/PurchasesHeader";
import { PurchasesFilters } from "@/components/suppliers/purchases/PurchasesFilters";
import { PurchasesTable } from "@/components/suppliers/purchases/PurchasesTable";
import { DeletePurchaseDialog } from "@/components/suppliers/purchases/DeletePurchaseDialog";
import { PurchaseForm } from "@/components/suppliers/purchases/PurchaseForm";
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
    handleRefresh,
    handleAddPurchase,
    handleEditPurchase,
    handleDeletePurchase,
    confirmDeletePurchase,
    clearFilters
  } = usePurchasesData();

  // Handle closing the purchase form
  const handlePurchaseFormClose = () => {
    console.log("Closing purchase form from parent");
    setIsPurchaseFormOpen(false);
  };

  // Custom save handler that keeps the form open
  const handleSavePurchase = (purchase: Purchase) => {
    // Get the current list of purchases from local storage or initialize empty
    const purchasesStr = localStorage.getItem('purchases') || '[]';
    let allPurchases = JSON.parse(purchasesStr);
    
    if (selectedPurchase) {
      // Update existing purchase
      allPurchases = allPurchases.map((p: Purchase) => 
        p.id === purchase.id ? purchase : p
      );
      
      toast({
        title: "Achat mis à jour",
        description: `L'achat ${purchase.reference} a été mis à jour avec succès`,
      });
    } else {
      // Add new purchase
      allPurchases = [purchase, ...allPurchases];
      
      toast({
        title: "Achat ajouté",
        description: `L'achat ${purchase.reference} a été ajouté avec succès`,
      });
    }
    
    // Save to local storage
    localStorage.setItem('purchases', JSON.stringify(allPurchases));
    
    // Trigger refresh without closing the form
    handleRefresh();
    
    // Note: We're NOT closing the form here
    // This is important: DO NOT set isPurchaseFormOpen to false
    
    if (selectedPurchase) {
      // Only reset selected purchase if we were editing
      setSelectedPurchase(undefined);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <PurchasesHeader onRefresh={handleRefresh} onAddNew={handleAddPurchase} />

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

      {isPurchaseFormOpen && (
        <PurchaseForm
          isOpen={isPurchaseFormOpen}
          onClose={handlePurchaseFormClose}
          initialPurchase={selectedPurchase}
          onSave={handleSavePurchase}
        />
      )}
    </MainLayout>
  );
};

export default Purchases;
