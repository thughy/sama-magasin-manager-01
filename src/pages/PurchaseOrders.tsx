
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PurchaseOrderForm } from "@/components/suppliers/PurchaseOrderForm";
import { PurchaseOrdersList } from "@/components/suppliers/PurchaseOrdersList";
import { PurchaseOrdersHeader } from "@/components/suppliers/PurchaseOrdersHeader";
import { usePurchaseOrdersData } from "@/hooks/usePurchaseOrdersData";

const PurchaseOrders = () => {
  const {
    orders,
    isFormOpen,
    selectedOrder,
    handleOpenForm,
    handleSaveOrder,
    handleViewOrder,
    handleDeleteOrder,
    handleDuplicateOrder,
    handleConvertToPurchase,
    setIsFormOpen
  } = usePurchaseOrdersData();

  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <PurchaseOrdersHeader onCreateNewOrder={handleOpenForm} />

        <PurchaseOrdersList 
          orders={orders} 
          onView={handleViewOrder}
          onDelete={handleDeleteOrder}
          onDuplicate={handleDuplicateOrder}
          onConvertToPurchase={handleConvertToPurchase}
        />
      </div>

      {isFormOpen && (
        <PurchaseOrderForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          initialOrder={selectedOrder}
          onSave={handleSaveOrder}
        />
      )}
    </MainLayout>
  );
};

export default PurchaseOrders;
