
import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Trash2, Copy, FileCheck } from "lucide-react";
import { PurchaseOrder } from "@/types/purchaseOrder";
import { PrintablePurchaseOrder } from "./PrintablePurchaseOrder";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PurchaseOrderFilters } from "./PurchaseOrderFilters";
import { isSameDay } from "date-fns";

interface PurchaseOrdersListProps {
  orders: PurchaseOrder[];
  onView: (order: PurchaseOrder) => void;
  onDelete: (orderId: string) => void;
  onDuplicate: (order: PurchaseOrder) => void;
  onConvertToPurchase: (orderId: string) => void;
}

export const PurchaseOrdersList = ({ 
  orders, 
  onView, 
  onDelete,
  onDuplicate,
  onConvertToPurchase
}: PurchaseOrdersListProps) => {
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState("");
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  const handleConvertClick = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setIsPrintDialogOpen(true);
  };

  const handleConfirmConvert = (orderId: string) => {
    onConvertToPurchase(orderId);
    setIsPrintDialogOpen(false);
  };

  // Filter orders based on search term, selected date, and status
  const filteredOrders = orders.filter(order => {
    // Filter by supplier name
    const matchesSearch = searchTerm === "" || 
      order.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by date
    const matchesDate = !selectedDate || 
      isSameDay(new Date(order.orderDate), selectedDate);
    
    // Filter by status
    const matchesStatus = selectedStatus === "" || 
      order.status === selectedStatus;
    
    return matchesSearch && matchesDate && matchesStatus;
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Bons de Commande Récents</CardTitle>
          <CardDescription>
            Visualisez et gérez les bons de commande récemment créés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PurchaseOrderFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />

          {filteredOrders.length > 0 ? (
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
                {filteredOrders.map((order) => (
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
                            onClick={() => handleConvertClick(order)}
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
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium">Aucun bon de commande</h3>
              <p className="mt-1 text-gray-500">
                {searchTerm || selectedDate || selectedStatus 
                  ? "Aucun résultat ne correspond à votre recherche"
                  : "Commencez par créer un nouveau bon de commande pour un fournisseur"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {isPrintDialogOpen && selectedOrder && (
        <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Transformer le Bon de Commande en Achat</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p className="mb-4">
                Voulez-vous transformer ce bon de commande en achat de marchandises? 
                Cela marquera le bon de commande comme "Livré" et ajoutera les articles à votre stock.
              </p>
              
              <PrintablePurchaseOrder 
                supplier={{
                  id: selectedOrder.supplierId,
                  name: selectedOrder.supplierName,
                  contact: '',
                  phone: '',
                  email: '',
                  balance: 0,
                  totalInvoice: 0,
                  totalPaid: 0,
                  status: 'payée'
                }}
                reference={selectedOrder.reference}
                orderDate={selectedOrder.orderDate}
                deliveryDate={selectedOrder.deliveryDate}
                orderItems={selectedOrder.items}
                printRef={React.createRef()}
                orderId={selectedOrder.id}
                onConvertToPurchase={handleConfirmConvert}
                showControls={true}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
