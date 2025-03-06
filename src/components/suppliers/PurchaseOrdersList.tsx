
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Trash2, Copy } from "lucide-react";
import { PurchaseOrder } from "@/types/purchaseOrder";

interface PurchaseOrdersListProps {
  orders: PurchaseOrder[];
  onView: (order: PurchaseOrder) => void;
  onDelete: (orderId: string) => void;
  onDuplicate: (order: PurchaseOrder) => void;
}

export const PurchaseOrdersList = ({ 
  orders, 
  onView, 
  onDelete,
  onDuplicate
}: PurchaseOrdersListProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bons de Commande Récents</CardTitle>
        <CardDescription>
          Visualisez et gérez les bons de commande récemment créés
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Fournisseur</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.reference}</TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>{order.supplierName}</TableCell>
                  <TableCell>{order.total.toLocaleString()} F CFA</TableCell>
                  <TableCell>
                    <Badge variant={
                      order.status === 'delivered' ? 'success' :
                      order.status === 'cancelled' ? 'destructive' : 
                      'outline'
                    }>
                      {order.status === 'pending' ? 'En attente' :
                       order.status === 'delivered' ? 'Livré' : 'Annulé'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onView(order)}
                      >
                        <Eye className="h-4 w-4 text-same-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDuplicate(order)}
                      >
                        <Copy className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDelete(order.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium">Aucun bon de commande</h3>
            <p className="mt-1 text-gray-500">
              Commencez par créer un nouveau bon de commande pour un fournisseur
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
