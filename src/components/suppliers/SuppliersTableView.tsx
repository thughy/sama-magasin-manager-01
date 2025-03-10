
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileEdit, Trash2, Eye, FileText, CreditCard } from "lucide-react";
import { Supplier } from "@/data/suppliersData";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface SuppliersTableViewProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onOpenPurchaseOrder: (supplier: Supplier) => void;
}

export const SuppliersTableView = ({ 
  suppliers, 
  onEdit, 
  onOpenPurchaseOrder 
}: SuppliersTableViewProps) => {
  const navigate = useNavigate();

  const handleAccessAccount = (supplier: Supplier) => {
    // Store the selected supplier ID in localStorage to pre-select it on the payments page
    localStorage.setItem("selectedSupplierId", supplier.id.toString());
    navigate("/suppliers/payments");
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Total Facture (FCFA)</TableHead>
          <TableHead className="text-right">Total Versé (FCFA)</TableHead>
          <TableHead className="text-right">Solde (FCFA)</TableHead>
          <TableHead className="text-center">Statut</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.length > 0 ? (
          suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell className="font-medium">{supplier.name}</TableCell>
              <TableCell>{supplier.contact}</TableCell>
              <TableCell>{supplier.phone}</TableCell>
              <TableCell>{supplier.email}</TableCell>
              <TableCell className="text-right font-medium">
                {supplier.totalInvoice.toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-medium">
                {supplier.totalPaid.toLocaleString()}
              </TableCell>
              <TableCell className={`text-right font-medium ${supplier.balance < 0 ? 'text-red-500' : supplier.balance > 0 ? 'text-amber-600' : 'text-green-500'}`}>
                {supplier.balance.toLocaleString()}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={supplier.status === 'payée' ? 'success' : 'destructive'}>
                  {supplier.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4 text-sama-500" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEdit(supplier)}
                  >
                    <FileEdit className="h-4 w-4 text-amber-500" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onOpenPurchaseOrder(supplier)}
                  >
                    <FileText className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleAccessAccount(supplier)}
                    title="Voir le compte"
                  >
                    <CreditCard className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-6">
              Aucun fournisseur trouvé pour cette recherche
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
