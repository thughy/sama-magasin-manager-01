
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Supplier } from "@/data/suppliersData";
import { useToast } from "@/hooks/use-toast";
import { Printer } from "lucide-react";
import { OrderItem, Product } from "@/types/purchaseOrder";
import { OrderItemsList } from "./OrderItemsList";
import { PurchaseOrderInfo } from "./PurchaseOrderInfo";
import { PrintablePurchaseOrder } from "./PrintablePurchaseOrder";

interface PurchaseOrderFormProps {
  supplier?: Supplier;
  isOpen: boolean;
  onClose: () => void;
}

export const PurchaseOrderForm = ({ supplier, isOpen, onClose }: PurchaseOrderFormProps) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([{ id: 1, description: "", quantity: 1, unitPrice: 0 }]);
  const [orderDate, setOrderDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [reference, setReference] = useState<string>(`BC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(supplier || null);
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const addOrderItem = () => {
    const newId = orderItems.length > 0 ? Math.max(...orderItems.map(item => item.id)) + 1 : 1;
    setOrderItems([...orderItems, { id: newId, description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeOrderItem = (id: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id: number, field: keyof OrderItem, value: string | number) => {
    setOrderItems(
      orderItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSelectProduct = (itemId: number, product: Product) => {
    setOrderItems(
      orderItems.map(item => 
        item.id === itemId ? {
          ...item,
          description: `${product.id}-${product.name} (${product.barcode})`,
          unitPrice: product.purchasePrice,
          barcode: product.barcode,
          sellPrice: product.sellPrice
        } : item
      )
    );
  };
  
  const handlePrint = () => {
    if (!selectedSupplier) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fournisseur avant d'imprimer le bon de commande.",
        variant: "destructive"
      });
      return;
    }

    if (orderItems.some(item => !item.description || !item.quantity || !item.unitPrice)) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs des articles avant d'imprimer.",
        variant: "destructive"
      });
      return;
    }

    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Bon de Commande - ${selectedSupplier.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .purchase-order { width: 210mm; min-height: 297mm; padding: 20mm; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .company-info { margin-bottom: 30px; }
            .supplier-info { margin-bottom: 30px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            table, th, td { border: 1px solid #ddd; }
            th, td { padding: 10px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total-row { font-weight: bold; }
            .footer { margin-top: 50px; text-align: right; }
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
    
    toast({
      title: "Bon de commande créé",
      description: `Le bon de commande pour ${selectedSupplier.name} a été généré et envoyé à l'impression.`,
    });
    
    onClose();
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
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" /> Imprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
