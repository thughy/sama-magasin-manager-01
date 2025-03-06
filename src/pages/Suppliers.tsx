
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, FileEdit, Trash2, Eye } from "lucide-react";

const suppliersData = [
  {
    id: 1,
    name: "Électronique Express",
    contact: "Amadou Diop",
    phone: "+221 77 123 45 67",
    email: "contact@electronique-express.sn",
    balance: 350000
  },
  {
    id: 2,
    name: "Global Import SARL",
    contact: "Fatou Ndiaye",
    phone: "+221 76 234 56 78",
    email: "info@globalimport.sn",
    balance: 125000
  },
  {
    id: 3,
    name: "Tech Solutions",
    contact: "Ibrahim Sow",
    phone: "+221 70 345 67 89",
    email: "contact@techsolutions.sn",
    balance: 0
  },
  {
    id: 4,
    name: "Accessoires Plus",
    contact: "Marie Diallo",
    phone: "+221 78 456 78 90",
    email: "ventes@accessoiresplus.sn",
    balance: 75000
  },
  {
    id: 5,
    name: "Dakar Digital",
    contact: "Jean Mendy",
    phone: "+221 77 567 89 01",
    email: "info@dakardigital.sn",
    balance: -45000
  }
];

const Suppliers = () => {
  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fournisseurs</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos fournisseurs et suivez leurs comptes
            </p>
          </div>
          <Button className="bg-sama-500 hover:bg-sama-600">
            <Plus className="mr-2 h-4 w-4" /> Nouveau fournisseur
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des fournisseurs</CardTitle>
            <CardDescription>
              Vue d'ensemble de tous vos fournisseurs et de leurs situations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Solde (FCFA)</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliersData.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contact}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell className={`text-right font-medium ${supplier.balance < 0 ? 'text-red-500' : supplier.balance > 0 ? 'text-amber-600' : 'text-green-500'}`}>
                      {supplier.balance.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4 text-sama-500" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <FileEdit className="h-4 w-4 text-amber-500" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Commandes en cours</CardTitle>
              <CardDescription>Commandes en attente de livraison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
              <p className="text-muted-foreground mt-1">Valeur totale: 780 000 FCFA</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Paiements du mois</CardTitle>
              <CardDescription>Total des paiements effectués ce mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">420 000 FCFA</div>
              <p className="text-muted-foreground mt-1">5 paiements effectués</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Dettes fournisseurs</CardTitle>
              <CardDescription>Total des soldes dus aux fournisseurs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">550 000 FCFA</div>
              <p className="text-muted-foreground mt-1">Répartis sur 3 fournisseurs</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Suppliers;
