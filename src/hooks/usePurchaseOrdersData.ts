
import { useState, useEffect } from "react";
import { PurchaseOrder } from "@/types/purchaseOrder";
import { useToast } from "@/hooks/use-toast";

// Helper functions for local storage
export const loadOrders = (): PurchaseOrder[] => {
  const savedOrders = localStorage.getItem('purchaseOrders');
  return savedOrders ? JSON.parse(savedOrders) : [];
};

export const saveOrders = (orders: PurchaseOrder[]) => {
  localStorage.setItem('purchaseOrders', JSON.stringify(orders));
};

export const loadInventory = (): any[] => {
  const savedInventory = localStorage.getItem('inventory');
  return savedInventory ? JSON.parse(savedInventory) : [];
};

export const saveInventory = (inventory: any[]) => {
  localStorage.setItem('inventory', JSON.stringify(inventory));
};

export const usePurchaseOrdersData = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
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

  const handleConvertToPurchase = (orderId: string) => {
    // Find the order to convert
    const orderToConvert = orders.find(order => order.id === orderId);
    if (!orderToConvert) return;
    
    // Update order status to 'delivered'
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'delivered' as const } 
        : order
    );
    
    setOrders(updatedOrders);
    saveOrders(updatedOrders);
    
    // In a real application, you would update inventory here
    // For now, we'll simulate adding to inventory in localStorage
    const currentInventory = loadInventory();
    
    // Add items from the purchase order to inventory
    const updatedInventory = [...currentInventory];
    
    orderToConvert.items.forEach(item => {
      // Extract product ID if available in the description (format: "ID-ProductName")
      let productId = null;
      const descriptionParts = item.description.split('-');
      if (descriptionParts.length > 1 && !isNaN(Number(descriptionParts[0]))) {
        productId = Number(descriptionParts[0]);
      }
      
      if (productId) {
        // Check if product already exists in inventory
        const existingItemIndex = updatedInventory.findIndex(
          invItem => invItem.id === productId
        );
        
        if (existingItemIndex >= 0) {
          // Update existing inventory item
          updatedInventory[existingItemIndex].quantity += item.quantity;
        } else {
          // Add new inventory item
          updatedInventory.push({
            id: productId,
            name: item.description.substring(item.description.indexOf('-') + 1),
            barcode: item.barcode || '',
            quantity: item.quantity,
            purchasePrice: item.unitPrice,
            sellPrice: item.sellPrice || 0,
          });
        }
      } else {
        // If no product ID found, create a new inventory item
        updatedInventory.push({
          id: Date.now() + Math.floor(Math.random() * 1000),
          name: item.description,
          barcode: item.barcode || '',
          quantity: item.quantity,
          purchasePrice: item.unitPrice,
          sellPrice: item.sellPrice || 0,
        });
      }
    });
    
    saveInventory(updatedInventory);
    
    toast({
      title: "Achat enregistré",
      description: `Le bon de commande ${orderToConvert.reference} a été transformé en achat et ajouté à votre stock.`,
    });
  };

  return {
    orders,
    isFormOpen,
    selectedOrder,
    handleOpenForm,
    handleSaveOrder,
    handleViewOrder,
    handleDeleteOrder,
    handleDuplicateOrder,
    handleConvertToPurchase,
    setIsFormOpen
  };
};
