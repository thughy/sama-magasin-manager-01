
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface SuppliersStatsProps {
  pendingOrdersCount: number;
  pendingOrdersValue: number;
  monthlyPaymentsTotal: number;
  monthlyPaymentsCount: number;
  totalDebt: number;
  suppliersWithDebtCount: number;
}

export const SuppliersStats = ({
  pendingOrdersCount,
  pendingOrdersValue,
  monthlyPaymentsTotal,
  monthlyPaymentsCount,
  totalDebt,
  suppliersWithDebtCount
}: SuppliersStatsProps) => {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Commandes en cours</CardTitle>
          <CardDescription>Commandes en attente de livraison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{pendingOrdersCount}</div>
          <p className="text-muted-foreground mt-1">Valeur totale: {pendingOrdersValue.toLocaleString()} FCFA</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Paiements du mois</CardTitle>
          <CardDescription>Total des paiements effectués ce mois</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{monthlyPaymentsTotal.toLocaleString()} FCFA</div>
          <p className="text-muted-foreground mt-1">{monthlyPaymentsCount} paiements effectués</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Dettes fournisseurs</CardTitle>
          <CardDescription>Total des soldes dus aux fournisseurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-600">{totalDebt.toLocaleString()} FCFA</div>
          <p className="text-muted-foreground mt-1">Répartis sur {suppliersWithDebtCount} fournisseurs</p>
        </CardContent>
      </Card>
    </div>
  );
};
