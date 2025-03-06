
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Données de démonstration pour les dépôts
const depotsMockData = [
  { id: 1, name: "Dépôt Central", location: "Zone Industrielle", manager: "Jean Dupont", capacity: "1500 m²" },
  { id: 2, name: "Dépôt Nord", location: "Quartier Nord", manager: "Marie Durand", capacity: "800 m²" },
  { id: 3, name: "Dépôt Sud", location: "Quartier Sud", manager: "Paul Martin", capacity: "1200 m²" },
];

export default function Depots() {
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Dépôts</h1>
          <p className="text-muted-foreground">
            Consultez et gérez tous vos dépôts de stockage
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Ajouter un dépôt
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Statistiques des Dépôts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-sama-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Nombre total de dépôts</p>
              <p className="text-3xl font-bold text-sama-700">{depotsMockData.length}</p>
            </div>
            <div className="bg-sama-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Capacité totale</p>
              <p className="text-3xl font-bold text-sama-700">3500 m²</p>
            </div>
            <div className="bg-sama-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Taux d'occupation</p>
              <p className="text-3xl font-bold text-sama-700">65%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Liste des Dépôts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Emplacement</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Capacité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {depotsMockData.map((depot) => (
                <TableRow key={depot.id}>
                  <TableCell className="font-medium">{depot.name}</TableCell>
                  <TableCell>{depot.location}</TableCell>
                  <TableCell>{depot.manager}</TableCell>
                  <TableCell>{depot.capacity}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon">
                        <Edit size={16} />
                      </Button>
                      <Button variant="outline" size="icon" className="text-destructive">
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
