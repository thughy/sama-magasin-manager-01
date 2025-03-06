
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PurchaseOrder } from "@/types/purchaseOrder";
import { PrintablePurchaseOrder } from "./PrintablePurchaseOrder";

interface PurchaseOrderConvertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedOrder: PurchaseOrder | null;
  onConvertToPurchase: (orderId: string) => void;
}

export const PurchaseOrderConvertDialog = ({
  open,
  onOpenChange,
  selectedOrder,
  onConvertToPurchase
}: PurchaseOrderConvertDialogProps) => {
  if (!selectedOrder) return null;

  const handleConfirmConvert = (orderId: string) => {
    onConvertToPurchase(orderId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
};
