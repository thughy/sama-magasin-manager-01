
import React from "react";
import { SupplierInfo } from "./SupplierInfo";
import { PurchaseList } from "./PurchaseList";
import { Supplier } from "@/data/suppliersData";
import { Purchase } from "@/types/purchase";

interface SupplierContentProps {
  supplier: Supplier;
  purchases: Purchase[] | null | undefined;
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
  // Ensure purchases is always a valid array even if null or undefined is passed
  const safePurchases = Array.isArray(purchases) ? purchases : [];
  
  return (
    <div className="space-y-6">
      <SupplierInfo supplier={supplier} />
      <PurchaseList 
        purchases={safePurchases}
        onPaymentClick={onPaymentClick}
        onEditClick={onEditClick}
        onHistoryClick={onViewHistory}
        supplier={supplier}
      />
    </div>
  );
};
