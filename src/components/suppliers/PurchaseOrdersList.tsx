
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PurchaseOrder } from "@/types/purchaseOrder";
import { PurchaseOrderFilters } from "./PurchaseOrderFilters";
import { PurchaseOrderTable } from "./PurchaseOrderTable";
import { PurchaseOrderConvertDialog } from "./PurchaseOrderConvertDialog";
import { usePurchaseOrdersFilters } from "@/hooks/usePurchaseOrdersFilters";

interface PurchaseOrdersListProps {
  orders: PurchaseOrder[];
  onView: (order: PurchaseOrder) => void;
  onDelete: (orderId: string) => void;
  onDuplicate: (order: PurchaseOrder) => void;
  onConvertToPurchase: (orderId: string) => void;
}

export const PurchaseOrdersList = ({ 
  orders, 
  onView, 
  onDelete,
  onDuplicate,
  onConvertToPurchase
}: PurchaseOrdersListProps) => {
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  
  const {
    searchTerm,
    setSearchTerm,
    selectedDate,
    setSelectedDate,
    selectedStatus,
    setSelectedStatus,
    filteredOrders,
    hasActiveFilters
  } = usePurchaseOrdersFilters({ orders });

  const handleConvertClick = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setIsPrintDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Bons de Commande Récents</CardTitle>
          <CardDescription>
            Visualisez et gérez les bons de commande récemment créés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PurchaseOrderFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />

          <PurchaseOrderTable 
            orders={filteredOrders}
            onView={onView}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onConvertClick={handleConvertClick}
            hasFilters={hasActiveFilters}
          />
        </CardContent>
      </Card>
      
      <PurchaseOrderConvertDialog
        open={isPrintDialogOpen}
        onOpenChange={setIsPrintDialogOpen}
        selectedOrder={selectedOrder}
        onConvertToPurchase={onConvertToPurchase}
      />
    </>
  );
};
