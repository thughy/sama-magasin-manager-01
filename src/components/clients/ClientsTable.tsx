
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Edit, Trash, FileText, CreditCard } from "lucide-react";

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: string;
  balance: number;
  lastPurchase: string;
}

interface ClientsTableProps {
  clients: Client[];
}

export const ClientsTable = ({ clients }: ClientsTableProps) => {
  return (
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
          {clients.length > 0 ? (
            clients.map((client) => (
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
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Aucun client trouvé.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
