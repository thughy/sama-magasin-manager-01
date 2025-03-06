
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchasesHeader } from "@/components/suppliers/purchases/PurchasesHeader";
import { PurchasesFilters } from "@/components/suppliers/purchases/PurchasesFilters";
import { PurchasesTable } from "@/components/suppliers/purchases/PurchasesTable";
import { DeletePurchaseDialog } from "@/components/suppliers/purchases/DeletePurchaseDialog";
import { usePurchasesData } from "@/hooks/usePurchasesData";

const Purchases = () => {
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
    selectedPurchase,
    handleRefresh,
    handleAddPurchase,
    handleEditPurchase,
    handleDeletePurchase,
    confirmDeletePurchase,
    clearFilters
  } = usePurchasesData();

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
    </MainLayout>
  );
};

export default Purchases;
