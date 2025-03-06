
import React, { useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Supplier } from "@/data/suppliersData";
import { PurchaseOrder } from "@/types/purchaseOrder";
import { OrderItemsList } from "./OrderItemsList";
import { PurchaseOrderInfo } from "./PurchaseOrderInfo";
import { PrintablePurchaseOrder } from "./PrintablePurchaseOrder";
import { PurchaseOrderActions } from "./PurchaseOrderActions";
import { usePurchaseOrderForm } from "@/hooks/usePurchaseOrderForm";

interface PurchaseOrderFormProps {
  supplier?: Supplier;
  isOpen: boolean;
  onClose: () => void;
  initialOrder?: PurchaseOrder | null;
  onSave?: (order: PurchaseOrder) => void;
}

export const PurchaseOrderForm = ({ 
  supplier, 
  isOpen, 
  onClose, 
  initialOrder = null,
  onSave 
}: PurchaseOrderFormProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  
  const {
    orderItems,
    orderDate,
    deliveryDate,
    reference,
    selectedSupplier,
    setOrderDate,
    setDeliveryDate,
    setReference,
    setSelectedSupplier,
    addOrderItem,
    removeOrderItem,
    handleItemChange,
    handleSelectProduct,
    validatePurchaseOrder,
    createPurchaseOrder,
    toast,
  } = usePurchaseOrderForm({
    supplier,
    initialOrder,
    onSave,
    onClose
  });

  const handlePrint = () => {
    if (!validatePurchaseOrder()) return;

    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Bon de Commande - ${selectedSupplier?.name}</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 0; 
            }
            .purchase-order { 
              width: 210mm; 
              min-height: 297mm; 
              padding: 20mm; 
              margin: 0 auto; 
              box-sizing: border-box;
            }
            .header { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 20px; 
            }
            .company-info { margin-bottom: 30px; }
            .supplier-info { margin-bottom: 30px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            table, th, td { border: 1px solid #ddd; }
            th, td { padding: 10px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total-row { font-weight: bold; }
            .footer { margin-top: 50px; text-align: right; }
            @media print {
              html, body {
                width: 210mm;
                height: 297mm;
              }
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <script>
            window.onload = function() { window.print(); window.close(); };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    
    if (onSave && selectedSupplier) {
      const purchaseOrder = createPurchaseOrder();
      if (purchaseOrder) {
        onSave(purchaseOrder);
      }
    } else {
      toast({
        title: "Bon de commande créé",
        description: `Le bon de commande pour ${selectedSupplier?.name} a été généré et envoyé à l'impression.`,
      });
      
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Bon de Commande - {selectedSupplier ? selectedSupplier.name : "Nouveau"}</DialogTitle>
        </DialogHeader>
        
        <PurchaseOrderInfo 
          reference={reference}
          orderDate={orderDate}
          deliveryDate={deliveryDate}
          supplier={selectedSupplier}
          onReferenceChange={setReference}
          onOrderDateChange={setOrderDate}
          onDeliveryDateChange={setDeliveryDate}
          onSupplierChange={setSelectedSupplier}
        />
        
        <OrderItemsList 
          orderItems={orderItems}
          onAddItem={addOrderItem}
          onRemoveItem={removeOrderItem}
          onItemChange={handleItemChange}
          onSelectProduct={handleSelectProduct}
        />
        
        {selectedSupplier && (
          <PrintablePurchaseOrder 
            supplier={selectedSupplier}
            reference={reference}
            orderDate={orderDate}
            deliveryDate={deliveryDate}
            orderItems={orderItems}
            printRef={printRef}
          />
        )}
        
        <PurchaseOrderActions 
          onPrint={handlePrint}
          onClose={onClose}
          isSaveMode={!!onSave}
        />
      </DialogContent>
    </Dialog>
  );
};
