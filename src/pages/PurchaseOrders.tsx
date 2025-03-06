
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PurchaseOrderForm } from "@/components/suppliers/PurchaseOrderForm";
import { PurchaseOrdersList } from "@/components/suppliers/PurchaseOrdersList";
import { PurchaseOrder } from "@/types/purchaseOrder";
import { useToast } from "@/hooks/use-toast";

// In a real app, this would come from an API or state management
const loadOrders = (): PurchaseOrder[] => {
  const savedOrders = localStorage.getItem('purchaseOrders');
  return savedOrders ? JSON.parse(savedOrders) : [];
};

const saveOrders = (orders: PurchaseOrder[]) => {
  localStorage.setItem('purchaseOrders', JSON.stringify(orders));
};

const PurchaseOrders = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  const handleOpenForm = () => {
    setSelectedOrder(null);
    setIsFormOpen(true);
  };

  const handleSaveOrder = (order: PurchaseOrder) => {
    const updatedOrders = [...orders];
    const existingIndex = updatedOrders.findIndex(o => o.id === order.id);
    
    if (existingIndex >= 0) {
      updatedOrders[existingIndex] = order;
      toast({
        title: "Bon de commande mis à jour",
        description: `Le bon de commande ${order.reference} a été mis à jour.`,
      });
    } else {
      updatedOrders.push(order);
      toast({
        title: "Bon de commande créé",
        description: `Le bon de commande ${order.reference} a été créé avec succès.`,
      });
    }
    
    setOrders(updatedOrders);
    saveOrders(updatedOrders);
    setIsFormOpen(false);
  };

  const handleViewOrder = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setIsFormOpen(true);
  };

  const handleDeleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    saveOrders(updatedOrders);
    
    toast({
      title: "Bon de commande supprimé",
      description: "Le bon de commande a été supprimé avec succès.",
    });
  };

  const handleDuplicateOrder = (order: PurchaseOrder) => {
    const newOrder = {
      ...order,
      id: `${Date.now()}`,
      reference: `${order.reference}-COPIE`,
      createdAt: new Date().toISOString(),
      status: 'pending' as const
    };
    
    setSelectedOrder(newOrder);
    setIsFormOpen(true);
    
    toast({
      title: "Bon de commande dupliqué",
      description: "Vous pouvez maintenant modifier ce bon de commande.",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bons de Commande</h1>
            <p className="text-muted-foreground">
              Créez et gérez vos bons de commande pour les fournisseurs
            </p>
          </div>
          <Button onClick={handleOpenForm}>
            <Plus className="mr-2 h-4 w-4" /> Nouveau Bon de Commande
          </Button>
        </div>

        <PurchaseOrdersList 
          orders={orders} 
          onView={handleViewOrder}
          onDelete={handleDeleteOrder}
          onDuplicate={handleDuplicateOrder}
        />
      </div>

      {isFormOpen && (
        <PurchaseOrderForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          initialOrder={selectedOrder}
          onSave={handleSaveOrder}
        />
      )}
    </MainLayout>
  );
};

export default PurchaseOrders;
