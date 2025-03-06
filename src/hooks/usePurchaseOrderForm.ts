
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { OrderItem, Product, PurchaseOrder } from "@/types/purchaseOrder";
import { Supplier } from "@/data/suppliersData";

interface UsePurchaseOrderFormProps {
  supplier?: Supplier;
  initialOrder?: PurchaseOrder | null;
  onSave?: (order: PurchaseOrder) => void;
  onClose: () => void;
}

export const usePurchaseOrderForm = ({
  supplier,
  initialOrder = null,
  onSave,
  onClose
}: UsePurchaseOrderFormProps) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([{ id: 1, description: "", quantity: 1, unitPrice: 0 }]);
  const [orderDate, setOrderDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [reference, setReference] = useState<string>(`BC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(supplier || null);
  const [status, setStatus] = useState<'pending' | 'delivered' | 'cancelled'>('pending');
  const { toast } = useToast();

  useEffect(() => {
    if (initialOrder) {
      setOrderItems(initialOrder.items);
      setOrderDate(initialOrder.orderDate);
      setDeliveryDate(initialOrder.deliveryDate);
      setReference(initialOrder.reference);
      setStatus(initialOrder.status);
      
      if (initialOrder.supplierId) {
        setSelectedSupplier({
          id: initialOrder.supplierId,
          name: initialOrder.supplierName,
          contact: '',
          phone: '',
          email: '',
          balance: 0,
          totalInvoice: 0,
          totalPaid: 0,
          status: 'payée'
        });
      }
    }
  }, [initialOrder]);

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

  const validatePurchaseOrder = (): boolean => {
    if (!selectedSupplier) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fournisseur avant d'imprimer le bon de commande.",
        variant: "destructive"
      });
      return false;
    }

    if (orderItems.some(item => !item.description || !item.quantity || !item.unitPrice)) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs des articles avant d'imprimer.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const createPurchaseOrder = (): PurchaseOrder | null => {
    if (!selectedSupplier) return null;
    
    const total = orderItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    return {
      id: initialOrder?.id || `${Date.now()}`,
      reference,
      orderDate,
      deliveryDate,
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      status,
      items: orderItems,
      total,
      createdAt: initialOrder?.createdAt || new Date().toISOString()
    };
  };

  return {
    orderItems,
    orderDate,
    deliveryDate,
    reference,
    selectedSupplier,
    status,
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
    onSave,
    onClose
  };
};
