
import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Purchase } from "@/types/purchase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Edit, Wallet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PurchasesTableProps {
  purchases: Purchase[];
  onPaymentClick: (purchase: Purchase) => void;
  onEditClick?: (purchase: Purchase) => void;
  onHistoryClick: (purchase: Purchase) => void;
}

export const PurchasesTable: React.FC<PurchasesTableProps> = ({ 
  purchases, 
  onPaymentClick, 
  onEditClick, 
  onHistoryClick 
}) => {
  const [statusFilter, setStatusFilter] = useState<"all" | "payée" | "impayée">("all");
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR').format(date);
    } catch (error) {
      return dateString;
    }
  };
  
  // Filtrer les factures en fonction du statut sélectionné
  const filteredPurchases = statusFilter === "all" 
    ? purchases 
    : purchases.filter(purchase => purchase.status === statusFilter);
  
  return (
    <div>
      <div className="mb-4 flex items-center space-x-2 print:hidden">
        <Label htmlFor="status-filter" className="text-sm whitespace-nowrap">Filtrer par statut:</Label>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as "all" | "payée" | "impayée")}
        >
          <SelectTrigger id="status-filter" className="w-[180px]">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="payée">Payées</SelectItem>
            <SelectItem value="impayée">Impayées</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Référence</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payé</TableHead>
            <TableHead>Solde</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right print:hidden">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPurchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell className="font-medium">{purchase.reference}</TableCell>
              <TableCell>{formatDate(purchase.purchaseDate)}</TableCell>
              <TableCell>{purchase.totalAmount.toLocaleString()} F CFA</TableCell>
              <TableCell>{purchase.totalPaid.toLocaleString()} F CFA</TableCell>
              <TableCell className={purchase.status === 'impayée' ? 'font-medium text-red-500' : 'font-medium text-green-500'}>
                {purchase.balance.toLocaleString()} F CFA
              </TableCell>
              <TableCell>
                <Badge variant={purchase.status === 'payée' ? 'success' : 'destructive'} className="print:bg-transparent print:border print:border-current">
                  {purchase.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right print:hidden">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onHistoryClick(purchase)}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Historique
                  </Button>
                  
                  {onEditClick && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEditClick(purchase)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onPaymentClick(purchase)}
                    disabled={purchase.status === 'payée'}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Payer
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
