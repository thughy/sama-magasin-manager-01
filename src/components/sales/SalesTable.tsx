
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { MoreHorizontal, FileText, ShoppingCart, Download, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SaleItem {
  id: string;
  date: string;
  customer: string;
  paymentMethod: string;
  amount: number;
  status: string;
}

interface SalesTableProps {
  sales: SaleItem[];
}

export const SalesTable = ({ sales }: SalesTableProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  return (
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
          {sales.length > 0 ? (
            sales.map((sale) => (
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
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Aucune vente trouvée.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
