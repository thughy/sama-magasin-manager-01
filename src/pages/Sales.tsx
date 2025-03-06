
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { SalesHeader } from "@/components/sales/SalesHeader";
import { SalesStats } from "@/components/sales/SalesStats";
import { SalesFilters } from "@/components/sales/SalesFilters";
import { SalesTable } from "@/components/sales/SalesTable";
import { salesData } from "@/data/salesData";

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

  // Sales statistics
  const totalSales = salesData.reduce((sum, sale) => sum + (sale.status !== "cancelled" ? sale.amount : 0), 0);
  const completedSales = salesData.filter(sale => sale.status === "completed").length;
  const pendingSales = salesData.filter(sale => sale.status === "pending").length;
  
  const filteredSales = salesData.filter(sale => {
    const matchesSearch = 
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus ? sale.status === selectedStatus : true;
    const matchesPaymentMethod = selectedPaymentMethod ? sale.paymentMethod === selectedPaymentMethod : true;
    
    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <SalesHeader />

        {/* Sales summary cards */}
        <SalesStats 
          totalSales={totalSales} 
          completedSales={completedSales} 
          totalSalesCount={salesData.length}
          pendingSales={pendingSales} 
        />

        <Card className="p-5">
          <SalesFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
          />

          <SalesTable sales={filteredSales} />
        </Card>
      </div>
    </MainLayout>
  );
};

export default Sales;
