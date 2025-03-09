
import React from "react";
import { SupplierInfo } from "./SupplierInfo";
import { PurchaseList } from "./PurchaseList";
import { Supplier } from "@/data/suppliersData";
import { Purchase } from "@/types/purchase";

interface SupplierContentProps {
  supplier: Supplier;
  purchases: Purchase[];
  onPaymentClick: (purchase: Purchase) => void;
  onEditClick: (purchase: Purchase) => void;
  onViewHistory: (purchase: Purchase) => void;
}

export const SupplierContent: React.FC<SupplierContentProps> = ({
  supplier,
  purchases,
  onPaymentClick,
  onEditClick,
  onViewHistory
}) => {
  return (
    <div className="space-y-6">
      <SupplierInfo supplier={supplier} />
      <PurchaseList 
        purchases={purchases || []}
        onPaymentClick={onPaymentClick}
        onEditClick={onEditClick}
        onViewHistory={onViewHistory}
        supplier={supplier}
      />
    </div>
  );
};
