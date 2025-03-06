
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DepotInventory() {
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventaire des Dépôts</h1>
          <p className="text-muted-foreground">
            Consultez et gérez les stocks dans vos dépôts
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Gestion de l'inventaire</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contenu de l'inventaire à venir</p>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
