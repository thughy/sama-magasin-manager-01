
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, RefreshCw, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const ClientInvoicing = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simuler un chargement
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Liste actualisée",
        description: "La liste des factures a été actualisée",
      });
    }, 500);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Facturation</h1>
            <p className="text-muted-foreground mt-1">
              Gérez les factures clients et suivez les paiements
            </p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1" />
              )}
              Actualiser
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Nouvelle facture
            </Button>
          </div>
        </div>

        {/* Content */}
        <Card className="p-5">
          <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8 gap-4">
            <Receipt className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Module de facturation</h3>
            <p className="text-muted-foreground max-w-md">
              Ce module vous permet de créer et gérer les factures clients, de suivre les paiements et de générer des rapports.
            </p>
            <Button className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Créer une facture
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ClientInvoicing;
