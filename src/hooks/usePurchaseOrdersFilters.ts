
import { useState, useMemo } from "react";
import { PurchaseOrder } from "@/types/purchaseOrder";
import { isSameDay } from "date-fns";

interface UsePurchaseOrdersFiltersProps {
  orders: PurchaseOrder[];
}

export const usePurchaseOrdersFilters = ({ orders }: UsePurchaseOrdersFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = searchTerm === "" || 
        order.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = !selectedDate || 
        isSameDay(new Date(order.orderDate), selectedDate);
      
      const matchesStatus = selectedStatus === "" || selectedStatus === "all" || 
        order.status === selectedStatus;
      
      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [orders, searchTerm, selectedDate, selectedStatus]);

  const hasActiveFilters = searchTerm !== "" || selectedDate !== undefined || (selectedStatus !== "" && selectedStatus !== "all");

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDate(undefined);
    setSelectedStatus("");
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedDate,
    setSelectedDate,
    selectedStatus,
    setSelectedStatus,
    filteredOrders,
    hasActiveFilters,
    clearFilters
  };
};
