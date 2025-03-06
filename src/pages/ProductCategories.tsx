
import React from "react";
import { Tags, Plus, Search } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProductCategories() {
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catégories de produits</h1>
          <p className="text-muted-foreground">
            Créez et gérez les catégories pour vos produits et services
          </p>
        </div>
        <Button className="bg-sama-600 hover:bg-sama-700">
          <Plus size={16} className="mr-2" />
          Nouvelle catégorie
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Liste des catégories</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Rechercher une catégorie..."
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Aucune catégorie n'a été créée. Commencez par en créer une.
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
