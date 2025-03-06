
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Copy, FileCheck } from "lucide-react";
import { PurchaseOrder } from "@/types/purchaseOrder";

interface PurchaseOrderTableRowProps {
  order: PurchaseOrder;
  onView: (order: PurchaseOrder) => void;
  onDelete: (orderId: string) => void;
  onDuplicate: (order: PurchaseOrder) => void;
  onConvertClick: (order: PurchaseOrder) => void;
}

export const PurchaseOrderTableRow = ({
  order,
  onView,
  onDelete,
  onDuplicate,
  onConvertClick
}: PurchaseOrderTableRowProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  return (
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
          {order.status === 'pending' && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onConvertClick(order)}
            >
              <FileCheck className="h-4 w-4 text-green-500" />
            </Button>
          )}
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
  );
};
