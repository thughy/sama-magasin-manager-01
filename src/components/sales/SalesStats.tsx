
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SalesStatsProps {
  totalSales: number;
  completedSales: number;
  totalSalesCount: number;
  pendingSales: number;
}

export const SalesStats = ({ 
  totalSales, 
  completedSales, 
  totalSalesCount,
  pendingSales 
}: SalesStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Ventes totales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSales.toLocaleString()} FCFA</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Ventes complétées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="text-2xl font-bold">{completedSales}</div>
            <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
              {((completedSales / totalSalesCount) * 100).toFixed(0)}%
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Ventes en attente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="text-2xl font-bold">{pendingSales}</div>
            {pendingSales > 0 && (
              <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                À traiter
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
