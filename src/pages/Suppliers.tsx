
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SuppliersHeader } from "@/components/suppliers/SuppliersHeader";
import { SuppliersTable } from "@/components/suppliers/SuppliersTable";
import { SuppliersStats } from "@/components/suppliers/SuppliersStats";
import { suppliersData as initialSuppliersData, suppliersStats } from "@/data/suppliersData";
import { Supplier } from "@/data/suppliersData";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliersData);

  const handleAddSupplier = (newSupplier: Supplier) => {
    setSuppliers(prevSuppliers => [...prevSuppliers, newSupplier]);
  };

  const handleUpdateSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(prevSuppliers => 
      prevSuppliers.map(supplier => 
        supplier.id === updatedSupplier.id ? updatedSupplier : supplier
      )
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <SuppliersHeader onAddSupplier={handleAddSupplier} lastSupplierId={suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id)) : 0} />

        <Card>
          <CardHeader>
            <CardTitle>Liste des fournisseurs</CardTitle>
            <CardDescription>
              Vue d'ensemble de tous vos fournisseurs et de leurs situations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SuppliersTable 
              suppliers={suppliers} 
              onUpdateSupplier={handleUpdateSupplier}
            />
          </CardContent>
        </Card>

        <SuppliersStats 
          pendingOrdersCount={suppliersStats.pendingOrdersCount}
          pendingOrdersValue={suppliersStats.pendingOrdersValue}
          monthlyPaymentsTotal={suppliersStats.monthlyPaymentsTotal}
          monthlyPaymentsCount={suppliersStats.monthlyPaymentsCount}
          totalDebt={suppliersStats.totalDebt}
          suppliersWithDebtCount={suppliersStats.suppliersWithDebtCount}
        />
      </div>
    </MainLayout>
  );
};

export default Suppliers;
