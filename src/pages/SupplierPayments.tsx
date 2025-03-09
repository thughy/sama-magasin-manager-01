
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SupplierPayments = () => {
  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Paiement Fournisseur</h1>
          <p className="text-muted-foreground">
            Gérez tous les paiements effectués à vos fournisseurs
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Paiements aux fournisseurs</CardTitle>
            <CardDescription>
              Consultez et enregistrez les paiements effectués à vos fournisseurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              Cette fonctionnalité sera bientôt disponible
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SupplierPayments;
