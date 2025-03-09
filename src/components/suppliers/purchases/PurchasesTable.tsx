
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Purchase } from "@/types/purchase";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";

interface PurchasesTableProps {
  purchases: Purchase[];
  onEdit: (purchase: Purchase) => void;
  onDelete: (purchaseId: string) => void;
}

export const PurchasesTable = ({ purchases, onEdit, onDelete }: PurchasesTableProps) => {
  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-muted-foreground mb-2">Aucun achat trouvé</p>
        <p className="text-sm text-muted-foreground">
          Utilisez le bouton "Nouvel achat" pour ajouter un achat ou modifiez vos filtres.
        </p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Référence</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Fournisseur</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Versé</TableHead>
          <TableHead>Solde</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {purchases.map((purchase) => (
          <TableRow key={purchase.id}>
            <TableCell className="font-medium">{purchase.reference}</TableCell>
            <TableCell>{format(new Date(purchase.purchaseDate), 'dd MMM yyyy', { locale: fr })}</TableCell>
            <TableCell>{purchase.supplierName}</TableCell>
            <TableCell>{formatCurrency(purchase.totalAmount)}</TableCell>
            <TableCell>{formatCurrency(purchase.totalPaid || 0)}</TableCell>
            <TableCell>{formatCurrency(purchase.balance || (purchase.totalAmount - (purchase.totalPaid || 0)))}</TableCell>
            <TableCell>
              <Badge variant={purchase.status === 'payée' ? 'success' : 'destructive'}>
                {purchase.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(purchase)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(purchase.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
