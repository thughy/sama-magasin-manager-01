
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { PurchaseOrder } from "@/types/purchaseOrder";
import { PurchaseOrderTableRow } from "./PurchaseOrderTableRow";
import { PurchaseOrderEmptyState } from "./PurchaseOrderEmptyState";

interface PurchaseOrderTableProps {
  orders: PurchaseOrder[];
  onView: (order: PurchaseOrder) => void;
  onDelete: (orderId: string) => void;
  onDuplicate: (order: PurchaseOrder) => void;
  onConvertClick: (order: PurchaseOrder) => void;
  hasFilters: boolean;
}

export const PurchaseOrderTable = ({
  orders,
  onView,
  onDelete,
  onDuplicate,
  onConvertClick,
  hasFilters
}: PurchaseOrderTableProps) => {
  if (orders.length === 0) {
    return <PurchaseOrderEmptyState hasFilters={hasFilters} />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Référence</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Fournisseur</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <PurchaseOrderTableRow
            key={order.id}
            order={order}
            onView={onView}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onConvertClick={onConvertClick}
          />
        ))}
      </TableBody>
    </Table>
  );
};
