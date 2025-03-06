
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { suppliersData } from "@/data/suppliersData";
import { PurchaseOrderForm } from "@/components/suppliers/PurchaseOrderForm";

const PurchaseOrders = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bons de Commande</h1>
            <p className="text-muted-foreground">
              Créez et gérez vos bons de commande pour les fournisseurs
            </p>
          </div>
          <Button onClick={handleOpenForm}>
            <Plus className="mr-2 h-4 w-4" /> Nouveau Bon de Commande
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bons de Commande Récents</CardTitle>
            <CardDescription>
              Visualisez et gérez les bons de commande récemment créés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium">Aucun bon de commande</h3>
              <p className="mt-1 text-gray-500">
                Commencez par créer un nouveau bon de commande pour un fournisseur
              </p>
              <Button onClick={handleOpenForm} className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Créer un Bon de Commande
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {isFormOpen && (
        <PurchaseOrderForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </MainLayout>
  );
};

export default PurchaseOrders;
