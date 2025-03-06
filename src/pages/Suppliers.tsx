
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SuppliersHeader } from "@/components/suppliers/SuppliersHeader";
import { SuppliersTable } from "@/components/suppliers/SuppliersTable";
import { SuppliersStats } from "@/components/suppliers/SuppliersStats";
import { suppliersData, suppliersStats } from "@/data/suppliersData";

const Suppliers = () => {
  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <SuppliersHeader />

        <Card>
          <CardHeader>
            <CardTitle>Liste des fournisseurs</CardTitle>
            <CardDescription>
              Vue d'ensemble de tous vos fournisseurs et de leurs situations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SuppliersTable suppliers={suppliersData} />
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
