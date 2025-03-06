
import React, { useState } from "react";
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
import { 
  Plus, 
  Filter, 
  Eye, 
  Printer, 
  Calendar, 
  Search,
  Warehouse
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Données de démonstration pour les bons de sortie
const releaseMockData = [
  { 
    id: "BS-001", 
    date: "2023-05-10", 
    depot: "Dépôt Central", 
    requestedBy: "Service Livraison", 
    status: "Validé", 
    items: 12 
  },
  { 
    id: "BS-002", 
    date: "2023-05-15", 
    depot: "Dépôt Nord", 
    requestedBy: "Service Commercial", 
    status: "En attente", 
    items: 5 
  },
  { 
    id: "BS-003", 
    date: "2023-05-20", 
    depot: "Dépôt Sud", 
    requestedBy: "Service Technique", 
    status: "Validé", 
    items: 8 
  },
];

export default function DepotReleaseOrders() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bons de Sortie de Dépôt</h1>
          <p className="text-muted-foreground">
            Gérez les mouvements de stock en sortie de vos dépôts
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Nouveau bon de sortie
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-sama-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Bons de sortie ce mois</p>
              <p className="text-3xl font-bold text-sama-700">25</p>
            </div>
            <div className="bg-sama-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">En attente de validation</p>
              <p className="text-3xl font-bold text-orange-600">5</p>
            </div>
            <div className="bg-sama-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Articles sortis ce mois</p>
              <p className="text-3xl font-bold text-sama-700">152</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Liste des Bons de Sortie</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-8 w-full sm:w-[250px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="validated">Validés</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mb-4">
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="validated">Validés</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
            </TabsList>
          </Tabs>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Bon</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Dépôt</TableHead>
                <TableHead>Demandeur</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {releaseMockData.map((release) => (
                <TableRow key={release.id}>
                  <TableCell className="font-medium">{release.id}</TableCell>
                  <TableCell>{release.date}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    <Warehouse size={16} />
                    {release.depot}
                  </TableCell>
                  <TableCell>{release.requestedBy}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      release.status === 'Validé' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {release.status}
                    </span>
                  </TableCell>
                  <TableCell>{release.items}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon">
                        <Eye size={16} />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Printer size={16} />
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
