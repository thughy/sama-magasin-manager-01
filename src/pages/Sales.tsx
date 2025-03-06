
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, MoreHorizontal, FileText, ShoppingCart, Download, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample sales data
const salesData = [
  {
    id: "VNT001",
    date: "2023-06-15",
    customer: "Client Régulier",
    paymentMethod: "Espèces",
    amount: 35000,
    status: "completed",
  },
  {
    id: "VNT002",
    date: "2023-06-14",
    customer: "Entreprise ABC",
    paymentMethod: "Virement",
    amount: 120000,
    status: "completed",
  },
  {
    id: "VNT003",
    date: "2023-06-12",
    customer: "Walk-in Customer",
    paymentMethod: "Mobile Money",
    amount: 8500,
    status: "completed",
  },
  {
    id: "VNT004",
    date: "2023-06-10",
    customer: "Société XYZ",
    paymentMethod: "Carte bancaire",
    amount: 65000,
    status: "cancelled",
  },
  {
    id: "VNT005",
    date: "2023-06-08",
    customer: "Client Premium",
    paymentMethod: "Crédit",
    amount: 95000,
    status: "pending",
  },
];

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

  // Sales statistics
  const totalSales = salesData.reduce((sum, sale) => sum + (sale.status !== "cancelled" ? sale.amount : 0), 0);
  const completedSales = salesData.filter(sale => sale.status === "completed").length;
  const pendingSales = salesData.filter(sale => sale.status === "pending").length;
  
  const filteredSales = salesData.filter(sale => {
    const matchesSearch = 
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus ? sale.status === selectedStatus : true;
    const matchesPaymentMethod = selectedPaymentMethod ? sale.paymentMethod === selectedPaymentMethod : true;
    
    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ventes</h1>
            <p className="text-muted-foreground mt-1">
              Consultez et gérez vos ventes
            </p>
          </div>
          <Button className="bg-sama-600 hover:bg-sama-700">
            <ShoppingCart size={16} className="mr-2" />
            Nouvelle vente
          </Button>
        </div>

        {/* Sales summary cards */}
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
                  {((completedSales / salesData.length) * 100).toFixed(0)}%
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

        <Card className="p-5">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Rechercher par numéro de vente, client..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="completed">Complétée</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Mode de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les modes</SelectItem>
                  <SelectItem value="Espèces">Espèces</SelectItem>
                  <SelectItem value="Carte bancaire">Carte bancaire</SelectItem>
                  <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                  <SelectItem value="Virement">Virement</SelectItem>
                  <SelectItem value="Crédit">Crédit</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter size={18} />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Vente</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="hidden md:table-cell">Client</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead className="hidden md:table-cell">Mode de paiement</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      <div className="font-medium">{sale.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarIcon size={14} className="mr-2 text-muted-foreground" />
                        {formatDate(sale.date)}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {sale.customer}
                    </TableCell>
                    <TableCell className="font-medium">
                      {sale.amount.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {sale.paymentMethod}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          sale.status === "completed" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                          sale.status === "pending" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" :
                          "bg-red-100 text-red-800 hover:bg-red-100"
                        )}
                      >
                        {sale.status === "completed" ? "Complétée" :
                         sale.status === "pending" ? "En attente" : "Annulée"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <FileText size={14} className="mr-2" /> Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download size={14} className="mr-2" /> Télécharger la facture
                          </DropdownMenuItem>
                          {sale.status === "pending" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-green-600">
                                <ShoppingCart size={14} className="mr-2" /> Finaliser la vente
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSales.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Aucune vente trouvée.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Sales;
