
import { useState } from "react";
import { Users, Plus, Search, Filter, MoreHorizontal, Edit, Trash, FileText, CreditCard } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

// Données fictives pour les clients
const clients = [
  {
    id: "CLI001",
    name: "Ibrahim Diallo",
    phone: "77 123 45 67",
    email: "ibrahim@example.com",
    type: "Régulier",
    balance: 75000,
    lastPurchase: "12/05/2023",
  },
  {
    id: "CLI002",
    name: "Fatou Diop",
    phone: "78 234 56 78",
    email: "fatou@example.com",
    type: "VIP",
    balance: 0,
    lastPurchase: "20/06/2023",
  },
  {
    id: "CLI003",
    name: "Mamadou Sow",
    phone: "76 345 67 89",
    email: "mamadou@example.com",
    type: "Occasionnel",
    balance: 12500,
    lastPurchase: "05/07/2023",
  },
  {
    id: "CLI004",
    name: "Aissatou Bah",
    phone: "70 456 78 90",
    email: "aissatou@example.com",
    type: "Régulier",
    balance: 35000,
    lastPurchase: "18/07/2023",
  },
  {
    id: "CLI005",
    name: "Ousmane Kane",
    phone: "75 567 89 01",
    email: "ousmane@example.com",
    type: "VIP",
    balance: 150000,
    lastPurchase: "02/08/2023",
  },
];

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType ? client.type === selectedType : true;
    
    return matchesSearch && matchesType;
  });

  const types = [...new Set(clients.map(client => client.type))];

  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
            <p className="text-muted-foreground mt-1">
              Gérez votre base de clients
            </p>
          </div>
          <Button className="bg-sama-600 hover:bg-sama-700">
            <Plus size={16} className="mr-2" />
            Nouveau client
          </Button>
        </div>

        <Card className="p-5">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Rechercher par nom, téléphone, email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
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
                  <TableHead>Client</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Solde</TableHead>
                  <TableHead className="hidden md:table-cell">Dernier achat</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {client.id}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>{client.phone}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {client.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={cn(
                          client.type === "VIP" ? "text-purple-600 border-purple-200 bg-purple-50" :
                          client.type === "Régulier" ? "text-blue-600 border-blue-200 bg-blue-50" :
                          "text-gray-600 border-gray-200 bg-gray-50"
                        )}
                      >
                        {client.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <div 
                        className={cn(
                          client.balance > 0 ? "text-red-600" : "text-green-600"
                        )}
                      >
                        {client.balance > 0 ? "-" : ""}{client.balance.toLocaleString()} FCFA
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.lastPurchase}
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
                            <Edit size={14} className="mr-2" /> Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText size={14} className="mr-2" /> Factures
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard size={14} className="mr-2" /> Versement
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash size={14} className="mr-2" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredClients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Aucun client trouvé.
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

export default Clients;
