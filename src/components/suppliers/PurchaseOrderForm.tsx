
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Supplier } from "@/data/suppliersData";
import { useToast } from "@/hooks/use-toast";
import { Printer, Plus, Trash2 } from "lucide-react";

interface PurchaseOrderFormProps {
  supplier: Supplier;
  isOpen: boolean;
  onClose: () => void;
}

interface OrderItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
}

export const PurchaseOrderForm = ({ supplier, isOpen, onClose }: PurchaseOrderFormProps) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([{ id: 1, description: "", quantity: 1, unitPrice: 0 }]);
  const [orderDate, setOrderDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [reference, setReference] = useState<string>(`BC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
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

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Bon de Commande - ${supplier.name}</title>
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
      description: `Le bon de commande pour ${supplier.name} a été généré et envoyé à l'impression.`,
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Bon de Commande - {supplier.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reference">Référence</Label>
              <Input 
                id="reference" 
                value={reference} 
                onChange={(e) => setReference(e.target.value)} 
                placeholder="BC-2023-0001" 
              />
            </div>
            <div>
              <Label htmlFor="orderDate">Date de commande</Label>
              <Input 
                id="orderDate" 
                type="date" 
                value={orderDate} 
                onChange={(e) => setOrderDate(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supplierName">Fournisseur</Label>
              <Input id="supplierName" value={supplier.name} readOnly />
            </div>
            <div>
              <Label htmlFor="deliveryDate">Date de livraison souhaitée</Label>
              <Input 
                id="deliveryDate" 
                type="date" 
                value={deliveryDate} 
                onChange={(e) => setDeliveryDate(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Articles</h3>
              <Button variant="outline" size="sm" onClick={addOrderItem}>
                <Plus className="h-4 w-4 mr-2" /> Ajouter
              </Button>
            </div>
            
            <div className="space-y-4">
              {orderItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <Label htmlFor={`item-${item.id}-desc`}>Description</Label>
                    <Input 
                      id={`item-${item.id}-desc`} 
                      value={item.description} 
                      onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                      placeholder="Description de l'article"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`item-${item.id}-qty`}>Quantité</Label>
                    <Input 
                      id={`item-${item.id}-qty`} 
                      type="number" 
                      min="1"
                      value={item.quantity} 
                      onChange={(e) => handleItemChange(item.id, "quantity", parseInt(e.target.value))}
                    />
                  </div>
                  <div className="col-span-3">
                    <Label htmlFor={`item-${item.id}-price`}>Prix unitaire (FCFA)</Label>
                    <Input 
                      id={`item-${item.id}-price`} 
                      type="number"
                      min="0" 
                      value={item.unitPrice} 
                      onChange={(e) => handleItemChange(item.id, "unitPrice", parseInt(e.target.value))}
                    />
                  </div>
                  <div className="col-span-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeOrderItem(item.id)}
                      disabled={orderItems.length <= 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-4">
              <div className="w-1/3">
                <div className="flex justify-between py-2">
                  <span className="font-medium">Total:</span>
                  <span className="font-medium">{calculateTotal().toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden div for printing */}
        <div className="hidden">
          <div ref={printRef} className="purchase-order">
            <div className="header">
              <div className="company-info">
                <h1>BON DE COMMANDE</h1>
                <p><strong>Référence:</strong> {reference}</p>
                <p><strong>Date:</strong> {orderDate}</p>
                {deliveryDate && <p><strong>Livraison souhaitée:</strong> {deliveryDate}</p>}
              </div>
            </div>
            
            <div className="supplier-info">
              <h2>Fournisseur</h2>
              <p><strong>{supplier.name}</strong></p>
              <p>Contact: {supplier.contact}</p>
              <p>Téléphone: {supplier.phone}</p>
              <p>Email: {supplier.email}</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantité</th>
                  <th>Prix unitaire (FCFA)</th>
                  <th>Total (FCFA)</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unitPrice.toLocaleString()}</td>
                    <td>{(item.quantity * item.unitPrice).toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td colSpan={3}>Total</td>
                  <td>{calculateTotal().toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            
            <div className="footer">
              <p>Signature autorisée</p>
              <div style={{ height: '50px' }}></div>
              <p>_________________________</p>
            </div>
          </div>
        </div>
        
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
